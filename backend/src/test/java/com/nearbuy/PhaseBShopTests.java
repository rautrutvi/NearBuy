package com.nearbuy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nearbuy.dto.LoginRequest;
import com.nearbuy.dto.ShopRequest;
import com.nearbuy.dto.ShopVerificationRequest;
import com.nearbuy.dto.SignupRequest;
import com.nearbuy.entity.FloodZone;
import com.nearbuy.entity.FloodZoneStatus;
import com.nearbuy.entity.Role;
import com.nearbuy.entity.User;
import com.nearbuy.entity.VerifiedStatus;
import com.nearbuy.repository.FloodZoneRepository;
import com.nearbuy.repository.ProductRepository;
import com.nearbuy.repository.ReservationItemRepository;
import com.nearbuy.repository.ReservationRepository;
import com.nearbuy.repository.ReviewRepository;
import com.nearbuy.repository.ShopRepository;
import com.nearbuy.repository.UserRepository;
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

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class PhaseBShopTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationItemRepository reservationItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String shopkeeper1Token;
    private String shopkeeper2Token;
    private String adminToken;
    private User adminUser;

    @BeforeEach
    void setUp() throws Exception {
        floodZoneRepository.deleteAll();
        reviewRepository.deleteAll();
        reservationItemRepository.deleteAll();
        reservationRepository.deleteAll();
        productRepository.deleteAll();
        shopRepository.deleteAll();
        userRepository.deleteAll();

        // Create Admin directly
        adminUser = userRepository.save(User.builder()
                .name("Admin")
                .email("admin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build());

        // Login Admin
        adminToken = loginAndGetToken("admin@test.com", "admin123");

        // Create Shopkeeper 1
        signupUser("Vendor One", "vendor1@test.com", "pass123", Role.SHOPKEEPER);
        shopkeeper1Token = loginAndGetToken("vendor1@test.com", "pass123");

        // Create Shopkeeper 2
        signupUser("Vendor Two", "vendor2@test.com", "pass123", Role.SHOPKEEPER);
        shopkeeper2Token = loginAndGetToken("vendor2@test.com", "pass123");
    }

    private void signupUser(String name, String email, String password, Role role) throws Exception {
        SignupRequest signup = SignupRequest.builder()
                .name(name)
                .email(email)
                .password(password)
                .role(role)
                .build();
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
    void testShopLifecycleAndOwnershipSecurity() throws Exception {
        // 1. Shopkeeper 1 creates a shop
        ShopRequest createReq = ShopRequest.builder()
                .name("Virar General Store")
                .address("Station Road, Virar West")
                .latitude(19.4674)
                .longitude(72.8041)
                .category("Grocery")
                .openingHours("08:00 - 22:00")
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/shopkeeper/shops")
                        .header("Authorization", "Bearer " + shopkeeper1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Virar General Store")))
                .andExpect(jsonPath("$.verifiedStatus", is("PENDING")))
                .andReturn();

        long shopId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        // 2. Pending shop is NOT in public /api/shops
        mockMvc.perform(get("/api/shops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // 3. Shopkeeper 2 attempts to edit Shopkeeper 1's shop -> 403 Forbidden!
        ShopRequest updateReq = ShopRequest.builder()
                .name("Hacked Store")
                .address("Hacked Address")
                .latitude(19.4674)
                .longitude(72.8041)
                .build();

        mockMvc.perform(put("/api/shopkeeper/shops/" + shopId)
                        .header("Authorization", "Bearer " + shopkeeper2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));

        // 4. Admin checks pending shops
        mockMvc.perform(get("/api/admin/shops/pending")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is((int) shopId)));

        // 5. Admin approves shop
        ShopVerificationRequest verifyReq = ShopVerificationRequest.builder()
                .status(VerifiedStatus.APPROVED)
                .build();

        mockMvc.perform(put("/api/admin/shops/" + shopId + "/verify")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verifiedStatus", is("APPROVED")));

        // 6. Shop is now visible in public /api/shops
        mockMvc.perform(get("/api/shops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Virar General Store")));

        // 7. Nearby search finds the shop within 5km
        mockMvc.perform(get("/api/shops/nearby")
                        .param("lat", "19.4670")
                        .param("lng", "72.8040")
                        .param("radiusKm", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].distanceKm", notNullValue()));
    }

    @Test
    void testFloodStatusCalculation() throws Exception {
        // Create an approved shop at (19.4674, 72.8041)
        ShopRequest createReq = ShopRequest.builder()
                .name("Monsoon Safe Shop")
                .address("Market Chowk")
                .latitude(19.4674)
                .longitude(72.8041)
                .build();

        MvcResult res = mockMvc.perform(post("/api/shopkeeper/shops")
                        .header("Authorization", "Bearer " + shopkeeper1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andReturn();
        long shopId = objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();

        // Admin approves
        mockMvc.perform(put("/api/admin/shops/" + shopId + "/verify")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ShopVerificationRequest(VerifiedStatus.APPROVED))))
                .andExpect(status().isOk());

        // Initially without flood zones, floodStatus is SAFE
        mockMvc.perform(get("/api/shops/" + shopId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.floodStatus", is("SAFE")));

        // Add a verified flood zone right at the shop (radius 200m)
        FloodZone severeZone = FloodZone.builder()
                .latitude(19.4674)
                .longitude(72.8041)
                .radiusMeters(200.0)
                .reportedBy(adminUser)
                .status(FloodZoneStatus.VERIFIED)
                .description("Waterlogged Station Rd")
                .expiresAt(LocalDateTime.now().plusHours(4))
                .build();
        floodZoneRepository.save(severeZone);

        // Shop inside radius -> SEVERE
        mockMvc.perform(get("/api/shops/" + shopId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.floodStatus", is("SEVERE")));
    }
}
