package com.nearbuy.repository;

import com.nearbuy.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Product persistence, queries, search, and pessimistic locking.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByShopId(Long shopId);

    List<Product> findByShopOwnerId(Long ownerId);

    @Query("SELECT p FROM Product p WHERE p.shop.owner.id = :ownerId AND p.quantity <= p.lowStockThreshold")
    List<Product> findLowStockByOwnerId(@Param("ownerId") Long ownerId);

    Optional<Product> findByShopOwnerIdAndBarcode(Long ownerId, String barcode);

    Optional<Product> findByShopIdAndBarcode(Long shopId, String barcode);

    @Query("SELECT p FROM Product p WHERE " +
            "p.shop.verifiedStatus = com.nearbuy.entity.VerifiedStatus.APPROVED AND " +
            "(:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category))")
    List<Product> searchProducts(@Param("query") String query, @Param("category") String category);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") Long id);
}
