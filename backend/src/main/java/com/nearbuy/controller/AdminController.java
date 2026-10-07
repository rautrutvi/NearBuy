package com.nearbuy.controller;

import com.nearbuy.dto.*;
import com.nearbuy.entity.FloodZoneStatus;
import com.nearbuy.entity.VerifiedStatus;
import com.nearbuy.service.AdminService;
import com.nearbuy.service.FloodZoneService;
import com.nearbuy.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for admin platform operations: shop verification, flood zone approval,
 * user management, and aggregate stats.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ShopService shopService;
    private final AdminService adminService;
    private final FloodZoneService floodZoneService;

    // ─── Phase B: Shop Verification ─────────────────────────────────────────────

    /**
     * GET /api/admin/shops/pending
     */
    @GetMapping("/shops/pending")
    public ResponseEntity<List<ShopResponse>> getPendingShops() {
        return ResponseEntity.ok(shopService.getPendingShops());
    }

    /**
     * PUT /api/admin/shops/{id}/verify
     */
    @PutMapping("/shops/{id}/verify")
    public ResponseEntity<ShopResponse> verifyShop(
            @PathVariable Long id,
            @Valid @RequestBody ShopVerificationRequest request
    ) {
        return ResponseEntity.ok(shopService.verifyShop(id, request.getStatus()));
    }

    // ─── Phase F: Flood Zone Admin ───────────────────────────────────────────────

    /**
     * GET /api/admin/flood-zones/pending
     */
    @GetMapping("/flood-zones/pending")
    public ResponseEntity<List<FloodZoneResponse>> getPendingFloodZones() {
        return ResponseEntity.ok(floodZoneService.getPendingFloodZones());
    }

    /**
     * PUT /api/admin/flood-zones/{id}/verify
     */
    @PutMapping("/flood-zones/{id}/verify")
    public ResponseEntity<FloodZoneResponse> verifyFloodZone(
            @PathVariable Long id,
            @Valid @RequestBody FloodZoneVerificationRequest request
    ) {
        return ResponseEntity.ok(floodZoneService.verifyFloodZone(id, request.getStatus()));
    }

    // ─── Phase G: User Management & Stats ───────────────────────────────────────

    /**
     * GET /api/admin/users - Paginated user list
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    /**
     * PUT /api/admin/users/{id}/status - Suspend or activate a user
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusRequest request
    ) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getActive()));
    }

    /**
     * GET /api/admin/stats - Platform-wide metrics
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }
}
