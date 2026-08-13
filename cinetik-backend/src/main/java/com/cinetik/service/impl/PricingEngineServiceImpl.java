package com.cinetik.service.impl;

import com.cinetik.dto.CalculatePriceResponse;
import com.cinetik.dto.ShowtimeResponse;
import com.cinetik.entity.*;
import com.cinetik.repository.PricingRuleRepository;
import com.cinetik.service.PricingEngineService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import com.cinetik.repository.SeatPriceConfigRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class PricingEngineServiceImpl implements PricingEngineService {

    private final ObjectMapper objectMapper;
    private final PricingRuleRepository pricingRuleRepository;
    private final SeatPriceConfigRepository seatPriceConfigRepository;

    @Override
    public CalculatePriceResponse calculateTicketPrice(Showtime showtime, List<Seat> seats) {
        BigDecimal tongTien = BigDecimal.ZERO;
        List<CalculatePriceResponse.SeatPriceDetail> details = new ArrayList<>();

        // Fetch all active rules
        List<PricingRule> activeRules = pricingRuleRepository.findByTrangThaiTrue();
        List<PricingRule> matchedRules = getMatchedRules(showtime, activeRules);

        Map<String, CalculatePriceResponse.AppliedAdjustmentDetail> adjustmentSummaryMap = new LinkedHashMap<>();

        for (Seat seat : seats) {
            BigDecimal basePrice = getSeatBasePriceOnly(showtime, seat);
            BigDecimal tongPhuThu = BigDecimal.ZERO;
            BigDecimal tongGiamGia = BigDecimal.ZERO;

            for (PricingRule rule : matchedRules) {
                BigDecimal adjustmentAmount = BigDecimal.ZERO;
                if (rule.getHinhThuc() == DiscountType.PERCENTAGE) {
                    // % calculated on base seat price
                    adjustmentAmount = basePrice.multiply(rule.getGiaTri())
                            .divide(new BigDecimal("100"), 0, RoundingMode.HALF_UP);
                } else {
                    adjustmentAmount = rule.getGiaTri();
                }

                if (rule.getLoaiDieuChinh() == AdjustmentType.SURCHARGE) {
                    tongPhuThu = tongPhuThu.add(adjustmentAmount);
                    adjustmentSummaryMap.putIfAbsent(rule.getTenQuyTac(),
                            CalculatePriceResponse.AppliedAdjustmentDetail.builder()
                                    .tenQuyTac(rule.getTenQuyTac())
                                    .loaiDieuChinh(AdjustmentType.SURCHARGE)
                                    .soTien(adjustmentAmount)
                                    .build());
                } else {
                    tongGiamGia = tongGiamGia.add(adjustmentAmount);
                    adjustmentSummaryMap.putIfAbsent(rule.getTenQuyTac(),
                            CalculatePriceResponse.AppliedAdjustmentDetail.builder()
                                    .tenQuyTac(rule.getTenQuyTac())
                                    .loaiDieuChinh(AdjustmentType.DISCOUNT)
                                    .soTien(adjustmentAmount.negate()) // negative for discount
                                    .build());
                }
            }

            // Guard Clause: Final price cannot be lower than 0
            BigDecimal donGia = basePrice.add(tongPhuThu).subtract(tongGiamGia);
            if (donGia.compareTo(BigDecimal.ZERO) < 0) {
                donGia = BigDecimal.ZERO;
            }

            tongTien = tongTien.add(donGia);

            details.add(CalculatePriceResponse.SeatPriceDetail.builder()
                    .seatId(seat.getId())
                    .hang(seat.getHang())
                    .cot(seat.getCot())
                    .loaiGhe(seat.getLoaiGhe())
                    .giaGoc(basePrice)
                    .tongPhuThu(tongPhuThu)
                    .tongGiamGia(tongGiamGia)
                    .donGia(donGia)
                    .build());
        }

        return CalculatePriceResponse.builder()
                .showtimeId(showtime.getId())
                .tongTien(tongTien)
                .appliedAdjustments(new ArrayList<>(adjustmentSummaryMap.values()))
                .details(details)
                .build();
    }

    @Override
    public BigDecimal getSeatBasePrice(Showtime showtime, Seat seat) {
        BigDecimal basePrice = getSeatBasePriceOnly(showtime, seat);
        List<PricingRule> activeRules = pricingRuleRepository.findByTrangThaiTrue();
        List<PricingRule> matchedRules = getMatchedRules(showtime, activeRules);

        BigDecimal tongPhuThu = BigDecimal.ZERO;
        BigDecimal tongGiamGia = BigDecimal.ZERO;

        for (PricingRule rule : matchedRules) {
            BigDecimal adjustmentAmount;
            if (rule.getHinhThuc() == DiscountType.PERCENTAGE) {
                adjustmentAmount = basePrice.multiply(rule.getGiaTri())
                        .divide(new BigDecimal("100"), 0, RoundingMode.HALF_UP);
            } else {
                adjustmentAmount = rule.getGiaTri();
            }

            if (rule.getLoaiDieuChinh() == AdjustmentType.SURCHARGE) {
                tongPhuThu = tongPhuThu.add(adjustmentAmount);
            } else {
                tongGiamGia = tongGiamGia.add(adjustmentAmount);
            }
        }

        BigDecimal finalPrice = basePrice.add(tongPhuThu).subtract(tongGiamGia);
        return finalPrice.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : finalPrice;
    }

    private BigDecimal getSeatBasePriceOnly(Showtime showtime, Seat seat) {
        BigDecimal basePrice = getDefaultPriceForSeatType(seat.getLoaiGhe());

        if (showtime.getBangGiaSetting() != null && !showtime.getBangGiaSetting().isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(showtime.getBangGiaSetting());
                String seatTypeKey = seat.getLoaiGhe().name();
                if (root.has(seatTypeKey)) {
                    basePrice = new BigDecimal(root.get(seatTypeKey).asText());
                } else if (root.has("phuThu")) {
                    // Legacy support for simple phuThu in JSON
                    basePrice = basePrice.add(new BigDecimal(root.get("phuThu").asText()));
                }
            } catch (Exception e) {
                log.warn("Could not parse showtime price setting JSON, using default: {}", e.getMessage());
            }
        }

        return basePrice;
    }

    private List<PricingRule> getMatchedRules(Showtime showtime, List<PricingRule> activeRules) {
        if (showtime == null || activeRules == null || activeRules.isEmpty()) {
            return Collections.emptyList();
        }

        LocalDate showDate = showtime.getNgayChieu() != null ? showtime.getNgayChieu() :
                (showtime.getThoiGianBatDau() != null ? showtime.getThoiGianBatDau().toLocalDate() : LocalDate.now());
        LocalTime startTime = showtime.getThoiGianBatDau() != null ? showtime.getThoiGianBatDau().toLocalTime() : LocalTime.of(12, 0);

        DayOfWeek showDayOfWeek = showDate.getDayOfWeek();
        boolean isWeekend = (showDayOfWeek == DayOfWeek.SATURDAY || showDayOfWeek == DayOfWeek.SUNDAY);

        List<PricingRule> matched = new ArrayList<>();
        for (PricingRule rule : activeRules) {
            // 1. Check DayType / Date
            DayType dayType = rule.getLoaiNgay();
            if (dayType == DayType.WEEKDAY && isWeekend) continue;
            if (dayType == DayType.WEEKEND && !isWeekend) continue;

            if (dayType == DayType.MONDAY && showDayOfWeek != DayOfWeek.MONDAY) continue;
            if (dayType == DayType.TUESDAY && showDayOfWeek != DayOfWeek.TUESDAY) continue;
            if (dayType == DayType.WEDNESDAY && showDayOfWeek != DayOfWeek.WEDNESDAY) continue;
            if (dayType == DayType.THURSDAY && showDayOfWeek != DayOfWeek.THURSDAY) continue;
            if (dayType == DayType.FRIDAY && showDayOfWeek != DayOfWeek.FRIDAY) continue;
            if (dayType == DayType.SATURDAY && showDayOfWeek != DayOfWeek.SATURDAY) continue;
            if (dayType == DayType.SUNDAY && showDayOfWeek != DayOfWeek.SUNDAY) continue;

            if (dayType == DayType.SPECIFIC_DATE) {
                if (rule.getNgayCuThe() == null || !showDate.equals(rule.getNgayCuThe())) {
                    continue;
                }
            }

            // 2. Check Time Window (With Midnight Wrap Support)
            if (isTimeInWindow(startTime, rule.getGioBatDau(), rule.getGioKetThuc())) {
                matched.add(rule);
            }
        }
        return matched;
    }

    private boolean isTimeInWindow(LocalTime checkTime, LocalTime gioBatDau, LocalTime gioKetThuc) {
        if (gioBatDau == null || gioKetThuc == null) return true;
        if (!gioKetThuc.isBefore(gioBatDau)) {
            // Standard time window (e.g., 18:00 to 22:00)
            return !checkTime.isBefore(gioBatDau) && !checkTime.isAfter(gioKetThuc);
        } else {
            // Midnight wrap-around time window (e.g., 23:00 to 02:00)
            return !checkTime.isBefore(gioBatDau) || !checkTime.isAfter(gioKetThuc);
        }
    }

    @Override
    public List<ShowtimeResponse.AdjustmentDetail> getAppliedSurcharges(Showtime showtime) {
        List<PricingRule> activeRules = pricingRuleRepository.findByTrangThaiTrue();
        List<PricingRule> matchedRules = getMatchedRules(showtime, activeRules);

        List<ShowtimeResponse.AdjustmentDetail> surcharges = new ArrayList<>();
        for (PricingRule rule : matchedRules) {
            if (rule.getLoaiDieuChinh() == AdjustmentType.SURCHARGE) {
                String formatted = rule.getHinhThuc() == DiscountType.PERCENTAGE
                        ? String.format("+%s%% (%s)", rule.getGiaTri().stripTrailingZeros().toPlainString(), rule.getTenQuyTac())
                        : String.format("+%,d VNĐ (%s)", rule.getGiaTri().longValue(), rule.getTenQuyTac());

                surcharges.add(ShowtimeResponse.AdjustmentDetail.builder()
                        .tenQuyTac(rule.getTenQuyTac())
                        .hinhThuc(rule.getHinhThuc().name())
                        .giaTri(rule.getGiaTri())
                        .formattedDisplay(formatted)
                        .build());
            }
        }
        return surcharges;
    }

    @Override
    public List<ShowtimeResponse.AdjustmentDetail> getAppliedDiscounts(Showtime showtime) {
        List<PricingRule> activeRules = pricingRuleRepository.findByTrangThaiTrue();
        List<PricingRule> matchedRules = getMatchedRules(showtime, activeRules);

        List<ShowtimeResponse.AdjustmentDetail> discounts = new ArrayList<>();
        for (PricingRule rule : matchedRules) {
            if (rule.getLoaiDieuChinh() == AdjustmentType.DISCOUNT) {
                String formatted = rule.getHinhThuc() == DiscountType.PERCENTAGE
                        ? String.format("-%s%% (%s)", rule.getGiaTri().stripTrailingZeros().toPlainString(), rule.getTenQuyTac())
                        : String.format("-%,d VNĐ (%s)", rule.getGiaTri().longValue(), rule.getTenQuyTac());

                discounts.add(ShowtimeResponse.AdjustmentDetail.builder()
                        .tenQuyTac(rule.getTenQuyTac())
                        .hinhThuc(rule.getHinhThuc().name())
                        .giaTri(rule.getGiaTri())
                        .formattedDisplay(formatted)
                        .build());
            }
        }
        return discounts;
    }

    private BigDecimal getDefaultPriceForSeatType(SeatType seatType) {
        return seatPriceConfigRepository.findByLoaiGhe(seatType)
                .map(SeatPriceConfig::getGiaGoc)
                .orElseGet(() -> {
                    if (seatType == SeatType.VIP) {
                        return new BigDecimal("100000");
                    } else if (seatType == SeatType.COUPLE) {
                        return new BigDecimal("150000");
                    }
                    return new BigDecimal("80000"); // SINGLE
                });
    }
}
