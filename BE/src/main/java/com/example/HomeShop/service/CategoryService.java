package com.example.HomeShop.service;

import com.example.HomeShop.dto.CategoryDTO;
import com.example.HomeShop.entity.Category;
import com.example.HomeShop.entity.User;
import com.example.HomeShop.exception.AppException;
import com.example.HomeShop.exception.CategoryErrorCode;
import com.example.HomeShop.exception.ErrorCode;
import com.example.HomeShop.exception.UserErrorCode;
import com.example.HomeShop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category CreateCategory(CategoryDTO categoryDTO){
        if(categoryRepository.existsByName(categoryDTO.getName())){
            throw new AppException(CategoryErrorCode.CATEGORY_NAME_EXISTED);
        }
        Category category = Category.builder()
                .name(categoryDTO.getName())
                .level(categoryDTO.getLevel())
                .slug(categoryDTO.getSlug())
                .status(categoryDTO.getStatus())
                .imageUrl(categoryDTO.getImageUrl())
                .build();
        return categoryRepository.save(category);
    }
}
