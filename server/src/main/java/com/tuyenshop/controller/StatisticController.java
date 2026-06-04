package com.tuyenshop.controller;

import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.payload.response.StatisticResponse;
import com.tuyenshop.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StatisticResponse> getDashboardStatistics() {
        return ApiResponse.success(statisticService.getDashboardStatistics());
    }
}
