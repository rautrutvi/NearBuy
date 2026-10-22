package com.nearbuy.scheduler;

import com.nearbuy.service.FloodZoneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled task that runs every 5 minutes to mark expired flood zones as EXPIRED.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FloodZoneCleanupScheduler {

    private final FloodZoneService floodZoneService;

    @Scheduled(fixedRate = 300000)
    public void cleanupExpiredFloodZones() {
        int count = floodZoneService.expireOldFloodZones();
        if (count > 0) {
            log.info("Marked {} flood zone(s) as EXPIRED", count);
        }
    }
}
