package com.site.backend.controller;

import com.site.backend.repository.CategoryRepository;
import com.site.backend.model.Category;
import java.util.ArrayList;
import java.util.Map;
import com.site.backend.dto.ProductDTO;
import com.site.backend.model.Product;
import com.site.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200", methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.PATCH,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
})
public class ProductController {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;

    private ProductDTO toDTO(Product p) {
        return new ProductDTO(p.getId(), p.getStoreId(), p.getCategoryId(),
                p.getName(), p.getUnitPrice(), p.getStock());
    }

    @GetMapping
    public List<ProductDTO> getAllProduct() {
        return productRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody Product updated) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setUnitPrice(updated.getUnitPrice());
            existing.setCategoryId(updated.getCategoryId());
            return ResponseEntity.ok(productRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable int id,
            @RequestBody Map<String, Integer> request) {
        return productRepository.findById(id).map(existing -> {
            existing.setStock(request.get("stock"));
            return ResponseEntity.ok(toDTO(productRepository.save(existing)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/store/{storeId}")
    public List<ProductDTO> getProductsByStore(@PathVariable int storeId) {
        return productRepository.findByStoreId(storeId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductDTO> getProductsByCategory(@PathVariable int categoryId) {
        return productRepository.findByCategoryId(categoryId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable int id) {
        return productRepository.findById(id).map(this::toDTO).orElseThrow();
    }

    @GetMapping("/store/{storeId}/category/{categoryId}")
    public List<ProductDTO> getProductsByStoreAndCategory(
            @PathVariable int storeId, @PathVariable int categoryId) {
        return productRepository.findByStoreIdAndCategoryId(storeId, categoryId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/category/{categoryId}/all")
    public List<ProductDTO> getProductsByCategoryIncludingChildren(@PathVariable int categoryId) {
        List<Integer> categoryIds = new ArrayList<>();
        categoryIds.add(categoryId);
        List<Category> allCategories = categoryRepository.findAll();
        addChildIds(categoryIds, categoryId, allCategories);
        return productRepository.findByCategoryIdIn(categoryIds)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void addChildIds(List<Integer> ids, int parentId, List<Category> all) {
        all.stream()
                .filter(c -> c.getParentId() != null && c.getParentId() == parentId)
                .forEach(c -> {
                    ids.add(c.getId());
                    addChildIds(ids, c.getId(), all);
                });
    }
}
