package com.nearbuy.service;

import com.nearbuy.dto.ReviewRequest;
import com.nearbuy.dto.ReviewResponse;
import com.nearbuy.entity.ReservationStatus;
import com.nearbuy.entity.Review;
import com.nearbuy.entity.Shop;
import com.nearbuy.entity.User;
import com.nearbuy.exception.BadRequestException;
import com.nearbuy.exception.ConflictException;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.repository.ReservationRepository;
import com.nearbuy.repository.ReviewRepository;
import com.nearbuy.repository.ShopRepository;
import com.nearbuy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing customer reviews, verified purchase checks, and rating queries.
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    /**
     * Creates a review for a shop. Verified buyer check requires a completed PICKED_UP reservation.
     */
    @Transactional
    public ReviewResponse addReview(ReviewRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + request.getShopId()));

        // Check if customer has a PICKED_UP reservation
        boolean hasPickedUp = reservationRepository.existsByShopIdAndCustomerIdAndStatus(
                shop.getId(), customer.getId(), ReservationStatus.PICKED_UP);

        if (!hasPickedUp) {
            throw new BadRequestException("You can only review a shop after picking up a reservation from it");
        }

        // Enforce one review per customer per shop
        if (reviewRepository.existsByShopIdAndCustomerId(shop.getId(), customer.getId())) {
            throw new ConflictException("You have already reviewed this shop");
        }

        Review review = Review.builder()
                .shop(shop)
                .customer(customer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        return mapToReviewResponse(saved);
    }

    /**
     * Retrieves all reviews for a shop, newest first.
     */
    @Transactional(readOnly = true)
    public List<ReviewResponse> getShopReviews(Long shopId) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResourceNotFoundException("Shop not found with id: " + shopId);
        }

        return reviewRepository.findByShopIdOrderByCreatedAtDesc(shopId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .shopId(review.getShop().getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
