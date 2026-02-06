package com.example.HomeShop.service;

import com.example.HomeShop.constant.MessageKeys;
import com.example.HomeShop.dto.ApiResponse;
import com.example.HomeShop.dto.CategoryDTO;
import com.example.HomeShop.entity.Category;
import com.example.HomeShop.exception.Category.CategoryNotFoundException;
import com.example.HomeShop.exception.Utils.DuplicateResourceException;
import com.example.HomeShop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final MessageService messageService;

    // Lấy tất cả danh mục
    public ApiResponse<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        ApiResponse<List<CategoryDTO>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage(messageService.getMessage(MessageKeys.SUCCESS_CATEGORY_GET_ALL));
        response.setData(categories);
        return response;
    }

    // Lấy danh mục theo ID
    public ApiResponse<CategoryDTO> getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Không tìm thấy danh mục với ID: " + id));

        ApiResponse<CategoryDTO> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage(messageService.getMessage(MessageKeys.SUCCESS_CATEGORY_GET_BY_ID));
        response.setData(convertToDTO(category));
        return response;
    }

    // Tạo danh mục mới
    @Transactional
    public ApiResponse<CategoryDTO> createCategory(CategoryDTO categoryDTO) {
        // Kiểm tra trùng tên
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new DuplicateResourceException("Danh mục với tên '" + categoryDTO.getName() + "' đã tồn tại");
        }

        Category category = convertToEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);

        ApiResponse<CategoryDTO> response = new ApiResponse<>();
        response.setCode(201);
        response.setMessage(messageService.getMessage(MessageKeys.SUCCESS_CATEGORY_CREATED));
        response.setData(convertToDTO(savedCategory));
        return response;
    }

    // Cập nhật danh mục
    @Transactional
    public ApiResponse<CategoryDTO> updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Không tìm thấy danh mục với ID: " + id));

        // Kiểm tra trùng tên với danh mục khác
        if (!existingCategory.getName().equals(categoryDTO.getName())
                && categoryRepository.existsByName(categoryDTO.getName())) {
            throw new DuplicateResourceException("Danh mục với tên '" + categoryDTO.getName() + "' đã tồn tại");
        }

        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());

        Category updatedCategory = categoryRepository.save(existingCategory);

        ApiResponse<CategoryDTO> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage(messageService.getMessage(MessageKeys.SUCCESS_CATEGORY_UPDATED));
        response.setData(convertToDTO(updatedCategory));
        return response;
    }

    // Xóa danh mục
    @Transactional
    public ApiResponse<String> deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException("Không tìm thấy danh mục với ID: " + id);
        }
        categoryRepository.deleteById(id);

        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage(messageService.getMessage(MessageKeys.SUCCESS_CATEGORY_DELETED));
        return response;
    }

    // Convert Entity to DTO
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }

    // Convert DTO to Entity
    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return category;
    }
}
