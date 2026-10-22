package com.nearbuy.service;

import com.nearbuy.dto.ShopRequest;
import com.nearbuy.dto.ShopResponse;
import com.nearbuy.entity.*;
import com.nearbuy.exception.ForbiddenException;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.repository.FloodZoneRepository;
import com.nearbuy.repository.ReviewRepository;
import com.nearbuy.repository.ShopRepository;
import com.nearbuy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Service managing shop profiles, admin verifications, Haversine nearby searches,
 * flood severity evaluations, and business hours status.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final FloodZoneRepository floodZoneRepository;
    private final ReviewRepository reviewRepository;

    private static final Pattern TIME_RANGE_PATTERN = Pattern.compile("(\\d{1,2}:\\d{2})\\s*(?:-|to)\\s*(\\d{1,2}:\\d{2})", Pattern.CASE_INSENSITIVE);

    /**
     * Creates a new shop owned by the authenticated shopkeeper with status PENDING.
     */
    @Transactional
    public ShopResponse createShop(ShopRequest request, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Shop shop = Shop.builder()
                .owner(owner)
                .name(request.getName().trim())
                .address(request.getAddress().trim())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .category(request.getCategory())
                .openingHours(request.getOpeningHours())
                .imageUrl(request.getImageUrl())
                .verifiedStatus(VerifiedStatus.PENDING)
                .build();

        Shop saved = shopRepository.save(shop);
        return mapToShopResponse(saved, null);
    }

    /**
     * Updates an existing shop. Enforces that only the shop's owner can update it.
     */
    @Transactional
    public ShopResponse updateShop(Long id, ShopRequest request, String ownerEmail) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + id));

        if (!shop.getOwner().getEmail().equalsIgnoreCase(ownerEmail.trim())) {
            throw new ForbiddenException("You can only modify your own shop");
        }

        shop.setName(request.getName().trim());
        shop.setAddress(request.getAddress().trim());
        shop.setLatitude(request.getLatitude());
        shop.setLongitude(request.getLongitude());
        shop.setCategory(request.getCategory());
        shop.setOpeningHours(request.getOpeningHours());
        shop.setImageUrl(request.getImageUrl());

        Shop updated = shopRepository.save(shop);
        return mapToShopResponse(updated, null);
    }

    /**
     * Retrieves all shops owned by the logged-in shopkeeper.
     */
    @Transactional(readOnly = true)
    public List<ShopResponse> getMyShop(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shopRepository.findByOwner(owner).stream()
                .map(shop -> mapToShopResponse(shop, null))
                .collect(Collectors.toList());
    }

    /**
     * Returns all APPROVED shops for public browsing.
     */
    @Transactional(readOnly = true)
    public List<ShopResponse> getApprovedShops() {
        return shopRepository.findByVerifiedStatus(VerifiedStatus.APPROVED).stream()
                .map(shop -> mapToShopResponse(shop, null))
                .collect(Collectors.toList());
    }

    /**
     * Returns public shop details by ID.
     */
    @Transactional(readOnly = true)
    public ShopResponse getShopById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + id));
        return mapToShopResponse(shop, null);
    }

    /**
     * Finds nearby approved shops within radiusKm using Haversine formula calculation.
     */
    @Transactional(readOnly = true)
    public List<ShopResponse> getNearbyApprovedShops(double lat, double lng, double radiusKm) {
        List<Shop> shops;
        try {
            shops = shopRepository.findNearbyApprovedShops(lat, lng, radiusKm);
        } catch (Exception e) {
            log.warn("Native query failed, falling back to Java Haversine filtering: {}", e.getMessage());
            shops = shopRepository.findByVerifiedStatus(VerifiedStatus.APPROVED).stream()
                    .filter(s -> haversineDistanceKm(lat, lng, s.getLatitude(), s.getLongitude()) <= radiusKm)
                    .sorted(Comparator.comparingDouble(s -> haversineDistanceKm(lat, lng, s.getLatitude(), s.getLongitude())))
                    .collect(Collectors.toList());
        }

        return shops.stream().map(shop -> {
            double distance = haversineDistanceKm(lat, lng, shop.getLatitude(), shop.getLongitude());
            double roundedDistance = BigDecimal.valueOf(distance).setScale(2, RoundingMode.HALF_UP).doubleValue();
            return mapToShopResponse(shop, roundedDistance);
        }).collect(Collectors.toList());
    }

    /**
     * Admin: Retrieves all pending shop verification requests.
     */
    @Transactional(readOnly = true)
    public List<ShopResponse> getPendingShops() {
        return shopRepository.findByVerifiedStatus(VerifiedStatus.PENDING).stream()
                .map(shop -> mapToShopResponse(shop, null))
                .collect(Collectors.toList());
    }

    /**
     * Admin: Updates shop verification status to APPROVED or REJECTED.
     */
    @Transactional
    public ShopResponse verifyShop(Long id, VerifiedStatus status) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + id));
        shop.setVerifiedStatus(status);
        Shop updated = shopRepository.save(shop);
        return mapToShopResponse(updated, null);
    }

    /**
     * Maps Shop entity to ShopResponse DTO with avgRating, reviewCount, isOpen, and floodStatus.
     */
    public ShopResponse mapToShopResponse(Shop shop, Double distanceKm) {
        Double avg = reviewRepository.getAverageRatingByShopId(shop.getId());
        double avgRating = avg != null ? BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP).doubleValue() : 0.0;
        long reviewCount = reviewRepository.countByShopId(shop.getId());

        boolean open = computeIsOpen(shop.getOpeningHours());
        String floodStatus = computeFloodStatus(shop);

        return ShopResponse.builder()
                .id(shop.getId())
                .ownerId(shop.getOwner().getId())
                .ownerName(shop.getOwner().getName())
                .name(shop.getName())
                .address(shop.getAddress())
                .latitude(shop.getLatitude())
                .longitude(shop.getLongitude())
                .category(shop.getCategory())
                .verifiedStatus(shop.getVerifiedStatus())
                .openingHours(shop.getOpeningHours())
                .imageUrl(shop.getImageUrl())
                .createdAt(shop.getCreatedAt())
                .avgRating(avgRating)
                .reviewCount(reviewCount)
                .isOpen(open)
                .floodStatus(floodStatus)
                .distanceKm(distanceKm)
                .build();
    }

    /**
     * Determines flood danger level for a shop based on active VERIFIED flood zones:
     * - Inside radius = SEVERE
     * - Within radius + 500m = WATCH
     * - Otherwise = SAFE
     */
    public String computeFloodStatus(Shop shop) {
        List<FloodZone> activeZones = floodZoneRepository.findByStatusAndExpiresAtAfter(
                FloodZoneStatus.VERIFIED, LocalDateTime.now());

        if (activeZones.isEmpty()) {
            return "SAFE";
        }

        boolean hasWatch = false;
        for (FloodZone fz : activeZones) {
            double distMeters = haversineDistanceMeters(shop.getLatitude(), shop.getLongitude(), fz.getLatitude(), fz.getLongitude());
            if (distMeters <= fz.getRadiusMeters()) {
                return "SEVERE";
            }
            if (distMeters <= fz.getRadiusMeters() + 500.0) {
                hasWatch = true;
            }
        }

        return hasWatch ? "WATCH" : "SAFE";
    }

    /**
     * Checks if a shop is currently open based on parseable openingHours string. Defaults to true if unparseable.
     */
    public boolean computeIsOpen(String openingHours) {
        if (openingHours == null || openingHours.trim().isEmpty()) {
            return true;
        }

        Matcher matcher = TIME_RANGE_PATTERN.matcher(openingHours.trim());
        if (matcher.find()) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("H:mm");
                LocalTime start = LocalTime.parse(matcher.group(1).trim(), formatter);
                LocalTime end = LocalTime.parse(matcher.group(2).trim(), formatter);
                LocalTime now = LocalTime.now();

                if (end.isAfter(start)) {
                    return !now.isBefore(start) && !now.isAfter(end);
                } else {
                    // Overnight hours (e.g. 20:00 - 04:00)
                    return !now.isBefore(start) || !now.isAfter(end);
                }
            } catch (DateTimeParseException ignored) {
                return true;
            }
        }
        return true;
    }

    /**
     * Calculates Haversine distance in kilometers between two coordinates.
     */
    public static double haversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double r = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return r * c;
    }

    /**
     * Calculates Haversine distance in meters between two coordinates.
     */
    public static double haversineDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        return haversineDistanceKm(lat1, lon1, lat2, lon2) * 1000.0;
    }
}
