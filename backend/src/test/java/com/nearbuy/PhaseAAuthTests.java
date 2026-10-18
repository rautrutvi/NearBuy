package com.nearbuy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nearbuy.dto.LoginRequest;
import com.nearbuy.dto.SignupRequest;
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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class PhaseAAuthTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReservationItemRepository reservationItemRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopRepository shopRepository;

    @BeforeEach
    void setUp() {
        floodZoneRepository.deleteAll();
        reviewRepository.deleteAll();
        reservationItemRepository.deleteAll();
        reservationRepository.deleteAll();
        productRepository.deleteAll();
        shopRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testSignupSuccess() throws Exception {
        SignupRequest request = SignupRequest.builder()
                .name("Alice Customer")
                .email("alice@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543210")
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.email", is("alice@test.com")))
                .andExpect(jsonPath("$.role", is("CUSTOMER")));
    }

    @Test
    void testSignupDuplicateEmailReturnsConflict() throws Exception {
        SignupRequest request = SignupRequest.builder()
                .name("Alice Customer")
                .email("duplicate@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)));
    }

    @Test
    void testSignupAdminRoleRejected() throws Exception {
        SignupRequest request = SignupRequest.builder()
                .name("Hacker Admin")
                .email("hacker@test.com")
                .password("password123")
                .role(Role.ADMIN)
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }

    @Test
    void testLoginSuccessAndGetMe() throws Exception {
        SignupRequest signup = SignupRequest.builder()
                .name("Bob Vendor")
                .email("bob@test.com")
                .password("secret123")
                .role(Role.SHOPKEEPER)
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        LoginRequest login = LoginRequest.builder()
                .email("bob@test.com")
                .password("secret123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is("bob@test.com")))
                .andExpect(jsonPath("$.user.role", is("SHOPKEEPER")))
                .andReturn();

        String responseJson = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).get("token").asText();

        // Call /api/auth/me with Bearer token
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("bob@test.com")));
    }

    @Test
    void testLoginInvalidCredentialsReturnsUnauthorized() throws Exception {
        LoginRequest login = LoginRequest.builder()
                .email("nonexistent@test.com")
                .password("wrongpassword")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    void testCustomerTokenForbiddenOnAdminEndpoint() throws Exception {
        SignupRequest signup = SignupRequest.builder()
                .name("Charlie Customer")
                .email("charlie@test.com")
                .password("pass12345")
                .role(Role.CUSTOMER)
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        LoginRequest login = LoginRequest.builder()
                .email("charlie@test.com")
                .password("pass12345")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("token").asText();

        // Customer attempts to access an admin endpoint
        mockMvc.perform(get("/api/admin/shops/pending")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));
    }
}
