package com.cinetik.service;

import com.cinetik.dto.FBSalesResponse;
import com.cinetik.dto.MovieSalesResponse;
import com.cinetik.dto.RevenueReportResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    RevenueReportResponse getRevenueReport(LocalDate startDate, LocalDate endDate);

    List<MovieSalesResponse> getMovieSalesReports(LocalDate startDate, LocalDate endDate);

    List<FBSalesResponse> getFBSalesReports(LocalDate startDate, LocalDate endDate);
}
