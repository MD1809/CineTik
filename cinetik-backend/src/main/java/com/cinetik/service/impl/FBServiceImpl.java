package com.cinetik.service.impl;

import com.cinetik.dto.FBItemRequest;
import com.cinetik.dto.FBItemResponse;
import com.cinetik.entity.FBItem;
import com.cinetik.entity.FBStatus;
import com.cinetik.repository.FBItemRepository;
import com.cinetik.service.FBService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FBServiceImpl implements FBService {

    private final FBItemRepository fbItemRepository;

    @Override
    public List<FBItemResponse> getPublicFBItems() {
        return fbItemRepository.findByTrangThai(FBStatus.AVAILABLE).stream()
                .map(this::mapToFBItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FBItemResponse> getAllFBItems() {
        return fbItemRepository.findAll().stream()
                .map(this::mapToFBItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FBItemResponse getFBItemById(Long id) {
        FBItem item = fbItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món Bắp Nước F&B với ID: " + id));
        return mapToFBItemResponse(item);
    }

    @Override
    public FBItemResponse createFBItem(FBItemRequest request) {
        FBItem item = FBItem.builder()
                .tenItem(request.getTenItem())
                .giaTien(request.getGiaTien())
                .moTa(request.getMoTa())
                .hinhAnh(request.getHinhAnh())
                .trangThai(request.getTrangThai())
                .build();

        FBItem savedItem = fbItemRepository.save(item);
        return mapToFBItemResponse(savedItem);
    }

    @Override
    public FBItemResponse updateFBItem(Long id, FBItemRequest request) {
        FBItem item = fbItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món Bắp Nước F&B với ID: " + id));

        item.setTenItem(request.getTenItem());
        item.setGiaTien(request.getGiaTien());
        item.setMoTa(request.getMoTa());
        item.setHinhAnh(request.getHinhAnh());
        item.setTrangThai(request.getTrangThai());

        FBItem updatedItem = fbItemRepository.save(item);
        return mapToFBItemResponse(updatedItem);
    }

    @Override
    public void deleteFBItem(Long id) {
        FBItem item = fbItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món Bắp Nước F&B với ID: " + id));

        item.setTrangThai(FBStatus.OUT_OF_STOCK);
        fbItemRepository.save(item);
    }

    private FBItemResponse mapToFBItemResponse(FBItem item) {
        return FBItemResponse.builder()
                .id(item.getId())
                .tenItem(item.getTenItem())
                .giaTien(item.getGiaTien())
                .moTa(item.getMoTa())
                .hinhAnh(item.getHinhAnh())
                .trangThai(item.getTrangThai())
                .build();
    }
}
