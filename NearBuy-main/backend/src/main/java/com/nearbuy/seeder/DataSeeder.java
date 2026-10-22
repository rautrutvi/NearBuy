package com.nearbuy.seeder;

import com.nearbuy.entity.*;
import com.nearbuy.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Seeds the database with demo users, shops, products, and flood zones on first run.
 * Idempotent: only runs if the users table is empty.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final FloodZoneRepository floodZoneRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Always ensure rautrutvi@gmail.com is present with ADMIN role
        if (!userRepository.existsByEmail("rautrutvi@gmail.com")) {
            userRepository.save(User.builder()
                    .name("Rutvi Raut")
                    .email("rautrutvi@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("9999999990")
                    .active(true)
                    .build());
            log.info("Administrator rautrutvi@gmail.com provisioned.");
        }

        if (userRepository.count() > 1) {
            return;
        }

        log.info("Database is empty. Seeding initial users...");

        // ── Administrator Account (Exclusively rautrutvi@gmail.com) ─────────────
        User admin = userRepository.save(User.builder()
                .name("Rutvi Raut")
                .email("rautrutvi@gmail.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .phone("9999999990")
                .active(true)
                .build());

        log.info("Administrator rautrutvi@gmail.com seeded successfully.");

        User customer = userRepository.save(User.builder()
                .name("Test Customer")
                .email("customer@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.CUSTOMER)
                .phone("9999999991")
                .active(true)
                .build());

        User shopkeeper = userRepository.save(User.builder()
                .name("Test Shopkeeper")
                .email("shop@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9999999992")
                .active(true)
                .build());

        log.info("Initial users successfully seeded.");

        // ── Shopkeepers for the 6 Vasai West grocery shops ───────────────────────
        User vardhmanOwner = userRepository.save(User.builder()
                .name("Vardhman Grain Stores")
                .email("vardhman@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9890035858")
                .active(true)
                .build());

        User dedhiaOwner = userRepository.save(User.builder()
                .name("Dedhia Kirana")
                .email("dedhia@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9226139567")
                .active(true)
                .build());

        User jashodaOwner = userRepository.save(User.builder()
                .name("Jashoda Grain Stores")
                .email("jashoda@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9923273746")
                .active(true)
                .build());

        User devnarayanOwner = userRepository.save(User.builder()
                .name("Devnarayan Super Market")
                .email("devnarayan@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9158457802")
                .active(true)
                .build());

        User jagrutiOwner = userRepository.save(User.builder()
                .name("Jagruti Super Market")
                .email("jagruti@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("7021071461")
                .active(true)
                .build());

        User jalaramOwner = userRepository.save(User.builder()
                .name("Jalaram Kirana Store")
                .email("jalaram@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("6377400582")
                .active(true)
                .build());

        // ── 6 Real Grocery shops in Vasai West, Maharashtra ─────────────────────
        Shop vardhmanShop = shopRepository.save(Shop.builder()
                .owner(vardhmanOwner)
                .name("Vardhman Grain Stores")
                .address("Shop No 1, Guruprasad Apt, Veer Savarkar Nagar, Anand Nagar, Vasai West 401202")
                .latitude(19.38107)
                .longitude(72.83014)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:00 - 22:00")
                .imageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60")
                .build());

        Shop dedhiaShop = shopRepository.save(Shop.builder()
                .owner(dedhiaOwner)
                .name("Dedhia Kirana")
                .address("2, Janpad Shopping Centre, Navghar, Station Road, Vasai West 401202")
                .latitude(19.38262)
                .longitude(72.83053)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:00 - 22:00")
                .imageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60")
                .build());

        Shop jashodaShop = shopRepository.save(Shop.builder()
                .owner(jashodaOwner)
                .name("Jashoda Grain Stores")
                .address("Nutan Siddharth Building, Vasai Rd W, Veer Savarkar Nagar, Anand Nagar, Vasai West 401202")
                .latitude(19.38066)
                .longitude(72.83132)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:00 - 22:00")
                .imageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60")
                .build());

        Shop devnarayanShop = shopRepository.save(Shop.builder()
                .owner(devnarayanOwner)
                .name("Devnarayan Super Market")
                .address("Shop No. 1, Badami Stop, Giriz Road, Navghar Manikpur, Vasai West 401202")
                .latitude(19.38429)
                .longitude(72.82945)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:00 - 22:00")
                .imageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60")
                .build());

        Shop jagrutiShop = shopRepository.save(Shop.builder()
                .owner(jagrutiOwner)
                .name("Jagruti Super Market")
                .address("Shop No. 31/32, Gokul Park, Vasai Rd W, Jayraj Nagar, Sai Nagar, Vasai West 401202")
                .latitude(19.38477)
                .longitude(72.82480)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:00 - 22:00")
                .imageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60")
                .build());

        Shop jalaramShop = shopRepository.save(Shop.builder()
                .owner(jalaramOwner)
                .name("Jalaram Kirana Store")
                .address("Vishwakarma Apartment Bhaji Market, 1&2, Ambadi Rd, Navghar Manikpur, Sai Nagar, Vasai West 401202")
                .latitude(19.38380)
                .longitude(72.82750)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:00 - 22:00")
                .imageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60")
                .build());

        // ── Products for each shop (3 per shop, 18 total) ───────────────────────

        // Shop 1: Vardhman Grain Stores
        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(vardhmanShop)
                .name("Premium Toor Dal (1 kg)")
                .description("Unpolished protein-rich Toor Dal, cleaned and graded for daily cooking.")
                .price(BigDecimal.valueOf(165.00))
                .quantity(25)
                .category("Grocery")
                .barcode("8901234500001")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(vardhmanShop)
                .name("Kolam Raw Rice (5 kg)")
                .description("Traditional Kolam aged rice with soft texture and rich aroma.")
                .price(BigDecimal.valueOf(320.00))
                .quantity(18)
                .category("Grocery")
                .barcode("8901234500002")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(vardhmanShop)
                .name("Fortune Sunflower Oil (1 L)")
                .description("Refined sunflower cooking oil enriched with vitamins A & D.")
                .price(BigDecimal.valueOf(145.00))
                .quantity(30)
                .category("Grocery")
                .barcode("8901234500003")
                .lowStockThreshold(5)
                .build());

        // Shop 2: Dedhia Kirana
        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(dedhiaShop)
                .name("Yellow Moong Dal (1 kg)")
                .description("Easily digestible split yellow moong lentils, nutrient-rich.")
                .price(BigDecimal.valueOf(140.00))
                .quantity(22)
                .category("Grocery")
                .barcode("8901234500004")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(dedhiaShop)
                .name("Daawat Rozana Basmati Rice (5 kg)")
                .description("Everyday basmati rice with slender grains and authentic aroma.")
                .price(BigDecimal.valueOf(380.00))
                .quantity(14)
                .category("Grocery")
                .barcode("8901234500005")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(dedhiaShop)
                .name("Pure Kachi Ghani Mustard Oil (1 L)")
                .description("Cold pressed pungent mustard oil for authentic traditional Indian dishes.")
                .price(BigDecimal.valueOf(160.00))
                .quantity(20)
                .category("Grocery")
                .barcode("8901234500006")
                .lowStockThreshold(5)
                .build());

        // Shop 3: Jashoda Grain Stores
        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jashodaShop)
                .name("Desi Chana Dal (1 kg)")
                .description("Golden polished Chana Dal, staple for curries, dal fry, and snacks.")
                .price(BigDecimal.valueOf(110.00))
                .quantity(26)
                .category("Grocery")
                .barcode("8901234500007")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jashodaShop)
                .name("Sona Masoori Rice (5 kg)")
                .description("Medium grain aromatic South Indian rice, lightweight and low starch.")
                .price(BigDecimal.valueOf(340.00))
                .quantity(16)
                .category("Grocery")
                .barcode("8901234500008")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jashodaShop)
                .name("Cold Pressed Groundnut Oil (1 L)")
                .description("Filter groundnut peanut oil with pleasant nutty aroma.")
                .price(BigDecimal.valueOf(190.00))
                .quantity(15)
                .category("Grocery")
                .barcode("8901234500009")
                .lowStockThreshold(5)
                .build());

        // Shop 4: Devnarayan Super Market
        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(devnarayanShop)
                .name("Whole White Urad Dal (1 kg)")
                .description("Whole white urad lentils, ideal for idli, dosa, and vada batter.")
                .price(BigDecimal.valueOf(150.00))
                .quantity(18)
                .category("Grocery")
                .barcode("8901234500010")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(devnarayanShop)
                .name("MP Sharbati Wheat Flour / Atta (5 kg)")
                .description("100% pure MP Sharbati wheat grains ground to make extra soft rotis.")
                .price(BigDecimal.valueOf(230.00))
                .quantity(25)
                .category("Grocery")
                .barcode("8901234500011")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(devnarayanShop)
                .name("Gemini Refined Soyabean Oil (1 L)")
                .description("Light cooking soyabean oil with Omega 3 & 6 essential fatty acids.")
                .price(BigDecimal.valueOf(135.00))
                .quantity(32)
                .category("Grocery")
                .barcode("8901234500012")
                .lowStockThreshold(5)
                .build());

        // Shop 5: Jagruti Super Market
        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jagrutiShop)
                .name("Big Kabuli Chana / Chickpeas (1 kg)")
                .description("Jumbo size Kabuli chickpeas, perfect for restaurant-style chole bhature.")
                .price(BigDecimal.valueOf(160.00))
                .quantity(20)
                .category("Grocery")
                .barcode("8901234500013")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jagrutiShop)
                .name("Aashirvaad Superior MP Atta (10 kg)")
                .description("Whole wheat flour crafted through traditional 4-step chakki grinding process.")
                .price(BigDecimal.valueOf(430.00))
                .quantity(12)
                .category("Grocery")
                .barcode("8901234500014")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jagrutiShop)
                .name("Amul Pure Cow Ghee (1 L)")
                .description("Golden granular cow ghee made from fresh cream, rich aroma and taste.")
                .price(BigDecimal.valueOf(590.00))
                .quantity(15)
                .category("Grocery")
                .barcode("8901234500015")
                .lowStockThreshold(5)
                .build());

        // Shop 6: Jalaram Kirana Store
        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jalaramShop)
                .name("Red Masoor Dal (1 kg)")
                .description("Split red masoor lentils, quick cooking and high in dietary fiber.")
                .price(BigDecimal.valueOf(125.00))
                .quantity(24)
                .category("Grocery")
                .barcode("8901234500016")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jalaramShop)
                .name("Madhur Sulphurless Pure Sugar (5 kg)")
                .description("Refined sulphur-free crystal sugar untouched by hands.")
                .price(BigDecimal.valueOf(240.00))
                .quantity(28)
                .category("Grocery")
                .barcode("8901234500017")
                .lowStockThreshold(5)
                .build());

        // SAMPLE PRICE - replace with the shopkeeper's real price
        productRepository.save(Product.builder()
                .shop(jalaramShop)
                .name("Saffola Gold Pro Cooking Oil (1 L)")
                .description("Dual-seed technology blended oil with antioxidant power for heart health.")
                .price(BigDecimal.valueOf(175.00))
                .quantity(19)
                .category("Grocery")
                .barcode("8901234500018")
                .lowStockThreshold(5)
                .build());

        // ── Flood zones (4 zones within ~300m of the shops in Vasai West) ──────────
        // 1 VERIFIED zone near Vasai Station Road underpass
        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.3820)
                .longitude(72.8295)
                .radiusMeters(150.0)
                .reportedBy(customer)
                .status(FloodZoneStatus.VERIFIED)
                .description("DEMO: Waterlogged underpass near Vasai Station Road, ankle-deep water")
                .expiresAt(LocalDateTime.now().plusHours(5))
                .build());

        // 1 VERIFIED zone near Ambadi Road market
        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.3835)
                .longitude(72.8280)
                .radiusMeters(120.0)
                .reportedBy(customer)
                .status(FloodZoneStatus.VERIFIED)
                .description("DEMO: Ambadi Road market drain overflow, slow traffic")
                .expiresAt(LocalDateTime.now().plusHours(4))
                .build());

        // 2 PENDING reports
        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.3812)
                .longitude(72.8305)
                .radiusMeters(100.0)
                .reportedBy(shopkeeper)
                .status(FloodZoneStatus.PENDING)
                .description("DEMO: Water accumulation near Anand Nagar junction")
                .expiresAt(LocalDateTime.now().plusHours(6))
                .build());

        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.3840)
                .longitude(72.8290)
                .radiusMeters(150.0)
                .reportedBy(customer)
                .status(FloodZoneStatus.PENDING)
                .description("DEMO: Puddle forming near Badami Stop, drive slow")
                .expiresAt(LocalDateTime.now().plusHours(6))
                .build());

        log.info("Vasai demo data successfully seeded: 6 shops, 18 products, 4 flood zones.");
    }
}
