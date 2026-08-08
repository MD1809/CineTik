package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.FBSalesResponse;
import com.cinetik.dto.MovieSalesResponse;
import com.cinetik.dto.RevenueReportResponse;
import com.cinetik.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final ReportService reportService;

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<RevenueReportResponse>> getRevenueReport(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        RevenueReportResponse report = reportService.getRevenueReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo tổng doanh thu thành công", report));
    }

    @GetMapping("/movies")
    public ResponseEntity<ApiResponse<List<MovieSalesResponse>>> getMovieSalesReports(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        List<MovieSalesResponse> reports = reportService.getMovieSalesReports(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo doanh số theo phim thành công", reports));
    }

    @GetMapping("/fb-items")
    public ResponseEntity<ApiResponse<List<FBSalesResponse>>> getFBSalesReports(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        List<FBSalesResponse> reports = reportService.getFBSalesReports(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Lấy báo cáo doanh số Bắp Nước F&B thành công", reports));
    }
}
