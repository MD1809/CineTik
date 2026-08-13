package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.PricingRuleRequest;
import com.cinetik.dto.PricingRuleResponse;
import com.cinetik.service.PricingRuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/pricing-rules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PricingRuleController {

    private final PricingRuleService pricingRuleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PricingRuleResponse>>> getAllPricingRules() {
        List<PricingRuleResponse> responses = pricingRuleService.getAllPricingRules();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách quy tắc giá thành công", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PricingRuleResponse>> getPricingRuleById(@PathVariable Long id) {
        PricingRuleResponse response = pricingRuleService.getPricingRuleById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin quy tắc giá thành công", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PricingRuleResponse>> createPricingRule(@Valid @RequestBody PricingRuleRequest request) {
        PricingRuleResponse response = pricingRuleService.createPricingRule(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo quy tắc giá mới thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PricingRuleResponse>> updatePricingRule(
            @PathVariable Long id,
            @Valid @RequestBody PricingRuleRequest request) {
        PricingRuleResponse response = pricingRuleService.updatePricingRule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật quy tắc giá thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePricingRule(@PathVariable Long id) {
        pricingRuleService.deletePricingRule(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa quy tắc giá thành công", null));
    }
}
