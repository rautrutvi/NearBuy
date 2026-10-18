package com.nearbuy.service;

import com.nearbuy.dto.ProductResponse;
import com.nearbuy.entity.Product;
import com.nearbuy.entity.User;
import com.nearbuy.entity.VerifiedStatus;
import com.nearbuy.exception.BadRequestException;
import com.nearbuy.exception.ForbiddenException;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.repository.ProductRepository;
import com.nearbuy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for the shopkeeper scan-to-sell flow:
 * looks up a product by barcode within caller's own shops and decrements stock.
 */
@Service
@RequiredArgsConstructor
public class ScanSellService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    /**
     * Finds a product by barcode in the caller's shop, checks stock, and decrements.
     */
    @Transactional
    public ProductResponse scanAndSell(String barcode, int quantity, String shopkeeperEmail) {
        User shopkeeper = userRepository.findByEmail(shopkeeperEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Shopkeeper not found"));

        Product product = productRepository.findByShopOwnerIdAndBarcode(shopkeeper.getId(), barcode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No product with barcode '" + barcode + "' found in your shop"));

        if (product.getShop().getVerifiedStatus() != VerifiedStatus.APPROVED) {
            throw new ForbiddenException("Shop is pending approval by Administrator rautrutvi@gmail.com. You cannot sell items until approved.");
        }

        if (product.getQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock for product: " + product.getName()
                    + ". Available: " + product.getQuantity() + ", Requested: " + quantity);
        }

        product.setQuantity(product.getQuantity() - quantity);
        Product updated = productRepository.save(product);
        return productService.mapToProductResponse(updated);
    }
}
