package com.example.HomeShop.controller;

import com.example.HomeShop.dto.ApiResponse;
import com.example.HomeShop.dto.CategoryDTO;
import com.example.HomeShop.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        ApiResponse<List<CategoryDTO>> apiResponse = categoryService.getAllCategories();
        List<CategoryDTO> categories = apiResponse.getData();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", apiResponse.getMessage());
        response.put("data", categories);
        response.put("total", categories.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCategoryById(@PathVariable Long id) {
        ApiResponse<CategoryDTO> apiResponse = categoryService.getCategoryById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", apiResponse.getMessage());
        response.put("data", apiResponse.getData());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        ApiResponse<CategoryDTO> apiResponse = categoryService.createCategory(categoryDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", apiResponse.getMessage());
        response.put("data", apiResponse.getData());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        ApiResponse<CategoryDTO> apiResponse = categoryService.updateCategory(id, categoryDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", apiResponse.getMessage());
        response.put("data", apiResponse.getData());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        ApiResponse<String> apiResponse = categoryService.deleteCategory(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", apiResponse.getMessage());

        return ResponseEntity.ok(response);
    }
}
