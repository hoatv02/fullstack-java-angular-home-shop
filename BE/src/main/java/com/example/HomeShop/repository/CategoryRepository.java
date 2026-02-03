package com.example.HomeShop.repository;

import com.example.HomeShop.Enums.CategoryStatusEnum;
import com.example.HomeShop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    Optional<Category> findBySlug(String slug);

    List<Category> findByParentId(Long parentId);

    List<Category> findByStatus(CategoryStatusEnum status);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    boolean existsByParentId(Long parentId);

    boolean existsByStatus(CategoryStatusEnum status);
}