package com.nearbuy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private Long shopId;
    private String shopName;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private String category;
    private String barcode;
    private String imageUrl;
    private Integer lowStockThreshold;
    private LocalDateTime createdAt;
    private String stockLabel; // "IN_STOCK" | "LOW" | "OUT"
}
