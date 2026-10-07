package com.nearbuy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nearbuy.dto.*;
import com.nearbuy.entity.*;
import com.nearbuy.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class PhaseEReviewTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private ReservationItemRepository reservationItemRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private FloodZoneRepository floodZoneRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String customerToken;
    private Long shopId;
    private Long customerId;
    private Long shopkeeperId;

    @BeforeEach
    void setUp() throws Exception {
        // Clear in reverse FK order
        floodZoneRepository.deleteAll();
        reviewRepository.deleteAll();
        reservationItemRepository.deleteAll();
        reservationRepository.deleteAll();
        productRepository.deleteAll();
        shopRepository.deleteAll();
        userRepository.deleteAll();

        // Seed a customer and shopkeeper directly
        User customer = userRepository.save(User.builder()
                .name("Buyer Alice")
                .email("buyer@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.CUSTOMER)
                .active(true)
                .build());
        customerId = customer.getId();

        User shopkeeper = userRepository.save(User.builder()
                .name("Seller Bob")
                .email("seller@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .active(true)
                .build());
        shopkeeperId = shopkeeper.getId();

        // Login customer
        customerToken = loginAndGetToken("buyer@test.com", "pass123");

        // Create shop
        Shop shop = shopRepository.save(Shop.builder()
                .owner(shopkeeper)
                .name("Bob's Store")
                .address("1 Test Street")
                .latitude(19.0)
                .longitude(72.0)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("09:00 - 21:00")
                .build());
        shopId = shop.getId();

        // Seed a product
        Product product = productRepository.save(Product.builder()
                .shop(shop)
                .name("Test Item")
                .description("desc")
                .price(BigDecimal.valueOf(100))
                .quantity(10)
                .category("Misc")
                .lowStockThreshold(2)
                .build());

        // Seed a PICKED_UP reservation so customer is allowed to leave a review
        Reservation reservation = reservationRepository.save(Reservation.builder()
                .customer(customer)
                .shop(shop)
                .status(ReservationStatus.PICKED_UP)
                .code("NB-0001")
                .totalAmount(BigDecimal.valueOf(100))
                .paid(true)
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .build());

        reservationItemRepository.save(ReservationItem.builder()
                .reservation(reservation)
                .product(product)
                .quantity(1)
                .unitPrice(BigDecimal.valueOf(100))
                .build());
    }

    // ── Test 1: Customer with PICKED_UP reservation can post a review ──────────
    @Test
    void testCustomerCanPostReview() throws Exception {
        ReviewRequest req = new ReviewRequest(shopId, 5, "Great shop!");

        mockMvc.perform(post("/api/customer/reviews")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating", is(5)))
                .andExpect(jsonPath("$.comment", is("Great shop!")));
    }

    // ── Test 2: Customer without PICKED_UP reservation gets 400 ───────────────
    @Test
    void testReviewRequiresPickedUpReservation() throws Exception {
        // Use a different shopkeeper and shop that has no PICKED_UP reservations for customer
        User shopkeeper2 = userRepository.save(User.builder()
                .name("Seller Carol")
                .email("carol@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .active(true)
                .build());

        Shop shop2 = shopRepository.save(Shop.builder()
                .owner(shopkeeper2)
                .name("Carol's Store")
                .address("2 Test Street")
                .latitude(19.1)
                .longitude(72.1)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("09:00 - 21:00")
                .build());

        ReviewRequest req = new ReviewRequest(shop2.getId(), 4, "Nice!");

        mockMvc.perform(post("/api/customer/reviews")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    // ── Test 3: Duplicate review returns 409 ──────────────────────────────────
    @Test
    void testDuplicateReviewReturnsConflict() throws Exception {
        ReviewRequest req = new ReviewRequest(shopId, 5, "Great!");

        // First review - should succeed
        mockMvc.perform(post("/api/customer/reviews")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // Second review - should conflict
        mockMvc.perform(post("/api/customer/reviews")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    // ── Test 4: Public GET /api/shops/{shopId}/reviews ────────────────────────
    @Test
    void testPublicGetShopReviews() throws Exception {
        // Post a review first
        ReviewRequest req = new ReviewRequest(shopId, 4, "Good one!");
        mockMvc.perform(post("/api/customer/reviews")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // Public fetch (no auth)
        mockMvc.perform(get("/api/shops/" + shopId + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].rating", is(4)));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest(email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        String body = result.getResponse().getContentAsString();
        return objectMapper.readTree(body).get("token").asText();
    }
}
