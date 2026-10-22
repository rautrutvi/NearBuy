package com.nearbuy.controller;

import com.nearbuy.dto.ReviewRequest;
import com.nearbuy.dto.ReviewResponse;
import com.nearbuy.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for submitting verified reviews and fetching shop reviews publicly.
 */
@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * POST /api/customer/reviews - Allows customers who picked up an order to leave a review.
     */
    @PostMapping("/api/customer/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReviewResponse response = reviewService.addReview(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/shops/{shopId}/reviews - Public endpoint listing customer reviews for a shop.
     */
    @GetMapping("/api/shops/{shopId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getShopReviews(@PathVariable Long shopId) {
        return ResponseEntity.ok(reviewService.getShopReviews(shopId));
    }
}
