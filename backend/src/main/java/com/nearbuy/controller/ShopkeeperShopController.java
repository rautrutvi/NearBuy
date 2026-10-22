package com.nearbuy.controller;

import com.nearbuy.dto.ShopRequest;
import com.nearbuy.dto.ShopResponse;
import com.nearbuy.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for shopkeepers to manage their own shops.
 */
@RestController
@RequestMapping("/api/shopkeeper/shops")
@RequiredArgsConstructor
public class ShopkeeperShopController {

    private final ShopService shopService;

    /**
     * POST /api/shopkeeper/shops - Registers a new shop under the current shopkeeper.
     */
    @PostMapping
    public ResponseEntity<ShopResponse> createShop(
            @Valid @RequestBody ShopRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ShopResponse response = shopService.createShop(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * PUT /api/shopkeeper/shops/{id} - Updates a shop (enforcing ownership).
     */
    @PutMapping("/{id}")
    public ResponseEntity<ShopResponse> updateShop(
            @PathVariable Long id,
            @Valid @RequestBody ShopRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ShopResponse response = shopService.updateShop(id, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/shopkeeper/shops/mine - Returns shops belonging to current shopkeeper.
     */
    @GetMapping("/mine")
    public ResponseEntity<List<ShopResponse>> getMyShops(@AuthenticationPrincipal UserDetails userDetails) {
        List<ShopResponse> responses = shopService.getMyShop(userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }
}
