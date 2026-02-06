package com.example.HomeShop.controller;

import com.example.HomeShop.dto.ProductDTO;
import com.example.HomeShop.response.ProductResponse;
import com.example.HomeShop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    /**
     * Tìm kiếm và lấy danh sách sản phẩm (có phân trang + filter)
     *
     * Examples:
     * - GET /api/products                          → Tất cả sản phẩm, phân trang mặc định
     * - GET /api/products?page=0&size=20           → Tùy chỉnh phân trang
     * - GET /api/products?name=iphone              → Tìm theo tên
     * - GET /api/products?categoryId=1             → Lọc theo category
     * - GET /api/products?status=ACTIVE            → Lọc theo status
     * - GET /api/products?name=iphone&categoryId=1 → Kết hợp nhiều điều kiện
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        Page<ProductResponse> productPage = productService.searchProducts(
                name, categoryId, status, page, size, sortBy);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Lấy danh sách sản phẩm thành công");
        response.put("data", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        response.put("pageSize", productPage.getSize());

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy chi tiết sản phẩm theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Lấy thông tin sản phẩm thành công");
        response.put("data", product);

        return ResponseEntity.ok(response);
    }

    /**
     * Tạo sản phẩm mới
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductResponse createdProduct = productService.createProduct(productDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tạo sản phẩm thành công");
        response.put("data", createdProduct);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật toàn bộ thông tin sản phẩm
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductResponse updatedProduct = productService.updateProduct(id, productDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cập nhật sản phẩm thành công");
        response.put("data", updatedProduct);

        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật một phần thông tin sản phẩm
     * Body examples:
     * - {"quantity": 100}          → Cập nhật số lượng
     * - {"status": "INACTIVE"}     → Cập nhật trạng thái
     * - {"quantity": 0}            → Auto set status = OUT_OF_STOCK
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        ProductResponse updatedProduct = productService.patchProduct(id, updates);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cập nhật sản phẩm thành công");
        response.put("data", updatedProduct);

        return ResponseEntity.ok(response);
    }

    /**
     * Xóa sản phẩm
     * Query param: ?soft=true → Xóa mềm (set status = INACTIVE)
     *              ?soft=false hoặc không truyền → Xóa cứng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean soft) {

        if (soft) {
            ProductResponse product = productService.softDeleteProduct(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vô hiệu hóa sản phẩm thành công");
            response.put("data", product);
            return ResponseEntity.ok(response);
        } else {
            productService.deleteProduct(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa sản phẩm thành công");
            return ResponseEntity.ok(response);
        }
    }
}