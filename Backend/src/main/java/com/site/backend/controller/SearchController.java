package com.site.backend.controller;

import com.site.backend.dto.ProductDTO;
import com.site.backend.model.Store;
import com.site.backend.repository.ProductRepository;
import com.site.backend.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:4200")
public class SearchController {

    @Autowired private ProductRepository productRepository;
    @Autowired private StoreRepository storeRepository;

    @GetMapping
    public Map<String, Object> search(@RequestParam String q) {
        Map<String, Object> results = new HashMap<>();

        if (q == null || q.trim().length() < 2) {
            results.put("products", List.of());
            results.put("stores", List.of());
            return results;
        }

        List<ProductDTO> products = productRepository
                .findByNameContainingIgnoreCase(q.trim())
                .stream()
                .limit(6)
                .map(p -> new ProductDTO(p.getId(), p.getStoreId(), p.getCategoryId(), p.getName(), p.getUnitPrice(), p.getStock()))
                .collect(Collectors.toList());

        List<Map<String, Object>> stores = storeRepository
                .findByNameContainingIgnoreCase(q.trim())
                .stream()
                .limit(4)
                .map(s -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("id", s.getId());
                    entry.put("name", s.getName());
                    entry.put("status", s.getStatus());
                    return entry;
                })
                .collect(Collectors.toList());

        results.put("products", products);
        results.put("stores", stores);
        return results;
    }
}
