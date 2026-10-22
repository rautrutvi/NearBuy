package com.nearbuy.service;

import com.nearbuy.dto.*;
import com.nearbuy.entity.*;
import com.nearbuy.exception.BadRequestException;
import com.nearbuy.exception.ForbiddenException;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.repository.ProductRepository;
import com.nearbuy.repository.ReservationRepository;
import com.nearbuy.repository.ShopRepository;
import com.nearbuy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * Service managing customer reservations, stock holds, status transitions,
 * mock payments, shopkeeper order stats, and auto-expiry stock restorations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    @Value("${reservation.hold-minutes:30}")
    private long holdMinutes;

    private final Random random = new SecureRandom();

    /**
     * Creates a reservation with pessimistic locking, stock deduction, and expiration timestamp.
     */
    @Transactional
    public ReservationResponse createReservation(CreateReservationRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + request.getShopId()));

        if (shop.getVerifiedStatus() != VerifiedStatus.APPROVED) {
            throw new BadRequestException("Shop is pending approval by Administrator rautrutvi@gmail.com and cannot accept reservations.");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Reservation must contain at least one item");
        }

        // Sort items by product ID to avoid potential database deadlocks when locking
        List<ReservationItemRequest> sortedItems = new ArrayList<>(request.getItems());
        sortedItems.sort(Comparator.comparing(ReservationItemRequest::getProductId));

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<ReservationItem> reservationItems = new ArrayList<>();

        Reservation reservation = Reservation.builder()
                .customer(customer)
                .shop(shop)
                .status(ReservationStatus.PENDING)
                .code(generateUniqueCode())
                .paid(false)
                .expiresAt(LocalDateTime.now().plusMinutes(holdMinutes))
                .items(new ArrayList<>())
                .build();

        for (ReservationItemRequest itemReq : sortedItems) {
            Product product = productRepository.findByIdWithLock(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            // Verify item belongs to the specified shop
            if (!product.getShop().getId().equals(shop.getId())) {
                throw new BadRequestException("Product '" + product.getName() + "' (ID: " + product.getId()
                        + ") does not belong to shop '" + shop.getName() + "'");
            }

            // Verify sufficient stock
            if (product.getQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName()
                        + ". Available: " + product.getQuantity() + ", Requested: " + itemReq.getQuantity());
            }

            // Decrement stock
            product.setQuantity(product.getQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            ReservationItem item = ReservationItem.builder()
                    .reservation(reservation)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            reservationItems.add(item);
        }

        reservation.setTotalAmount(totalAmount);
        reservation.setItems(reservationItems);

        Reservation saved = reservationRepository.save(reservation);
        return mapToReservationResponse(saved);
    }

    /**
     * Retrieves reservations placed by the authenticated customer, newest first.
     */
    @Transactional(readOnly = true)
    public List<ReservationResponse> getCustomerReservations(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return reservationRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves reservations placed at shops owned by the authenticated shopkeeper.
     */
    @Transactional(readOnly = true)
    public List<ReservationResponse> getShopkeeperReservations(String shopkeeperEmail) {
        User shopkeeper = userRepository.findByEmail(shopkeeperEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));

        return reservationRepository.findByShopOwnerIdOrderByCreatedAtDesc(shopkeeper.getId()).stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates reservation status: strictly PENDING -> READY -> PICKED_UP (owner only).
     */
    @Transactional
    public ReservationResponse updateReservationStatus(Long id, ReservationStatus newStatus, String shopkeeperEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        if (!reservation.getShop().getOwner().getEmail().equalsIgnoreCase(shopkeeperEmail.trim())) {
            throw new ForbiddenException("You can only manage reservations for your own shop");
        }

        ReservationStatus currentStatus = reservation.getStatus();

        // Validate state transitions
        boolean validTransition = (currentStatus == ReservationStatus.PENDING && newStatus == ReservationStatus.READY) ||
                (currentStatus == ReservationStatus.READY && newStatus == ReservationStatus.PICKED_UP);

        if (!validTransition) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        reservation.setStatus(newStatus);
        Reservation updated = reservationRepository.save(reservation);
        return mapToReservationResponse(updated);
    }

    /**
     * Retrieves shopkeeper reservation metrics: pending orders, ready for pickup, completed today.
     */
    @Transactional(readOnly = true)
    public ShopkeeperStatsResponse getShopkeeperStats(String shopkeeperEmail) {
        User shopkeeper = userRepository.findByEmail(shopkeeperEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));

        long pendingOrders = reservationRepository.countByShopOwnerIdAndStatus(shopkeeper.getId(), ReservationStatus.PENDING);
        long readyForPickup = reservationRepository.countByShopOwnerIdAndStatus(shopkeeper.getId(), ReservationStatus.READY);
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long completedToday = reservationRepository.countByShopOwnerIdAndStatusAndCreatedAtAfter(
                shopkeeper.getId(), ReservationStatus.PICKED_UP, startOfDay);

        return ShopkeeperStatsResponse.builder()
                .pendingOrders(pendingOrders)
                .readyForPickup(readyForPickup)
                .completedToday(completedToday)
                .build();
    }

    /**
     * Simulates payment success for a reservation.
     */
    @Transactional
    public ReservationResponse payReservation(Long id, String customerEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        if (!reservation.getCustomer().getEmail().equalsIgnoreCase(customerEmail.trim())) {
            throw new ForbiddenException("You can only pay for your own reservation");
        }

        reservation.setPaid(true);
        Reservation updated = reservationRepository.save(reservation);
        return mapToReservationResponse(updated);
    }

    /**
     * Expire PENDING or READY reservations past expiresAt and restore product stock.
     */
    @Transactional
    public int expirePastDueReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expiredReservations = reservationRepository.findExpiredReservations(now);

        for (Reservation reservation : expiredReservations) {
            log.info("Expiring reservation {} (Code: {}) and restoring product stock", reservation.getId(), reservation.getCode());
            reservation.setStatus(ReservationStatus.EXPIRED);

            for (ReservationItem item : reservation.getItems()) {
                Product product = item.getProduct();
                product.setQuantity(product.getQuantity() + item.getQuantity());
                productRepository.save(product);
            }

            reservationRepository.save(reservation);
        }

        return expiredReservations.size();
    }

    /**
     * Generates a unique pickup code formatted like NB-1024.
     */
    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        do {
            int num = 1000 + random.nextInt(9000);
            code = "NB-" + num;
            attempts++;
            if (attempts > 50) {
                code = "NB-" + System.currentTimeMillis() % 10000;
                break;
            }
        } while (reservationRepository.existsByCode(code));
        return code;
    }

    /**
     * Maps Reservation entity to ReservationResponse DTO.
     */
    public ReservationResponse mapToReservationResponse(Reservation reservation) {
        List<ReservationItemResponse> itemResponses = reservation.getItems().stream().map(item -> {
            BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return ReservationItemResponse.builder()
                    .id(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        return ReservationResponse.builder()
                .id(reservation.getId())
                .code(reservation.getCode())
                .customerId(reservation.getCustomer().getId())
                .customerName(reservation.getCustomer().getName())
                .customerEmail(reservation.getCustomer().getEmail())
                .customerPhone(reservation.getCustomer().getPhone())
                .shopId(reservation.getShop().getId())
                .shopName(reservation.getShop().getName())
                .shopAddress(reservation.getShop().getAddress())
                .status(reservation.getStatus())
                .totalAmount(reservation.getTotalAmount())
                .paid(reservation.isPaid())
                .createdAt(reservation.getCreatedAt())
                .expiresAt(reservation.getExpiresAt())
                .items(itemResponses)
                .build();
    }
}
