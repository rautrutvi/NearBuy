package com.nearbuy.dto;

import com.nearbuy.entity.FloodZoneStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FloodZoneVerificationRequest {

    @NotNull(message = "Status is required")
    private FloodZoneStatus status;
}
