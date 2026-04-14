package com.site.backend.controller;

import com.site.backend.dto.ProductDTO;
import com.site.backend.model.Product;
import com.site.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<ProductDTO> getAllProduct() {
        return productRepository.findAll()
                .stream()
                .map(Product -> new ProductDTO(Product.getId(), Product.getStoreId(), Product.getCategoryId(), Product.getName(), Product.getUnitPrice()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable int id) {
        productRepository.deleteById(id);
    }

    @GetMapping("/store/{storeId}")
    public List<ProductDTO> getProductsByStore(@PathVariable int storeId) {
        return productRepository.findByStoreId(storeId)
                .stream()
                .map(product -> new ProductDTO(product.getId(), product.getStoreId(), product.getCategoryId(), product.getName(), product.getUnitPrice()))
                .collect(Collectors.toList());
    }
    @GetMapping("/category/{categoryId}")
    public List<ProductDTO> getProductsByCategory(@PathVariable int categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(product -> new ProductDTO(product.getId(), product.getStoreId(), product.getCategoryId(), product.getName(), product.getUnitPrice()))
                .collect(Collectors.toList());
    }
    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable int id) {
        return productRepository.findById(id)
                .map(product -> new ProductDTO(product.getId(), product.getStoreId(), product.getCategoryId(), product.getName(), product.getUnitPrice()))
                .orElseThrow();
    }
}
