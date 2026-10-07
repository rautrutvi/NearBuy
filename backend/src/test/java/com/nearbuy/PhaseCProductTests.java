package com.nearbuy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nearbuy.dto.LoginRequest;
import com.nearbuy.dto.ProductRequest;
import com.nearbuy.dto.ShopRequest;
import com.nearbuy.dto.SignupRequest;
import com.nearbuy.dto.StockUpdateRequest;
import com.nearbuy.entity.Role;
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
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
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
class PhaseCProductTests {

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
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationItemRepository reservationItemRepository;

    private String shopkeeper1Token;
    private String shopkeeper2Token;
    private long shop1Id;

    @BeforeEach
    void setUp() throws Exception {
        floodZoneRepository.deleteAll();
        reviewRepository.deleteAll();
        reservationItemRepository.deleteAll();
        reservationRepository.deleteAll();
        productRepository.deleteAll();
        shopRepository.deleteAll();
        userRepository.deleteAll();

        // Register vendor 1
        signupUser("Vendor One", "vendor1@test.com", "pass123", Role.SHOPKEEPER);
        shopkeeper1Token = loginAndGetToken("vendor1@test.com", "pass123");

        // Register vendor 2
        signupUser("Vendor Two", "vendor2@test.com", "pass123", Role.SHOPKEEPER);
        shopkeeper2Token = loginAndGetToken("vendor2@test.com", "pass123");

        // Create Shop 1
        ShopRequest shopReq = ShopRequest.builder()
                .name("Shop One")
                .address("Address 1")
                .latitude(19.4674)
                .longitude(72.8041)
                .build();
        MvcResult res = mockMvc.perform(post("/api/shopkeeper/shops")
                        .header("Authorization", "Bearer " + shopkeeper1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(shopReq)))
                .andExpect(status().isCreated())
                .andReturn();
        shop1Id = objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asLong();
    }

    private void signupUser(String name, String email, String password, Role role) throws Exception {
        SignupRequest signup = SignupRequest.builder()
                .name(name).email(email).password(password).role(role).build();
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
    void testProductCreationOwnershipAndStockLabels() throws Exception {
        // 1. Create product in shop 1
        ProductRequest productReq = ProductRequest.builder()
                .shopId(shop1Id)
                .name("Paracetamol 650mg")
                .description("Pain relief")
                .price(BigDecimal.valueOf(45.00))
                .quantity(15)
                .category("Medicine")
                .barcode("8901234567890")
                .lowStockThreshold(5)
                .build();

        MvcResult prodRes = mockMvc.perform(post("/api/shopkeeper/products")
                        .header("Authorization", "Bearer " + shopkeeper1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Paracetamol 650mg")))
                .andExpect(jsonPath("$.stockLabel", is("IN_STOCK")))
                .andReturn();

        long prodId = objectMapper.readTree(prodRes.getResponse().getContentAsString()).get("id").asLong();

        // 2. Shopkeeper 2 tries to modify Shopkeeper 1's product -> 403 Forbidden
        ProductRequest hackReq = ProductRequest.builder()
                .shopId(shop1Id)
                .name("Hacked Product")
                .price(BigDecimal.valueOf(10.00))
                .quantity(100)
                .build();

        mockMvc.perform(put("/api/shopkeeper/products/" + prodId)
                        .header("Authorization", "Bearer " + shopkeeper2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hackReq)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));

        // 3. Update stock using PATCH delta: decrease from 15 to 4 (should be LOW)
        StockUpdateRequest deltaReq = new StockUpdateRequest(-11);
        mockMvc.perform(patch("/api/shopkeeper/products/" + prodId + "/stock")
                        .header("Authorization", "Bearer " + shopkeeper1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deltaReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(4)))
                .andExpect(jsonPath("$.stockLabel", is("LOW")));

        // 4. Check low stock endpoint
        mockMvc.perform(get("/api/shopkeeper/products/low-stock")
                        .header("Authorization", "Bearer " + shopkeeper1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Paracetamol 650mg")));

        // 5. Decrement below zero -> 400 Bad Request
        StockUpdateRequest negativeFail = new StockUpdateRequest(-10);
        mockMvc.perform(patch("/api/shopkeeper/products/" + prodId + "/stock")
                        .header("Authorization", "Bearer " + shopkeeper1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(negativeFail)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));

        // 6. Public search
        mockMvc.perform(get("/api/products/search")
                        .param("query", "paracetamol")
                        .param("category", "Medicine"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].barcode", is("8901234567890")));
    }
}
