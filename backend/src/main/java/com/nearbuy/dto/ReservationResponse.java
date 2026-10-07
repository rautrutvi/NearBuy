package com.nearbuy.dto;

import com.nearbuy.entity.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String code;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long shopId;
    private String shopName;
    private String shopAddress;
    private ReservationStatus status;
    private BigDecimal totalAmount;
    private boolean paid;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private List<ReservationItemResponse> items;
}
