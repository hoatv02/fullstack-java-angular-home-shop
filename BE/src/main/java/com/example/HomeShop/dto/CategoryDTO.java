package com.example.HomeShop.dto;

import com.example.HomeShop.Enums.CategoryStatusEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDTO {

    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(min = 2, max = 100, message = "Tên danh mục phải từ 2 đến 100 ký tự")
    private String name;

    @NotBlank(message = "Slug không được để trống")
    @Size(min = 2, max = 150, message = "Slug phải từ 2 đến 150 ký tự")
    private String slug;

    private Long parentId;

    @NotNull(message = "Level không được để trống")
    private Integer level;

    @NotNull(message = "Trạng thái không được để trống")
    private CategoryStatusEnum status;

    private Integer sortOrder;

    private String imageUrl;
}