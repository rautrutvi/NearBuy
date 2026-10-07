package com.nearbuy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalShops;
    private long totalUsers;
    private long activeUsersToday;
    private long reservationsToday;
    private double avgShopRating;
    private long pendingShopVerifications;
    private long pendingFloodReports;
}
