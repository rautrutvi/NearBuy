package com.nearbuy.controller;

import com.nearbuy.dto.ProductResponse;
import com.nearbuy.dto.ScanSellRequest;
import com.nearbuy.service.ScanSellService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for the shopkeeper barcode scan-to-sell flow.
 */
@RestController
@RequestMapping("/api/shopkeeper/scan-sell")
@RequiredArgsConstructor
public class ScanSellController {

    private final ScanSellService scanSellService;

    /**
     * POST /api/shopkeeper/scan-sell - Scan a product by barcode and deduct sold quantity.
     */
    @PostMapping
    public ResponseEntity<ProductResponse> scanAndSell(
            @Valid @RequestBody ScanSellRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ProductResponse response = scanSellService.scanAndSell(
                request.getBarcode(), request.getQuantity(), userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
