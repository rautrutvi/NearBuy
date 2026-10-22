package com.nearbuy.controller;

import com.nearbuy.dto.ReservationResponse;
import com.nearbuy.dto.ReservationStatusUpdateRequest;
import com.nearbuy.dto.ShopkeeperStatsResponse;
import com.nearbuy.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for shopkeepers to view reservations, fulfill orders, and monitor metrics.
 */
@RestController
@RequestMapping("/api/shopkeeper")
@RequiredArgsConstructor
public class ShopkeeperReservationController {

    private final ReservationService reservationService;

    /**
     * GET /api/shopkeeper/reservations - Returns all reservations for own shop.
     */
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getShopReservations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(reservationService.getShopkeeperReservations(userDetails.getUsername()));
    }

    /**
     * PUT /api/shopkeeper/reservations/{id}/status - Updates order status (PENDING -> READY -> PICKED_UP).
     */
    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationResponse> updateReservationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReservationStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReservationResponse response = reservationService.updateReservationStatus(id, request.getStatus(), userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/shopkeeper/stats - Returns pending orders, ready orders, and today's completions.
     */
    @GetMapping("/stats")
    public ResponseEntity<ShopkeeperStatsResponse> getShopkeeperStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(reservationService.getShopkeeperStats(userDetails.getUsername()));
    }
}
