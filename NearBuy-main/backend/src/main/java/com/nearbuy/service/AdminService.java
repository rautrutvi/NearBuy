package com.nearbuy.service;

import com.nearbuy.dto.AdminStatsResponse;
import com.nearbuy.dto.UserResponse;
import com.nearbuy.entity.FloodZoneStatus;
import com.nearbuy.entity.User;
import com.nearbuy.entity.VerifiedStatus;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.repository.FloodZoneRepository;
import com.nearbuy.repository.ReservationRepository;
import com.nearbuy.repository.ReviewRepository;
import com.nearbuy.repository.ShopRepository;
import com.nearbuy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.OptionalDouble;
import java.util.List;

/**
 * Service for platform-wide admin operations: user management and aggregated stats.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final FloodZoneRepository floodZoneRepository;
    private final UserService userService;

    /**
     * Returns paginated list of all users.
     */
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userService::mapToUserResponse);
    }

    /**
     * Updates a user's active status (suspend/activate).
     */
    @Transactional
    public UserResponse updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(active);
        User updated = userRepository.save(user);
        return userService.mapToUserResponse(updated);
    }

    /**
     * Computes platform-wide stats for the admin dashboard.
     */
    @Transactional(readOnly = true)
    public AdminStatsResponse getAdminStats() {
        long totalShops = shopRepository.count();
        long totalUsers = userRepository.count();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long activeUsersToday = userRepository.countByCreatedAtAfter(startOfDay);
        long reservationsToday = reservationRepository.countByCreatedAtAfter(startOfDay);

        // Average rating across all shops with at least one review
        List<Long> allShopIds = shopRepository.findAll().stream()
                .map(shop -> shop.getId())
                .toList();
        OptionalDouble avgShopRating = allShopIds.stream()
                .mapToDouble(shopId -> {
                    Double avg = reviewRepository.getAverageRatingByShopId(shopId);
                    return avg != null ? avg : 0.0;
                })
                .filter(v -> v > 0)
                .average();

        long pendingShopVerifications = shopRepository.findByVerifiedStatus(VerifiedStatus.PENDING).size();
        long pendingFloodReports = floodZoneRepository.findByStatus(FloodZoneStatus.PENDING).size();

        return AdminStatsResponse.builder()
                .totalShops(totalShops)
                .totalUsers(totalUsers)
                .activeUsersToday(activeUsersToday)
                .reservationsToday(reservationsToday)
                .avgShopRating(avgShopRating.isPresent() ? Math.round(avgShopRating.getAsDouble() * 10.0) / 10.0 : 0.0)
                .pendingShopVerifications(pendingShopVerifications)
                .pendingFloodReports(pendingFloodReports)
                .build();
    }
}
