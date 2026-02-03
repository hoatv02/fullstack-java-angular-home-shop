package com.example.HomeShop.controller;

import com.example.HomeShop.dto.ApiResponse;
import com.example.HomeShop.dto.CategoryDTO;
import com.example.HomeShop.dto.RegisterDTO;
import com.example.HomeShop.entity.Category;
import com.example.HomeShop.entity.User;
import com.example.HomeShop.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("category")
@Tag(name = "category", description = "Các API liên quan đến quản lý danh mục sản phẩm")
public class Categorys {
    private CategoryService categoryService;

    @PostMapping
    @Operation(summary = "Tạo danh mục mới", description = "Tạo một danh mục dùng mới (Admin)")
    public ResponseEntity<ApiResponse<Category>> CreateCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        Category result = categoryService.CreateCategory(categoryDTO);
        ApiResponse<Category> apiResponse = new ApiResponse<>();
        apiResponse.setData(result);
        apiResponse.setMessage("Category created successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
