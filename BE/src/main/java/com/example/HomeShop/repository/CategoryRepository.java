package com.example.HomeShop.repository;

import com.example.HomeShop.Enums.CategoryStatusEnum;
import com.example.HomeShop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Tìm category theo slug
    Optional<Category> findBySlug(String slug);

    // Lấy danh mục theo trạng thái
    List<Category> findByStatus(CategoryStatusEnum status);

    // Lấy danh mục con theo parentId
    List<Category> findByParentId(Long parentId);

    // Lấy danh mục con theo parentId + status
    List<Category> findByParentIdAndStatus(Long parentId, CategoryStatusEnum status);

    // Check trùng slug (dùng khi create / update)
    boolean existsBySlug(String slug);
}