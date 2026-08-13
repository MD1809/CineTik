package com.cinetik.service.impl;

import com.cinetik.dto.SeatPriceRequest;
import com.cinetik.dto.SeatPriceResponse;
import com.cinetik.entity.SeatPriceConfig;
import com.cinetik.repository.SeatPriceConfigRepository;
import com.cinetik.service.SeatPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatPriceServiceImpl implements SeatPriceService {

    private final SeatPriceConfigRepository seatPriceConfigRepository;

    @Override
    public List<SeatPriceResponse> getAllSeatPrices() {
        return seatPriceConfigRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SeatPriceResponse updateSeatPrice(Long id, SeatPriceRequest request) {
        SeatPriceConfig config = seatPriceConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu hình giá ghế với ID: " + id));

        if (request.getGiaGoc() == null || request.getGiaGoc().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Giá gốc ghế không được nhỏ hơn 0");
        }

        config.setGiaGoc(request.getGiaGoc());
        SeatPriceConfig updated = seatPriceConfigRepository.save(config);
        return mapToResponse(updated);
    }

    private SeatPriceResponse mapToResponse(SeatPriceConfig config) {
        return SeatPriceResponse.builder()
                .id(config.getId())
                .loaiGhe(config.getLoaiGhe())
                .tenLoaiGhe(config.getTenLoaiGhe())
                .giaGoc(config.getGiaGoc())
                .build();
    }
}
