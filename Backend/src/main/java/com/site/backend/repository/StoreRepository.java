package com.site.backend.repository;

import com.site.backend.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Integer> {
    Optional<Store> findByOwnerId(int ownerId);
    List<Store> findByNameContainingIgnoreCase(String name); // ADD THIS
}
