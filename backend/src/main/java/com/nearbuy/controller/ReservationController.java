package com.nearbuy.controller;

import com.nearbuy.dto.CreateReservationRequest;
import com.nearbuy.dto.ReservationResponse;
import com.nearbuy.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for customer reservation placement, tracking, and mock payments.
 */
@RestController
@RequestMapping("/api/customer/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * POST /api/customer/reservations - Reserves products with 30-min hold.
     */
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReservationResponse response = reservationService.createReservation(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/customer/reservations - Returns customer's active and previous orders.
     */
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(reservationService.getCustomerReservations(userDetails.getUsername()));
    }

    /**
     * POST /api/customer/reservations/{id}/pay - Simulates order payment.
     */
    @PostMapping("/{id}/pay")
    public ResponseEntity<ReservationResponse> payReservation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(reservationService.payReservation(id, userDetails.getUsername()));
    }
}
