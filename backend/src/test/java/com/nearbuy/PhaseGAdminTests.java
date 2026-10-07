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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class PhaseGAdminTests {

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

    private String shopkeeperToken;
    private String adminToken;
    private Long shopId;

    @BeforeEach
    void setUp() throws Exception {
        floodZoneRepository.deleteAll();
        reviewRepository.deleteAll();
        reservationItemRepository.deleteAll();
        reservationRepository.deleteAll();
        productRepository.deleteAll();
        shopRepository.deleteAll();
        userRepository.deleteAll();

        User admin = userRepository.save(User.builder()
                .name("Admin")
                .email("admin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build());

        User shopkeeper = userRepository.save(User.builder()
                .name("Vendor One")
                .email("vendor@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .active(true)
                .build());

        adminToken = loginAndGetToken("admin@test.com", "admin123");
        shopkeeperToken = loginAndGetToken("vendor@test.com", "pass123");

        Shop shop = shopRepository.save(Shop.builder()
                .owner(shopkeeper)
                .name("Test Shop")
                .address("Test Addr")
                .latitude(19.0)
                .longitude(72.0)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("09:00 - 21:00")
                .build());
        shopId = shop.getId();

        productRepository.save(Product.builder()
                .shop(shop)
                .name("Torch Light")
                .description("LED torch")
                .price(BigDecimal.valueOf(499))
                .quantity(10)
                .category("Safety")
                .barcode("TEST-BARCODE-001")
                .lowStockThreshold(2)
                .build());
    }

    // ── Test 1: Scan-to-sell with valid barcode decrements stock ─────────────
    @Test
    void testScanSellDecrementStock() throws Exception {
        ScanSellRequest req = new ScanSellRequest("TEST-BARCODE-001", 3);

        mockMvc.perform(post("/api/shopkeeper/scan-sell")
                        .header("Authorization", "Bearer " + shopkeeperToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Torch Light")))
                .andExpect(jsonPath("$.quantity", is(7)));
    }

    // ── Test 2: Scan-to-sell with unknown barcode returns 404 ────────────────
    @Test
    void testScanSellUnknownBarcodeReturns404() throws Exception {
        ScanSellRequest req = new ScanSellRequest("NO-SUCH-BARCODE", 1);

        mockMvc.perform(post("/api/shopkeeper/scan-sell")
                        .header("Authorization", "Bearer " + shopkeeperToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    // ── Test 3: Scan-to-sell insufficient stock returns 400 ──────────────────
    @Test
    void testScanSellInsufficientStockReturns400() throws Exception {
        ScanSellRequest req = new ScanSellRequest("TEST-BARCODE-001", 999);

        mockMvc.perform(post("/api/shopkeeper/scan-sell")
                        .header("Authorization", "Bearer " + shopkeeperToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    // ── Test 4: Admin gets paginated user list ────────────────────────────────
    @Test
    void testAdminGetUsers() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThan(0))));
    }

    // ── Test 5: Admin suspend and reactivate a user ───────────────────────────
    @Test
    void testAdminSuspendUser() throws Exception {
        // Get the vendor user ID from admin list
        MvcResult result = mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andReturn();
        String body = result.getResponse().getContentAsString();
        Long vendorId = objectMapper.readTree(body)
                .get("content")
                .findValues("email")
                .stream()
                .filter(n -> n.asText().equals("vendor@test.com"))
                .findFirst()
                .map(n -> {
                    // Walk up to parent object
                    try {
                        var arr = objectMapper.readTree(body).get("content");
                        for (var node : arr) {
                            if ("vendor@test.com".equals(node.get("email").asText())) {
                                return node.get("id").asLong();
                            }
                        }
                    } catch (Exception e) { /* ignore */ }
                    return -1L;
                })
                .orElse(-1L);

        UserStatusRequest suspendReq = new UserStatusRequest(false);
        mockMvc.perform(put("/api/admin/users/" + vendorId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(suspendReq)))
                .andExpect(status().isOk());
    }

    // ── Test 6: Admin stats endpoint returns data ─────────────────────────────
    @Test
    void testAdminStats() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalShops", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.totalUsers", greaterThanOrEqualTo(0)));
    }

    // ── Test 7: CUSTOMER token gets 403 on /api/admin/** ─────────────────────
    @Test
    void testCustomerForbiddenOnAdminStats() throws Exception {
        // Sign up a customer
        SignupRequest signupReq = SignupRequest.builder()
                .name("Buyer")
                .email("buyer@test.com")
                .password("pass123")
                .role(Role.CUSTOMER)
                .build();
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupReq)))
                .andExpect(status().isCreated());

        String customerToken = loginAndGetToken("buyer@test.com", "pass123");
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
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
