package com.nearbuy.controller;

import com.nearbuy.dto.ProductRequest;
import com.nearbuy.dto.ProductResponse;
import com.nearbuy.dto.StockUpdateRequest;
import com.nearbuy.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for shopkeeper inventory management: CRUD, stock levels, and threshold queries.
 */
@RestController
@RequestMapping("/api/shopkeeper/products")
@RequiredArgsConstructor
public class ShopkeeperProductController {

    private final ProductService productService;

    /**
     * POST /api/shopkeeper/products - Adds a product to own shop.
     */
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ProductResponse response = productService.createProduct(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * PUT /api/shopkeeper/products/{id} - Updates product details (ownership required).
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ProductResponse response = productService.updateProduct(id, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/shopkeeper/products/{id} - Deletes a product (ownership required).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        productService.deleteProduct(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/shopkeeper/products - Returns all products in caller's shop.
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getMyProducts(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(productService.getMyProducts(userDetails.getUsername()));
    }

    /**
     * GET /api/shopkeeper/products/low-stock - Returns low stock items.
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponse>> getMyLowStockProducts(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(productService.getMyLowStockProducts(userDetails.getUsername()));
    }

    /**
     * PATCH /api/shopkeeper/products/{id}/stock - Increments/decrements stock by delta.
     */
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ProductResponse response = productService.updateStock(id, request.getDelta(), userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
