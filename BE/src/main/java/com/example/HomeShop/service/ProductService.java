package com.example.HomeShop.service;

import com.example.HomeShop.dto.ProductDTO;
import com.example.HomeShop.entity.Category;
import com.example.HomeShop.entity.Product;
import com.example.HomeShop.exception.Category.CategoryNotFoundException;
import com.example.HomeShop.exception.Product.ProductNotFoundException;
import com.example.HomeShop.exception.Utils.DuplicateResourceException;
import com.example.HomeShop.exception.Utils.Enums.Constant;
import com.example.HomeShop.repository.CategoryRepository;
import com.example.HomeShop.repository.ProductRepository;
import com.example.HomeShop.response.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Tìm kiếm sản phẩm với phân trang và filter
     */
    public Page<ProductResponse> searchProducts(String name, Long categoryId, String status,
                                                int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Constant.ProductStatus productStatus = status != null ?
                Constant.ProductStatus.valueOf(status.toUpperCase()) : null;

        return productRepository.searchProducts(name, categoryId, productStatus, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Lấy sản phẩm theo ID
     */
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return convertToResponse(product);
    }

    /**
     * Tạo sản phẩm mới
     */
    @Transactional
    public ProductResponse createProduct(ProductDTO productDTO) {
        if (productRepository.existsByName(productDTO.getName())) {
            throw new DuplicateResourceException("Sản phẩm với tên '" + productDTO.getName() + "' đã tồn tại");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Không tìm thấy danh mục với ID: " + productDTO.getCategoryId()));

        Product product = convertToEntity(productDTO);
        product.setCategory(category);

        if (product.getQuantity() == 0) {
            product.setStatus(Constant.ProductStatus.OUT_OF_STOCK);
        }

        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    /**
     * Cập nhật toàn bộ sản phẩm
     */
    @Transactional
    public ProductResponse updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        if (!existingProduct.getName().equals(productDTO.getName())
                && productRepository.existsByName(productDTO.getName())) {
            throw new DuplicateResourceException("Sản phẩm với tên '" + productDTO.getName() + "' đã tồn tại");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Không tìm thấy danh mục với ID: " + productDTO.getCategoryId()));

        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setCategory(category);
        existingProduct.setProductType(productDTO.getProductType());
        existingProduct.setImageUrl(productDTO.getImageUrl());

        if (productDTO.getStatus() != null) {
            existingProduct.setStatus(Constant.ProductStatus.valueOf(productDTO.getStatus().toUpperCase()));
        }

        if (existingProduct.getQuantity() == 0) {
            existingProduct.setStatus(Constant.ProductStatus.OUT_OF_STOCK);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToResponse(updatedProduct);
    }

    /**
     * Cập nhật một phần thông tin sản phẩm (PATCH)
     * Gộp updateProductQuantity vào đây
     */
    @Transactional
    public ProductResponse patchProduct(Long id, Map<String, Object> updates) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        // Cập nhật quantity nếu có
        if (updates.containsKey("quantity")) {
            Integer quantity = (Integer) updates.get("quantity");
            product.setQuantity(quantity);

            // Tự động cập nhật status
            if (quantity == 0) {
                product.setStatus(Constant.ProductStatus.OUT_OF_STOCK);
            } else if (product.getStatus() == Constant.ProductStatus.OUT_OF_STOCK) {
                product.setStatus(Constant.ProductStatus.ACTIVE);
            }
        }

        // Cập nhật status nếu có
        if (updates.containsKey("status")) {
            String status = (String) updates.get("status");
            product.setStatus(Constant.ProductStatus.valueOf(status.toUpperCase()));
        }

        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    /**
     * Xóa sản phẩm (hard delete)
     */
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Không tìm thấy sản phẩm với ID: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Xóa mềm - chuyển status sang INACTIVE
     */
    @Transactional
    public ProductResponse softDeleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        product.setStatus(Constant.ProductStatus.INACTIVE);
        Product updatedProduct = productRepository.save(product);
        return convertToResponse(updatedProduct);
    }

    // Convert Entity to Response DTO
    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantity(product.getQuantity());
        response.setCategoryId(product.getCategory().getId());
        response.setCategoryName(product.getCategory().getName());
        response.setProductType(product.getProductType());
        response.setImageUrl(product.getImageUrl());
        response.setStatus(product.getStatus().name());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    // Convert DTO to Entity
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setProductType(dto.getProductType());
        product.setImageUrl(dto.getImageUrl());

        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            product.setStatus(Constant.ProductStatus.valueOf(dto.getStatus().toUpperCase()));
        } else {
            product.setStatus(Constant.ProductStatus.ACTIVE);
        }

        return product;
    }
}