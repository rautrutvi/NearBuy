package com.nearbuy.scheduler;

import com.nearbuy.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled task that executes every minute to expire past-due reservations
 * and restore locked product inventory.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationCleanupScheduler {

    private final ReservationService reservationService;

    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredReservations() {
        int count = reservationService.expirePastDueReservations();
        if (count > 0) {
            log.info("Expired {} past-due reservation(s) and restored stock", count);
        }
    }
}
