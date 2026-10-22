package com.nearbuy.dto;

import com.nearbuy.entity.FloodZoneStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FloodZoneResponse {
    private Long id;
    private Double latitude;
    private Double longitude;
    private Double radiusMeters;
    private Long reportedById;
    private String reportedByName;
    private FloodZoneStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
