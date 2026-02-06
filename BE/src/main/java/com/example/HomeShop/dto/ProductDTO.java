package com.example.HomeShop.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 200, message = "Tên sản phẩm phải từ 3-200 ký tự")
    private String name;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    private String description;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    @Digits(integer = 10, fraction = 2, message = "Giá không hợp lệ")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải >= 0")
    private Integer quantity;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @Size(max = 50, message = "Loại sản phẩm không được quá 50 ký tự")
    private String productType;

    @Pattern(regexp = "^(https?://)?[\\w.-]+\\.[a-z]{2,}(/.*)?$|^$",
            message = "URL hình ảnh không hợp lệ")
    private String imageUrl;

    private String status; // ACTIVE, INACTIVE, OUT_OF_STOCK
}
