package com.nearbuy.repository;

import com.nearbuy.entity.ReservationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ReservationItem persistence.
 */
@Repository
public interface ReservationItemRepository extends JpaRepository<ReservationItem, Long> {

    List<ReservationItem> findByReservationId(Long reservationId);
}
