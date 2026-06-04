package com.tuyenshop.payload.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@Builder
public class StatisticResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalUsers;
    private long totalProducts;
    
    // e.g., PENDING: 5, DELIVERED: 10
    private Map<String, Long> ordersByStatus;
}
