package com.nearbuy.dto;

import com.nearbuy.entity.VerifiedStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopVerificationRequest {

    @NotNull(message = "Status is required")
    private VerifiedStatus status;
}
