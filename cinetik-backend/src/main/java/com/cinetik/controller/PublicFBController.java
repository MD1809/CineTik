package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.FBItemResponse;
import com.cinetik.service.FBService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/fb-items")
@RequiredArgsConstructor
public class PublicFBController {

    private final FBService fbService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FBItemResponse>>> getPublicFBItems() {
        List<FBItemResponse> items = fbService.getPublicFBItems();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách Bắp Nước thành công", items));
    }
}
