package com.nearbuy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nearbuy.dto.*;
import com.nearbuy.entity.*;
import com.nearbuy.repository.*;
import com.nearbuy.service.ReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class PhaseDReservationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationItemRepository reservationItemRepository;

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReservationService reservationService;

    private String customerToken;
    private String vendorToken;
    private String otherVendorToken;
    private long shopId;
    private long productId;

    @BeforeEach
    void setUp() throws Exception {
        floodZoneRepository.deleteAll();
        reviewRepository.deleteAll();
        reservationItemRepository.deleteAll();
        reservationRepository.deleteAll();
        productRepository.deleteAll();
        shopRepository.deleteAll();
        userRepository.deleteAll();

        // Customer
        signupUser("Alice Customer", "customer@test.com", "pass123", Role.CUSTOMER);
        customerToken = loginAndGetToken("customer@test.com", "pass123");

        // Vendor 1
        signupUser("Vendor One", "vendor1@test.com", "pass123", Role.SHOPKEEPER);
        vendorToken = loginAndGetToken("vendor1@test.com", "pass123");

        // Vendor 2
        signupUser("Vendor Two", "vendor2@test.com", "pass123", Role.SHOPKEEPER);
        otherVendorToken = loginAndGetToken("vendor2@test.com", "pass123");

        // Create Shop
        ShopRequest shopReq = ShopRequest.builder()
                .name("Health Pharmacy")
                .address("Market Street")
                .latitude(19.46)
                .longitude(72.80)
                .build();
        MvcResult sRes = mockMvc.perform(post("/api/shopkeeper/shops")
                        .header("Authorization", "Bearer " + vendorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(shopReq)))
                .andExpect(status().isCreated())
                .andReturn();
        shopId = objectMapper.readTree(sRes.getResponse().getContentAsString()).get("id").asLong();

        // Create Product with stock = 10
        ProductRequest prodReq = ProductRequest.builder()
                .shopId(shopId)
                .name("First Aid Kit")
                .price(BigDecimal.valueOf(150.00))
                .quantity(10)
                .build();
        MvcResult pRes = mockMvc.perform(post("/api/shopkeeper/products")
                        .header("Authorization", "Bearer " + vendorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(prodReq)))
                .andExpect(status().isCreated())
                .andReturn();
        productId = objectMapper.readTree(pRes.getResponse().getContentAsString()).get("id").asLong();
    }

    private void signupUser(String name, String email, String password, Role role) throws Exception {
        SignupRequest signup = SignupRequest.builder().name(name).email(email).password(password).role(role).build();
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest login = LoginRequest.builder().email(email).password(password).build();
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    void testReservationFlowAndStockDeduction() throws Exception {
        // 1. Create reservation for 3 items
        CreateReservationRequest resReq = CreateReservationRequest.builder()
                .shopId(shopId)
                .items(List.of(new ReservationItemRequest(productId, 3)))
                .build();

        MvcResult createRes = mockMvc.perform(post("/api/customer/reservations")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code", startsWith("NB-")))
                .andExpect(jsonPath("$.totalAmount", is(450.0)))
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.paid", is(false)))
                .andReturn();

        long reservationId = objectMapper.readTree(createRes.getResponse().getContentAsString()).get("id").asLong();

        // Verify stock decremented from 10 to 7
        Product updatedProd = productRepository.findById(productId).orElseThrow();
        assertEquals(7, updatedProd.getQuantity());

        // 2. Insufficient stock check: request 8 when only 7 left
        CreateReservationRequest overStockReq = CreateReservationRequest.builder()
                .shopId(shopId)
                .items(List.of(new ReservationItemRequest(productId, 8)))
                .build();

        mockMvc.perform(post("/api/customer/reservations")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(overStockReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));

        // 3. Unauthorized vendor attempts status change -> 403
        mockMvc.perform(put("/api/shopkeeper/reservations/" + reservationId + "/status")
                        .header("Authorization", "Bearer " + otherVendorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReservationStatusUpdateRequest(ReservationStatus.READY))))
                .andExpect(status().isForbidden());

        // 4. Invalid status transition: PENDING -> PICKED_UP (skipping READY) -> 400
        mockMvc.perform(put("/api/shopkeeper/reservations/" + reservationId + "/status")
                        .header("Authorization", "Bearer " + vendorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReservationStatusUpdateRequest(ReservationStatus.PICKED_UP))))
                .andExpect(status().isBadRequest());

        // 5. Valid transition: PENDING -> READY
        mockMvc.perform(put("/api/shopkeeper/reservations/" + reservationId + "/status")
                        .header("Authorization", "Bearer " + vendorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReservationStatusUpdateRequest(ReservationStatus.READY))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("READY")));

        // 6. Mock payment
        mockMvc.perform(post("/api/customer/reservations/" + reservationId + "/pay")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paid", is(true)));

        // 7. Ready -> PICKED_UP
        mockMvc.perform(put("/api/shopkeeper/reservations/" + reservationId + "/status")
                        .header("Authorization", "Bearer " + vendorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReservationStatusUpdateRequest(ReservationStatus.PICKED_UP))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PICKED_UP")));

        // 8. Stats check
        mockMvc.perform(get("/api/shopkeeper/stats")
                        .header("Authorization", "Bearer " + vendorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completedToday", is(1)));
    }

    @Test
    void testReservationAutoExpiryRestoresStock() throws Exception {
        // Create reservation for 4 items
        CreateReservationRequest resReq = CreateReservationRequest.builder()
                .shopId(shopId)
                .items(List.of(new ReservationItemRequest(productId, 4)))
                .build();

        MvcResult createRes = mockMvc.perform(post("/api/customer/reservations")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resReq)))
                .andExpect(status().isCreated())
                .andReturn();

        long reservationId = objectMapper.readTree(createRes.getResponse().getContentAsString()).get("id").asLong();

        // Stock decreased to 6
        assertEquals(6, productRepository.findById(productId).orElseThrow().getQuantity());

        // Artificially expire the reservation
        Reservation res = reservationRepository.findById(reservationId).orElseThrow();
        res.setExpiresAt(LocalDateTime.now().minusMinutes(5));
        reservationRepository.save(res);

        // Run expiry sweep
        int expired = reservationService.expirePastDueReservations();
        assertEquals(1, expired);

        // Verify status is EXPIRED and stock is restored back to 10
        Reservation expiredRes = reservationRepository.findById(reservationId).orElseThrow();
        assertEquals(ReservationStatus.EXPIRED, expiredRes.getStatus());
        assertEquals(10, productRepository.findById(productId).orElseThrow().getQuantity());
    }
}
