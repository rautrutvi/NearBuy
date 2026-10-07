package com.nearbuy.repository;

import com.nearbuy.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing shop reviews.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByShopIdOrderByCreatedAtDesc(Long shopId);

    boolean existsByShopIdAndCustomerId(Long shopId, Long customerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.shop.id = :shopId")
    Double getAverageRatingByShopId(@Param("shopId") Long shopId);

    long countByShopId(Long shopId);
}
