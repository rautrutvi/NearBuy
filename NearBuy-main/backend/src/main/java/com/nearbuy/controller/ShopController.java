package com.nearbuy.controller;

import com.nearbuy.dto.ShopResponse;
import com.nearbuy.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public controller for discovering approved shops and searching nearby locations.
 */
@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    /**
     * GET /api/shops - Returns all approved shops.
     */
    @GetMapping
    public ResponseEntity<List<ShopResponse>> getApprovedShops() {
        return ResponseEntity.ok(shopService.getApprovedShops());
    }

    /**
     * GET /api/shops/{id} - Returns public shop details by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ShopResponse> getShopById(@PathVariable Long id) {
        return ResponseEntity.ok(shopService.getShopById(id));
    }

    /**
     * GET /api/shops/nearby?lat=&lng=&radiusKm= - Returns approved shops within radius.
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<ShopResponse>> getNearbyShops(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10.0") double radiusKm
    ) {
        return ResponseEntity.ok(shopService.getNearbyApprovedShops(lat, lng, radiusKm));
    }
}
