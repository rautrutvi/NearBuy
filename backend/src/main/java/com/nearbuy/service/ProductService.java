package com.nearbuy.service;

import com.nearbuy.dto.ProductRequest;
import com.nearbuy.dto.ProductResponse;
import com.nearbuy.entity.Product;
import com.nearbuy.entity.Shop;
import com.nearbuy.entity.User;
import com.nearbuy.entity.VerifiedStatus;
import com.nearbuy.exception.BadRequestException;
import com.nearbuy.exception.ForbiddenException;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.repository.ProductRepository;
import com.nearbuy.repository.ShopRepository;
import com.nearbuy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing product inventory, stock levels, search, and ownership rules.
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    /**
     * Adds a product to the shopkeeper's shop after verifying shop ownership.
     */
    @Transactional
    public ProductResponse createProduct(ProductRequest request, String ownerEmail) {
        User user = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long candidateShopId = request.getShopId();
        if (candidateShopId == null) {
            List<Shop> userShops = shopRepository.findByOwner(user);
            if (userShops.isEmpty()) {
                throw new BadRequestException("You do not own any shop to add products to");
            }
            candidateShopId = userShops.get(0).getId();
        }
        final Long finalShopId = candidateShopId;

        Shop shop = shopRepository.findById(finalShopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + finalShopId));

        if (!shop.getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only add products to your own shop");
        }

        if (shop.getVerifiedStatus() != VerifiedStatus.APPROVED) {
            throw new ForbiddenException("Shop is pending approval by Administrator rautrutvi@gmail.com. You cannot add products until approved.");
        }

        Product product = Product.builder()
                .shop(shop)
                .name(request.getName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .category(request.getCategory())
                .barcode(request.getBarcode())
                .imageUrl(request.getImageUrl())
                .lowStockThreshold(request.getLowStockThreshold() != null ? request.getLowStockThreshold() : 5)
                .build();

        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }

    /**
     * Updates an existing product after verifying the caller owns the parent shop.
     */
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, String ownerEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getShop().getOwner().getEmail().equalsIgnoreCase(ownerEmail.trim())) {
            throw new ForbiddenException("You can only modify products in your own shop");
        }

        if (product.getShop().getVerifiedStatus() != VerifiedStatus.APPROVED) {
            throw new ForbiddenException("Shop is pending approval by Administrator rautrutvi@gmail.com. You cannot modify products until approved.");
        }

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());
        product.setBarcode(request.getBarcode());
        product.setImageUrl(request.getImageUrl());
        if (request.getLowStockThreshold() != null) {
            product.setLowStockThreshold(request.getLowStockThreshold());
        }

        Product updated = productRepository.save(product);
        return mapToProductResponse(updated);
    }

    /**
     * Deletes a product after verifying ownership.
     */
    @Transactional
    public void deleteProduct(Long id, String ownerEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getShop().getOwner().getEmail().equalsIgnoreCase(ownerEmail.trim())) {
            throw new ForbiddenException("You can only delete products in your own shop");
        }

        productRepository.delete(product);
    }

    /**
     * Retrieves all products belonging to shops owned by the logged-in shopkeeper.
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> getMyProducts(String ownerEmail) {
        User user = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return productRepository.findByShopOwnerId(user.getId()).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves low-stock products for the logged-in shopkeeper.
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> getMyLowStockProducts(String ownerEmail) {
        User user = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return productRepository.findLowStockByOwnerId(user.getId()).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    /**
     * Adjusts product stock by delta (positive or negative).
     */
    @Transactional
    public ProductResponse updateStock(Long id, int delta, String ownerEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getShop().getOwner().getEmail().equalsIgnoreCase(ownerEmail.trim())) {
            throw new ForbiddenException("You can only update stock in your own shop");
        }

        if (product.getShop().getVerifiedStatus() != VerifiedStatus.APPROVED) {
            throw new ForbiddenException("Shop is pending approval by Administrator rautrutvi@gmail.com. You cannot update stock until approved.");
        }

        int newQuantity = product.getQuantity() + delta;
        if (newQuantity < 0) {
            throw new BadRequestException("Insufficient stock. Resulting quantity cannot be negative (current: "
                    + product.getQuantity() + ", delta: " + delta + ")");
        }

        product.setQuantity(newQuantity);
        Product updated = productRepository.save(product);
        return mapToProductResponse(updated);
    }

    /**
     * Public: Retrieves all products belonging to a shop.
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByShop(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + shopId));

        if (shop.getVerifiedStatus() != VerifiedStatus.APPROVED) {
            return List.of();
        }

        return productRepository.findByShopId(shopId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    /**
     * Public: Searches products by keyword and/or category.
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query, String category) {
        return productRepository.searchProducts(query, category).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    /**
     * Maps Product entity to ProductResponse DTO including stockLabel computation.
     */
    public ProductResponse mapToProductResponse(Product product) {
        String stockLabel;
        if (product.getQuantity() <= 0) {
            stockLabel = "OUT";
        } else if (product.getQuantity() <= product.getLowStockThreshold()) {
            stockLabel = "LOW";
        } else {
            stockLabel = "IN_STOCK";
        }

        return ProductResponse.builder()
                .id(product.getId())
                .shopId(product.getShop().getId())
                .shopName(product.getShop().getName())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .category(product.getCategory())
                .barcode(product.getBarcode())
                .imageUrl(product.getImageUrl())
                .lowStockThreshold(product.getLowStockThreshold())
                .createdAt(product.getCreatedAt())
                .stockLabel(stockLabel)
                .build();
    }
}
