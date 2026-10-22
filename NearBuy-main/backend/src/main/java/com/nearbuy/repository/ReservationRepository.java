package com.nearbuy.repository;

import com.nearbuy.entity.Reservation;
import com.nearbuy.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Reservation querying, stats, and expiry sweeps.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Reservation> findByShopOwnerIdOrderByCreatedAtDesc(Long ownerId);

    boolean existsByCode(String code);

    boolean existsByShopIdAndCustomerIdAndStatus(Long shopId, Long customerId, ReservationStatus status);

    @Query("SELECT r FROM Reservation r WHERE r.status IN ('PENDING', 'READY') AND r.expiresAt <= :now")
    List<Reservation> findExpiredReservations(@Param("now") LocalDateTime now);

    long countByShopOwnerIdAndStatus(Long ownerId, ReservationStatus status);

    long countByShopOwnerIdAndStatusAndCreatedAtAfter(Long ownerId, ReservationStatus status, LocalDateTime startOfDay);

    long countByCreatedAtAfter(LocalDateTime startOfDay);
}
