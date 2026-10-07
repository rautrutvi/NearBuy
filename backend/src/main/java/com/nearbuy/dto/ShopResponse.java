package com.nearbuy.dto;

import com.nearbuy.entity.VerifiedStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private String category;
    private VerifiedStatus verifiedStatus;
    private String openingHours;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Double avgRating;
    private long reviewCount;
    private boolean isOpen;
    private String floodStatus; // "SAFE" | "WATCH" | "SEVERE"
    private Double distanceKm;
}
