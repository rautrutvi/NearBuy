package com.nearbuy.service;

import com.nearbuy.dto.FloodZoneRequest;
import com.nearbuy.dto.FloodZoneResponse;
import com.nearbuy.entity.FloodZone;
import com.nearbuy.entity.FloodZoneStatus;
import com.nearbuy.entity.User;
import com.nearbuy.exception.BadRequestException;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.repository.FloodZoneRepository;
import com.nearbuy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing flood zone reports, admin verifications, and expiry sweeps.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FloodZoneService {

    private final FloodZoneRepository floodZoneRepository;
    private final UserRepository userRepository;

    /**
     * Submits a new flood zone report by any authenticated user. Status defaults to PENDING.
     */
    @Transactional
    public FloodZoneResponse reportFloodZone(FloodZoneRequest request, String userEmail) {
        User reporter = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FloodZone zone = FloodZone.builder()
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .radiusMeters(request.getRadiusMeters())
                .reportedBy(reporter)
                .status(FloodZoneStatus.PENDING)
                .description(request.getDescription())
                .expiresAt(LocalDateTime.now().plusHours(6))
                .build();

        FloodZone saved = floodZoneRepository.save(zone);
        return mapToFloodZoneResponse(saved);
    }

    /**
     * Returns all currently VERIFIED, non-expired flood zones for the map view.
     */
    @Transactional(readOnly = true)
    public List<FloodZoneResponse> getActiveFloodZones() {
        return floodZoneRepository.findByStatusAndExpiresAtAfter(FloodZoneStatus.VERIFIED, LocalDateTime.now())
                .stream()
                .map(this::mapToFloodZoneResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns all PENDING flood zone reports waiting for admin review.
     */
    @Transactional(readOnly = true)
    public List<FloodZoneResponse> getPendingFloodZones() {
        return floodZoneRepository.findByStatus(FloodZoneStatus.PENDING)
                .stream()
                .map(this::mapToFloodZoneResponse)
                .collect(Collectors.toList());
    }

    /**
     * Admin: Verifies or rejects a pending flood zone report.
     */
    @Transactional
    public FloodZoneResponse verifyFloodZone(Long id, FloodZoneStatus status) {
        if (status != FloodZoneStatus.VERIFIED && status != FloodZoneStatus.REJECTED) {
            throw new BadRequestException("Admin can only set status to VERIFIED or REJECTED");
        }

        FloodZone zone = floodZoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flood zone not found with id: " + id));

        zone.setStatus(status);
        FloodZone updated = floodZoneRepository.save(zone);
        return mapToFloodZoneResponse(updated);
    }

    /**
     * Expires all VERIFIED zones that have passed their expiresAt time.
     */
    @Transactional
    public int expireOldFloodZones() {
        List<FloodZone> expiredZones = floodZoneRepository
                .findByStatusAndExpiresAtBefore(FloodZoneStatus.VERIFIED, LocalDateTime.now());

        for (FloodZone zone : expiredZones) {
            zone.setStatus(FloodZoneStatus.EXPIRED);
            floodZoneRepository.save(zone);
            log.info("Expired flood zone id={} at {}", zone.getId(), LocalDateTime.now());
        }

        return expiredZones.size();
    }

    public FloodZoneResponse mapToFloodZoneResponse(FloodZone zone) {
        return FloodZoneResponse.builder()
                .id(zone.getId())
                .latitude(zone.getLatitude())
                .longitude(zone.getLongitude())
                .radiusMeters(zone.getRadiusMeters())
                .reportedById(zone.getReportedBy().getId())
                .reportedByName(zone.getReportedBy().getName())
                .status(zone.getStatus())
                .description(zone.getDescription())
                .createdAt(zone.getCreatedAt())
                .expiresAt(zone.getExpiresAt())
                .build();
    }
}
