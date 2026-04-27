package com.site.backend.repository;

import java.util.*;
import com.site.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByStoreId(int storeId);
    List<Product> findByCategoryId(int categoryId);
    List<Product> findByStoreIdAndCategoryId(int storeId, int categoryId);
    List<Product> findByCategoryIdIn(List<Integer> categoryIds);
    List<Product> findByNameContainingIgnoreCase(String name); // ADD THIS
}
