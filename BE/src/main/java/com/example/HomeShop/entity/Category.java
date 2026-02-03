package com.example.HomeShop.entity;

import com.example.HomeShop.Enums.CategoryStatusEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên danh mục
    @Column(nullable = false)
    private String name;

    // Dùng cho URL SEO: dien-thoai, thoi-trang-nam
    @Column(nullable = false, unique = true)
    private String slug;

    // Danh mục cha (null nếu là root)
    @Column(name = "parent_id")
    private Long parentId;

    // Cấp độ danh mục (0: root, 1: con, 2: cháu)
    @Column(nullable = false)
    private Integer level;

    // Trạng thái: ACTIVE / INACTIVE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryStatusEnum status;

    // Thứ tự hiển thị
    @Column(name = "sort_order")
    private Integer sortOrder;
}