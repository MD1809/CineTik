package com.cinetik.service.impl;

import com.cinetik.dto.PricingRuleRequest;
import com.cinetik.dto.PricingRuleResponse;
import com.cinetik.entity.PricingRule;
import com.cinetik.repository.PricingRuleRepository;
import com.cinetik.service.PricingRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PricingRuleServiceImpl implements PricingRuleService {

    private final PricingRuleRepository pricingRuleRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public List<PricingRuleResponse> getAllPricingRules() {
        return pricingRuleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PricingRuleResponse getPricingRuleById(Long id) {
        PricingRule rule = pricingRuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy tắc giá với ID: " + id));
        return mapToResponse(rule);
    }

    @Override
    @Transactional
    public PricingRuleResponse createPricingRule(PricingRuleRequest request) {
        LocalTime start = parseTime(request.getGioBatDau());
        LocalTime end = parseTime(request.getGioKetThuc());
        LocalDate specificDate = parseDate(request.getNgayCuThe());

        PricingRule rule = PricingRule.builder()
                .tenQuyTac(request.getTenQuyTac())
                .loaiDieuChinh(request.getLoaiDieuChinh())
                .hinhThuc(request.getHinhThuc())
                .giaTri(request.getGiaTri())
                .loaiNgay(request.getLoaiNgay())
                .ngayCuThe(specificDate)
                .gioBatDau(start)
                .gioKetThuc(end)
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : true)
                .build();

        PricingRule saved = pricingRuleRepository.save(rule);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public PricingRuleResponse updatePricingRule(Long id, PricingRuleRequest request) {
        PricingRule rule = pricingRuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy tắc giá với ID: " + id));

        rule.setTenQuyTac(request.getTenQuyTac());
        rule.setLoaiDieuChinh(request.getLoaiDieuChinh());
        rule.setHinhThuc(request.getHinhThuc());
        rule.setGiaTri(request.getGiaTri());
        rule.setLoaiNgay(request.getLoaiNgay());
        rule.setNgayCuThe(parseDate(request.getNgayCuThe()));
        rule.setGioBatDau(parseTime(request.getGioBatDau()));
        rule.setGioKetThuc(parseTime(request.getGioKetThuc()));

        if (request.getTrangThai() != null) {
            rule.setTrangThai(request.getTrangThai());
        }

        PricingRule updated = pricingRuleRepository.save(rule);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deletePricingRule(Long id) {
        if (!pricingRuleRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy quy tắc giá với ID: " + id);
        }
        pricingRuleRepository.deleteById(id);
    }

    private LocalTime parseTime(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) return null;
        try {
            if (timeStr.length() == 5) {
                return LocalTime.parse(timeStr, TIME_FORMATTER);
            }
            return LocalTime.parse(timeStr);
        } catch (Exception e) {
            return null;
        }
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        } catch (Exception e) {
            return null;
        }
    }

    private PricingRuleResponse mapToResponse(PricingRule rule) {
        return PricingRuleResponse.builder()
                .id(rule.getId())
                .tenQuyTac(rule.getTenQuyTac())
                .loaiDieuChinh(rule.getLoaiDieuChinh())
                .hinhThuc(rule.getHinhThuc())
                .giaTri(rule.getGiaTri())
                .loaiNgay(rule.getLoaiNgay())
                .ngayCuThe(rule.getNgayCuThe() != null ? rule.getNgayCuThe().format(DATE_FORMATTER) : null)
                .gioBatDau(rule.getGioBatDau() != null ? rule.getGioBatDau().format(TIME_FORMATTER) : null)
                .gioKetThuc(rule.getGioKetThuc() != null ? rule.getGioKetThuc().format(TIME_FORMATTER) : null)
                .trangThai(rule.getTrangThai())
                .build();
    }
}
