package com.nearbuy.controller;

import com.nearbuy.dto.ProductResponse;
import com.nearbuy.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public controller for discovering and searching products across shops.
 */
@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/shops/{shopId}/products - Returns all products for a specific shop.
     */
    @GetMapping("/api/shops/{shopId}/products")
    public ResponseEntity<List<ProductResponse>> getProductsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }

    /**
     * GET /api/products/search?query=&category= - Public product search.
     */
    @GetMapping("/api/products/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(productService.searchProducts(query, category));
    }
}
