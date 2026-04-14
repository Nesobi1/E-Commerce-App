package com.site.backend.controller;

import com.site.backend.model.Category;
import com.site.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import com.site.backend.dto.CategoryDTO;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<CategoryDTO> getAllCategory() {
        return categoryRepository.findAll()
                .stream()
                .map(Category -> new CategoryDTO(Category.getId(), Category.getName(), Category.getParentId()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable int id) {
        categoryRepository.deleteById(id);
    }
}
