package com.site.backend.repository;

import com.site.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProductId(int productId);

    @Query("SELECT r FROM Review r WHERE r.product.storeId = :storeId")
    List<Review> findByStoreId(@Param("storeId") int storeId);

    List<Review> findAll();
}
