package com.site.backend.repository;

import com.site.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByStoreId(int storeId);
    List<Order> findByUserId(int userId);
}
