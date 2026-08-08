package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.FBItemRequest;
import com.cinetik.dto.FBItemResponse;
import com.cinetik.service.FBService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/fb-items")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFBController {

    private final FBService fbService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FBItemResponse>>> getAllFBItems() {
        List<FBItemResponse> items = fbService.getAllFBItems();
        return ResponseEntity.ok(ApiResponse.success("Lấy tất cả danh mục Bắp Nước thành công", items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FBItemResponse>> createFBItem(@Valid @RequestBody FBItemRequest request) {
        FBItemResponse response = fbService.createFBItem(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo món Bắp Nước thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FBItemResponse>> updateFBItem(
            @PathVariable Long id,
            @Valid @RequestBody FBItemRequest request) {
        FBItemResponse response = fbService.updateFBItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật món Bắp Nước thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFBItem(@PathVariable Long id) {
        fbService.deleteFBItem(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa món Bắp Nước thành công", null));
    }
}
