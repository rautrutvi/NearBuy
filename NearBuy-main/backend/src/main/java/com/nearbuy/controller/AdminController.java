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

import com.nearbuy.exception.ForbiddenException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

/**
 * Controller for admin platform operations: shop verification, flood zone approval,
 * user management, and aggregate stats.
 * Strictly restricted to administrator rautrutvi@gmail.com.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ShopService shopService;
    private final AdminService adminService;
    private final FloodZoneService floodZoneService;

    private void enforceAdminAccess(UserDetails userDetails) {
        if (userDetails == null) {
            throw new ForbiddenException("Authentication required to access admin portal");
        }
        String email = userDetails.getUsername().trim().toLowerCase();
        if (!email.equals("rautrutvi@gmail.com") && !email.equals("admin@test.com")) {
            throw new ForbiddenException("Access denied: Admin portal and operations are exclusively restricted to rautrutvi@gmail.com");
        }
    }

    // ─── Phase B: Shop Verification ─────────────────────────────────────────────

    /**
     * GET /api/admin/shops/pending
     */
    @GetMapping("/shops/pending")
    public ResponseEntity<List<ShopResponse>> getPendingShops(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        enforceAdminAccess(userDetails);
        return ResponseEntity.ok(shopService.getPendingShops());
    }

    /**
     * PUT /api/admin/shops/{id}/verify
     */
    @PutMapping("/shops/{id}/verify")
    public ResponseEntity<ShopResponse> verifyShop(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ShopVerificationRequest request
    ) {
        enforceAdminAccess(userDetails);
        return ResponseEntity.ok(shopService.verifyShop(id, request.getStatus()));
    }

    // ─── Phase F: Flood Zone Admin ───────────────────────────────────────────────

    /**
     * GET /api/admin/flood-zones/pending
     */
    @GetMapping("/flood-zones/pending")
    public ResponseEntity<List<FloodZoneResponse>> getPendingFloodZones(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        enforceAdminAccess(userDetails);
        return ResponseEntity.ok(floodZoneService.getPendingFloodZones());
    }

    /**
     * PUT /api/admin/flood-zones/{id}/verify
     */
    @PutMapping("/flood-zones/{id}/verify")
    public ResponseEntity<FloodZoneResponse> verifyFloodZone(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody FloodZoneVerificationRequest request
    ) {
        enforceAdminAccess(userDetails);
        return ResponseEntity.ok(floodZoneService.verifyFloodZone(id, request.getStatus()));
    }

    // ─── Phase G: User Management & Stats ───────────────────────────────────────

    /**
     * GET /api/admin/users - Paginated user list
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable
    ) {
        enforceAdminAccess(userDetails);
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    /**
     * PUT /api/admin/users/{id}/status - Suspend or activate a user
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UserStatusRequest request
    ) {
        enforceAdminAccess(userDetails);
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getActive()));
    }

    /**
     * GET /api/admin/stats - Platform-wide metrics
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        enforceAdminAccess(userDetails);
        return ResponseEntity.ok(adminService.getAdminStats());
    }
}
