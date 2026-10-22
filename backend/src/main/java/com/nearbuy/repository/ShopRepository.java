package com.nearbuy.repository;

import com.nearbuy.entity.Shop;
import com.nearbuy.entity.User;
import com.nearbuy.entity.VerifiedStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Shop queries, including geospatial Haversine distance search.
 */
@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    List<Shop> findByVerifiedStatus(VerifiedStatus status);

    List<Shop> findByOwner(User owner);

    List<Shop> findByOwnerId(Long ownerId);

    Optional<Shop> findByIdAndOwnerId(Long id, Long ownerId);

    /**
     * Haversine formula native query to find approved shops within radiusKm.
     */
    @Query(value = "SELECT * FROM shops s WHERE s.verified_status = 'APPROVED' AND " +
            "(6371 * acos(least(1.0, greatest(-1.0, cos(radians(:lat)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(s.latitude)))))) <= :radiusKm " +
            "ORDER BY (6371 * acos(least(1.0, greatest(-1.0, cos(radians(:lat)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(s.latitude)))))) ASC",
            nativeQuery = true)
    List<Shop> findNearbyApprovedShops(@Param("lat") double lat, @Param("lng") double lng, @Param("radiusKm") double radiusKm);
}
