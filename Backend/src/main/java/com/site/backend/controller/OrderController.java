package com.site.backend.controller;

import com.site.backend.model.Order;
import com.site.backend.model.OrderItem;
import com.site.backend.repository.OrderRepository;
import com.site.backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> body) {
        try {
            int userId = (int) body.get("userId");
            int storeId = (int) body.get("storeId");
            double grandTotal = ((Number) body.get("grandTotal")).doubleValue();
            String paymentMethod = (String) body.get("paymentMethod");

            Order order = new Order();
            order.setUserId(userId);
            order.setStoreId(storeId);
            order.setGrandTotal(grandTotal);
            order.setStatus("PENDING");
            order.setOrderDate(LocalDate.now());
            order.setPaymentMethod(paymentMethod);
            Order saved = orderRepository.save(order);

            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) body.get("items");
            for (Map<String, Object> itemData : itemsData) {
                OrderItem item = new OrderItem();
                item.setOrderId(saved.getId());
                item.setProductId((int) itemData.get("productId"));
                item.setQuantity((int) itemData.get("quantity"));
                item.setPrice(((Number) itemData.get("price")).doubleValue());
                orderItemRepository.save(item);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", saved.getId());
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
