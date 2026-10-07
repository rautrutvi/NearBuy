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
        if (userRepository.count() > 0) {
            return;
        }

        log.info("Database is empty. Seeding initial users...");

        // ── Core test accounts ──────────────────────────────────────────────────
        User admin = userRepository.save(User.builder()
                .name("Nearbuy Admin")
                .email("admin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .phone("9999999990")
                .active(true)
                .build());

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

        // ── Seed shopkeepers for Virar shops ─────────────────────────────────────
        User sharma = userRepository.save(User.builder()
                .name("Ramesh Sharma")
                .email("sharma@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9876543211")
                .active(true)
                .build());

        User lifecare = userRepository.save(User.builder()
                .name("Dr. Patel")
                .email("lifecare@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9876543212")
                .active(true)
                .build());

        User gupta = userRepository.save(User.builder()
                .name("Suresh Gupta")
                .email("gupta@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9876543213")
                .active(true)
                .build());

        User apex = userRepository.save(User.builder()
                .name("Apex Enterprises")
                .email("apex@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9876543214")
                .active(true)
                .build());

        User ravi = userRepository.save(User.builder()
                .name("Ravi Electronics")
                .email("ravi@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9876543215")
                .active(true)
                .build());

        User preeti = userRepository.save(User.builder()
                .name("Preeti Organics")
                .email("preeti@test.com")
                .password(passwordEncoder.encode("pass123"))
                .role(Role.SHOPKEEPER)
                .phone("9876543216")
                .active(true)
                .build());

        // ── 4 Approved shops near Virar, Maharashtra ─────────────────────────────
        Shop sharmaShop = shopRepository.save(Shop.builder()
                .owner(sharma)
                .name("Sharma General Kirana & Provisions")
                .address("Station Road, Ward 4, Virar West")
                .latitude(19.4640)
                .longitude(72.8044)
                .category("Grocery")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("07:00 - 22:00")
                .build());

        Shop lifecareShop = shopRepository.save(Shop.builder()
                .owner(lifecare)
                .name("Lifecare Medical & Monsoon Pharmacy")
                .address("Market Yard Chowk, Virar West")
                .latitude(19.4670)
                .longitude(72.8038)
                .category("Pharmacy")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("09:00 - 21:00")
                .build());

        Shop guptaShop = shopRepository.save(Shop.builder()
                .owner(gupta)
                .name("Gupta Hardware & Monsoon Safety Tools")
                .address("Main Highway Link Rd, Virar")
                .latitude(19.4690)
                .longitude(72.8060)
                .category("Hardware")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:30 - 20:30")
                .build());

        Shop apexShop = shopRepository.save(Shop.builder()
                .owner(apex)
                .name("Apex Supermarket & Daily Essentials")
                .address("Subhash Nagar Phase 1, Virar East")
                .latitude(19.4710)
                .longitude(72.8090)
                .category("Supermarket")
                .verifiedStatus(VerifiedStatus.APPROVED)
                .openingHours("08:00 - 23:00")
                .build());

        // ── 2 Pending shops ───────────────────────────────────────────────────────
        shopRepository.save(Shop.builder()
                .owner(ravi)
                .name("Ravi Electronics & Mobile Accessories")
                .address("Sector 7, Industrial Zone, Virar")
                .latitude(19.4720)
                .longitude(72.8020)
                .category("Electronics")
                .verifiedStatus(VerifiedStatus.PENDING)
                .openingHours("10:00 - 20:00")
                .build());

        shopRepository.save(Shop.builder()
                .owner(preeti)
                .name("Preeti Organic Vegetables & Fruits")
                .address("Ganesh Nagar, Plot 12, Virar East")
                .latitude(19.4700)
                .longitude(72.8100)
                .category("Organic Food")
                .verifiedStatus(VerifiedStatus.PENDING)
                .openingHours("06:00 - 13:00")
                .build());

        // ── Products with barcodes ────────────────────────────────────────────────
        productRepository.save(Product.builder()
                .shop(lifecareShop)
                .name("Paracetamol 650mg (15 Strips)")
                .description("Pain relief & fever medication. Monsoon essential.")
                .price(BigDecimal.valueOf(45.00))
                .quantity(200)
                .category("Medicine")
                .barcode("8901058900928")
                .lowStockThreshold(20)
                .build());

        productRepository.save(Product.builder()
                .shop(guptaShop)
                .name("Rechargeable LED Emergency Torch Light")
                .description("Waterproof LED torch with 12-hour battery backup.")
                .price(BigDecimal.valueOf(499.00))
                .quantity(30)
                .category("Safety Equipment")
                .barcode("8904243000123")
                .lowStockThreshold(5)
                .build());

        productRepository.save(Product.builder()
                .shop(guptaShop)
                .name("Waterproof Gum Boots (Size 9)")
                .description("Heavy duty waterproof gum boots for flooded roads.")
                .price(BigDecimal.valueOf(650.00))
                .quantity(15)
                .category("Footwear")
                .barcode("8904243000456")
                .lowStockThreshold(3)
                .build());

        productRepository.save(Product.builder()
                .shop(sharmaShop)
                .name("Heavy Duty Windproof Umbrella")
                .description("Reinforced double canopy, windproof up to 100 kmph.")
                .price(BigDecimal.valueOf(349.00))
                .quantity(50)
                .category("Weather Gear")
                .barcode("8904243000789")
                .lowStockThreshold(10)
                .build());

        productRepository.save(Product.builder()
                .shop(apexShop)
                .name("Monsoon Safety Kit")
                .description("Includes: raincoat, torch, first-aid, water purifier tablets.")
                .price(BigDecimal.valueOf(899.00))
                .quantity(25)
                .category("Safety Equipment")
                .barcode("8904243001001")
                .lowStockThreshold(5)
                .build());

        // ── Flood zones ───────────────────────────────────────────────────────────
        // 1 VERIFIED zone near Lifecare pharmacy
        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.4668)
                .longitude(72.8040)
                .radiusMeters(300.0)
                .reportedBy(customer)
                .status(FloodZoneStatus.VERIFIED)
                .description("Waterlogged underpass near Market Yard Chowk, knee-deep water")
                .expiresAt(LocalDateTime.now().plusHours(5))
                .build());

        // 1 VERIFIED zone near Apex supermarket
        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.4712)
                .longitude(72.8092)
                .radiusMeters(200.0)
                .reportedBy(customer)
                .status(FloodZoneStatus.VERIFIED)
                .description("Subhash Nagar drain overflow, road impassable")
                .expiresAt(LocalDateTime.now().plusHours(4))
                .build());

        // 2 PENDING reports
        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.4650)
                .longitude(72.8070)
                .radiusMeters(150.0)
                .reportedBy(shopkeeper)
                .status(FloodZoneStatus.PENDING)
                .description("Waterlogging near railway tracks, reported by local shop")
                .expiresAt(LocalDateTime.now().plusHours(6))
                .build());

        floodZoneRepository.save(FloodZone.builder()
                .latitude(19.4730)
                .longitude(72.8010)
                .radiusMeters(250.0)
                .reportedBy(customer)
                .status(FloodZoneStatus.PENDING)
                .description("Industrial zone road flooded after heavy rains")
                .expiresAt(LocalDateTime.now().plusHours(6))
                .build());

        log.info("Virar demo data successfully seeded: 6 shops, 5 products, 4 flood zones.");
    }
}
