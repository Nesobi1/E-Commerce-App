package com.site.backend.controller;

import com.site.backend.model.Order;
import com.site.backend.model.OrderItem;
import com.site.backend.repository.OrderRepository;
import com.site.backend.repository.StoreRepository;
import com.site.backend.repository.OrderItemRepository;
import com.site.backend.repository.ProductRepository;
import com.site.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:4200")
public class AnalyticsController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private StoreRepository storeRepository;

    @GetMapping("/total-stats")
    public Map<String, Object> getTotalStats() {
        List<Order> orders = orderRepository.findAll();
        double totalRevenue = orders.stream().mapToDouble(Order::getGrandTotal).sum();
        long totalOrders = orders.size();
        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> "CUSTOMER".equals(u.getRoleType())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        stats.put("totalOrders", totalOrders);
        stats.put("totalCustomers", totalCustomers);
        return stats;
    }

    @GetMapping("/revenue-by-store")
    public List<Map<String, Object>> getRevenueByStore() {
        List<Order> orders = orderRepository.findAll();
        Map<Integer, Double> revenueMap = new TreeMap<>();
        for (Order o : orders) {
            revenueMap.merge(o.getStoreId(), o.getGrandTotal(), Double::sum);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        revenueMap.forEach((storeId, revenue) -> {
            Map<String, Object> entry = new HashMap<>();
            String storeName = storeRepository.findById(storeId)
                    .map(s -> s.getName())
                    .orElse("Store " + storeId);
            entry.put("storeName", storeName);
            entry.put("revenue", Math.round(revenue * 100.0) / 100.0);
            result.add(entry);
        });
        return result;
    }

    @GetMapping("/orders-by-day")
    public List<Map<String, Object>> getOrdersByDay() {
        List<Order> orders = orderRepository.findAll();
        Map<String, Long> countMap = new TreeMap<>();
        for (Order o : orders) {
            if (o.getOrderDate() != null) {
                String day = o.getOrderDate().toString();
                countMap.merge(day, 1L, Long::sum);
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        countMap.forEach((day, count) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", day);
            entry.put("orders", count);
            result.add(entry);
        });
        return result;
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts() {
        List<OrderItem> items = orderItemRepository.findAll();
        Map<Integer, Integer> quantityMap = new HashMap<>();
        for (OrderItem item : items) {
            quantityMap.merge(item.getProductId(), item.getQuantity(), Integer::sum);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        quantityMap.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> productRepository.findById(e.getKey()).ifPresent(p -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("productName", p.getName());
                    entry.put("quantity", e.getValue());
                    result.add(entry);
                }));
        return result;
    }

    @GetMapping("/revenue-by-month")
    public List<Map<String, Object>> getRevenueByMonth() {
        List<Order> orders = orderRepository.findAll();
        Map<String, Double> revenueMap = new TreeMap<>();
        for (Order o : orders) {
            if (o.getOrderDate() != null) {
                String month = o.getOrderDate().getYear() + "-"
                        + String.format("%02d", o.getOrderDate().getMonthValue());
                revenueMap.merge(month, o.getGrandTotal(), Double::sum);
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        revenueMap.forEach((month, revenue) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", month);
            entry.put("revenue", Math.round(revenue * 100.0) / 100.0);
            result.add(entry);
        });
        return result;
    }

    @GetMapping("/store/{storeId}/total-stats")
    public Map<String, Object> getStoreStats(@PathVariable int storeId) {
        List<Order> orders = orderRepository.findByStoreId(storeId);
        double totalRevenue = orders.stream().mapToDouble(Order::getGrandTotal).sum();
        long totalOrders = orders.size();
        long totalCustomers = orders.stream().map(Order::getUserId).distinct().count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        stats.put("totalOrders", totalOrders);
        stats.put("totalCustomers", totalCustomers);
        return stats;
    }

    @GetMapping("/store/{storeId}/revenue-by-month")
    public List<Map<String, Object>> getStoreRevenueByMonth(@PathVariable int storeId) {
        List<Order> orders = orderRepository.findByStoreId(storeId);
        Map<String, Double> revenueMap = new TreeMap<>();
        for (Order o : orders) {
            if (o.getOrderDate() != null) {
                String month = o.getOrderDate().getYear() + "-"
                        + String.format("%02d", o.getOrderDate().getMonthValue());
                revenueMap.merge(month, o.getGrandTotal(), Double::sum);
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        revenueMap.forEach((month, revenue) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", month);
            entry.put("revenue", Math.round(revenue * 100.0) / 100.0);
            result.add(entry);
        });
        return result;
    }

    @GetMapping("/store/{storeId}/top-products")
    public List<Map<String, Object>> getStoreTopProducts(@PathVariable int storeId) {
        List<Order> storeOrders = orderRepository.findByStoreId(storeId);
        Set<Integer> orderIds = storeOrders.stream().map(Order::getId).collect(Collectors.toSet());
        List<OrderItem> items = orderItemRepository.findAll().stream()
                .filter(i -> orderIds.contains(i.getOrderId()))
                .collect(Collectors.toList());

        Map<Integer, Integer> quantityMap = new HashMap<>();
        for (OrderItem item : items) {
            quantityMap.merge(item.getProductId(), item.getQuantity(), Integer::sum);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        quantityMap.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> productRepository.findById(e.getKey()).ifPresent(p -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("productName", p.getName());
                    entry.put("quantity", e.getValue());
                    result.add(entry);
                }));
        return result;
    }

    @GetMapping("/store/{storeId}/orders-by-day")
    public List<Map<String, Object>> getStoreOrdersByDay(@PathVariable int storeId) {
        List<Order> orders = orderRepository.findByStoreId(storeId);
        Map<String, Long> countMap = new TreeMap<>();
        for (Order o : orders) {
            if (o.getOrderDate() != null) {
                String day = o.getOrderDate().toString();
                countMap.merge(day, 1L, Long::sum);
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        countMap.forEach((day, count) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", day);
            entry.put("orders", count);
            result.add(entry);
        });
        return result;
    }

    @GetMapping("/user/{userId}/total-stats")
    public Map<String, Object> getUserStats(@PathVariable int userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        double totalSpent = orders.stream().mapToDouble(Order::getGrandTotal).sum();
        long totalOrders = orders.size();
        long totalItems = orders.stream()
                .flatMap(o -> orderItemRepository.findAll().stream()
                        .filter(i -> i.getOrderId() == o.getId()))
                .mapToLong(i -> i.getQuantity())
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSpent", Math.round(totalSpent * 100.0) / 100.0);
        stats.put("totalOrders", totalOrders);
        stats.put("totalItems", totalItems);
        return stats;
    }

    @GetMapping("/user/{userId}/spending-by-month")
    public List<Map<String, Object>> getUserSpendingByMonth(@PathVariable int userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        Map<String, Double> spendingMap = new TreeMap<>();
        for (Order o : orders) {
            if (o.getOrderDate() != null) {
                String month = o.getOrderDate().getYear() + "-"
                        + String.format("%02d", o.getOrderDate().getMonthValue());
                spendingMap.merge(month, o.getGrandTotal(), Double::sum);
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        spendingMap.forEach((month, spent) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", month);
            entry.put("spent", Math.round(spent * 100.0) / 100.0);
            result.add(entry);
        });
        return result;
    }

    @GetMapping("/user/{userId}/top-products")
    public List<Map<String, Object>> getUserTopProducts(@PathVariable int userId) {
        List<Order> userOrders = orderRepository.findByUserId(userId);
        Set<Integer> orderIds = userOrders.stream().map(Order::getId).collect(Collectors.toSet());
        List<OrderItem> items = orderItemRepository.findAll().stream()
                .filter(i -> orderIds.contains(i.getOrderId()))
                .collect(Collectors.toList());

        Map<Integer, Integer> quantityMap = new HashMap<>();
        for (OrderItem item : items) {
            quantityMap.merge(item.getProductId(), item.getQuantity(), Integer::sum);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        quantityMap.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> productRepository.findById(e.getKey()).ifPresent(p -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("productName", p.getName());
                    entry.put("quantity", e.getValue());
                    result.add(entry);
                }));
        return result;
    }

    @GetMapping("/user/{userId}/spending-by-store")
    public List<Map<String, Object>> getUserSpendingByStore(@PathVariable int userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        Map<Integer, Double> storeMap = new TreeMap<>();
        for (Order o : orders) {
            storeMap.merge(o.getStoreId(), o.getGrandTotal(), Double::sum);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        storeMap.forEach((storeId, spent) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("storeId", storeId);
            entry.put("spent", Math.round(spent * 100.0) / 100.0);
            result.add(entry);
        });
        return result;
    }
    @GetMapping("/store/{storeId}/top-customers")
    public List<Map<String, Object>> getStoreTopCustomers(@PathVariable int storeId) {
        List<Order> storeOrders = orderRepository.findByStoreId(storeId);
        Map<Integer, Double> spendingMap = new HashMap<>();
        for (Order o : storeOrders) {
            spendingMap.merge(o.getUserId(), o.getGrandTotal(), Double::sum);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        spendingMap.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> userRepository.findById(e.getKey()).ifPresent(u -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("username", u.getUsername());
                    entry.put("spent", Math.round(e.getValue() * 100.0) / 100.0);
                    result.add(entry);
                }));
        return result;
    }
    @GetMapping("/top-customers")
    public List<Map<String, Object>> getTopCustomers() {
        List<Order> orders = orderRepository.findAll();
        Map<Integer, Double> spendingMap = new HashMap<>();
        for (Order o : orders) {
            spendingMap.merge(o.getUserId(), o.getGrandTotal(), Double::sum);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        spendingMap.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(10)
                .forEach(e -> userRepository.findById(e.getKey()).ifPresent(u -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("username", u.getUsername());
                    entry.put("spent", Math.round(e.getValue() * 100.0) / 100.0);
                    result.add(entry);
                }));
        return result;
    }
    @GetMapping("/user/{userId}/order-history")
    public List<Map<String, Object>> getUserOrderHistory(@PathVariable int userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        orders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate).reversed())
                .forEach(o -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("orderId", o.getId());
                    entry.put("date", o.getOrderDate().toString());
                    entry.put("total", o.getGrandTotal());
                    entry.put("status", o.getStatus());
                    entry.put("paymentMethod", o.getPaymentMethod());
                    result.add(entry);
                });
        return result;
    }
}
