package com.site.backend.repository;

import com.site.backend.model.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Integer> {
    Optional<CustomerProfile> findByUserId(int userId);
}
