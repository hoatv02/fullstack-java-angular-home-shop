package com.example.HomeShop.repository;

import com.example.HomeShop.entity.Product;
import com.example.HomeShop.exception.Utils.Enums.Constant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm sản phẩm theo tên
    List<Product> findByNameContainingIgnoreCase(String name);

    // Tìm sản phẩm theo danh mục
    List<Product> findByCategoryId(Long categoryId);

    // Tìm sản phẩm theo trạng thái
    List<Product> findByStatus(Constant.ProductStatus status);

    // Tìm sản phẩm theo khoảng giá
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Tìm sản phẩm có phân trang
    Page<Product> findAll(Pageable pageable);

    // Tìm kiếm nâng cao với nhiều điều kiện
    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:status IS NULL OR p.status = :status)")
    Page<Product> searchProducts(@Param("name") String name,
                                 @Param("categoryId") Long categoryId,
//                                 @Param("status") ProductStatus status,
                                 Constant.ProductStatus productStatus, Pageable pageable);

    // Kiểm tra tồn tại theo tên
    boolean existsByName(String name);

    // Đếm sản phẩm theo danh mục
    long countByCategoryId(Long categoryId);
}
