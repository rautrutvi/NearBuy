package com.nearbuy.repository;

import com.nearbuy.entity.FloodZone;
import com.nearbuy.entity.FloodZoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for managing and querying flood zones.
 */
@Repository
public interface FloodZoneRepository extends JpaRepository<FloodZone, Long> {

    List<FloodZone> findByStatusAndExpiresAtAfter(FloodZoneStatus status, LocalDateTime now);

    List<FloodZone> findByStatus(FloodZoneStatus status);

    List<FloodZone> findByStatusAndExpiresAtBefore(FloodZoneStatus status, LocalDateTime now);
}
