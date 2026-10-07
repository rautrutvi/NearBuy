package com.nearbuy.controller;

import com.nearbuy.dto.FloodZoneRequest;
import com.nearbuy.dto.FloodZoneResponse;
import com.nearbuy.service.FloodZoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for flood zone reporting, public active zones, and admin verification.
 */
@RestController
@RequiredArgsConstructor
public class FloodZoneController {

    private final FloodZoneService floodZoneService;

    /**
     * POST /api/reports/flood - Submits a flood zone report (any authenticated user).
     */
    @PostMapping("/api/reports/flood")
    public ResponseEntity<FloodZoneResponse> reportFloodZone(
            @Valid @RequestBody FloodZoneRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        FloodZoneResponse response = floodZoneService.reportFloodZone(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/flood-zones/active - Returns all currently active VERIFIED flood zones (public).
     */
    @GetMapping("/api/flood-zones/active")
    public ResponseEntity<List<FloodZoneResponse>> getActiveFloodZones() {
        return ResponseEntity.ok(floodZoneService.getActiveFloodZones());
    }
}
