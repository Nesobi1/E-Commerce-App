package com.site.backend.controller;

import com.site.backend.model.Order;
import com.site.backend.model.OrderItem;
import com.site.backend.model.Review;
import com.site.backend.repository.OrderItemRepository;
import com.site.backend.repository.OrderRepository;
import com.site.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product-detail")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductDetailController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/{productId}/reviews")
    public Map<String, Object> getReviewSummary(@PathVariable int productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);

        Map<Integer, Long> ratingBreakdown = reviews.stream()
                .collect(Collectors.groupingBy(Review::getStarRating, Collectors.counting()));

        Map<String, Long> sentimentBreakdown = reviews.stream()
                .collect(Collectors.groupingBy(Review::getSentiment, Collectors.counting()));

        double avgRating = reviews.stream()
                .mapToInt(Review::getStarRating)
                .average()
                .orElse(0.0);

        Map<String, Object> result = new HashMap<>();
        result.put("totalReviews",       reviews.size());
        result.put("averageRating",      Math.round(avgRating * 10.0) / 10.0);
        result.put("ratingBreakdown",    ratingBreakdown);
        result.put("sentimentBreakdown", sentimentBreakdown);
        return result;
    }

    @GetMapping("/{productId}/revenue")
    public List<Map<String, Object>> getMonthlyRevenue(@PathVariable int productId) {
        List<OrderItem> items = orderItemRepository.findByProductId(productId);

        List<Integer> orderIds = items.stream()
                .map(OrderItem::getOrderId)
                .distinct()
                .collect(Collectors.toList());

        Map<Integer, String> orderDateMap = new HashMap<>();
        for (int orderId : orderIds) {
            orderRepository.findById(orderId).ifPresent(order -> {
                String monthKey = order.getOrderDate().getYear() + "-"
                        + String.format("%02d", order.getOrderDate().getMonthValue());
                orderDateMap.put(orderId, monthKey);
            });
        }

        Map<String, Double> revenueByMonth = new TreeMap<>();
        for (OrderItem item : items) {
            String month = orderDateMap.get(item.getOrderId());
            if (month != null) {
                double revenue = item.getPrice() * item.getQuantity();
                revenueByMonth.merge(month, revenue, Double::sum);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        revenueByMonth.forEach((month, revenue) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", month);
            entry.put("revenue", Math.round(revenue * 100.0) / 100.0);
            result.add(entry);
        });

        return result;
    }
}
