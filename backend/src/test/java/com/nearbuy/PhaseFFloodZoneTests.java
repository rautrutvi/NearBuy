package com.nearbuy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nearbuy.dto.*;
import com.nearbuy.entity.*;
import com.nearbuy.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class PhaseFFloodZoneTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ReservationItemRepository reservationItemRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private FloodZoneRepository floodZoneRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String customerToken;
    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        floodZoneRepository.deleteAll();
        reviewRepository.deleteAll();
        reservationItemRepository.deleteAll();
        reservationRepository.deleteAll();
        productRepository.deleteAll();
        shopRepository.deleteAll();
        userRepository.deleteAll();

        // Admin
        userRepository.save(User.builder()
                .name("Admin")
                .email("admin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build());

        // Customer
        userRepository.save(User.builder()
                .name("Tester")
                .email("tester@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.CUSTOMER)
                .active(true)
                .build());

        adminToken = loginAndGetToken("admin@test.com", "admin123");
        customerToken = loginAndGetToken("tester@test.com", "pass123");
    }

    // ── Test 1: Authenticated user can submit a flood zone report ─────────────
    @Test
    void testReportFloodZone() throws Exception {
        FloodZoneRequest req = new FloodZoneRequest(19.467, 72.804, 300.0, "Flooded road near station");

        mockMvc.perform(post("/api/reports/flood")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.description", is("Flooded road near station")));
    }

    // ── Test 2: Unauthenticated user cannot report flood zone ─────────────────
    @Test
    void testUnauthenticatedCannotReportFloodZone() throws Exception {
        FloodZoneRequest req = new FloodZoneRequest(19.467, 72.804, 300.0, "Test");

        mockMvc.perform(post("/api/reports/flood")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    // ── Test 3: Admin can get pending flood zones ─────────────────────────────
    @Test
    void testAdminGetsPendingFloodZones() throws Exception {
        // First report one
        FloodZoneRequest req = new FloodZoneRequest(19.467, 72.804, 300.0, "Flooded area");
        mockMvc.perform(post("/api/reports/flood")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // Admin fetches pending
        mockMvc.perform(get("/api/admin/flood-zones/pending")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status", is("PENDING")));
    }

    // ── Test 4: Admin can verify (approve) a flood zone ──────────────────────
    @Test
    void testAdminVerifiesFloodZone() throws Exception {
        // Report
        FloodZoneRequest req = new FloodZoneRequest(19.467, 72.804, 300.0, "Heavy waterlogging");
        MvcResult reportResult = mockMvc.perform(post("/api/reports/flood")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        Long zoneId = objectMapper.readTree(reportResult.getResponse().getContentAsString())
                .get("id").asLong();

        // Verify
        FloodZoneVerificationRequest verifyReq = new FloodZoneVerificationRequest(FloodZoneStatus.VERIFIED);
        mockMvc.perform(put("/api/admin/flood-zones/" + zoneId + "/verify")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("VERIFIED")));

        // Should now appear in public active list
        mockMvc.perform(get("/api/flood-zones/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest(email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }
}
