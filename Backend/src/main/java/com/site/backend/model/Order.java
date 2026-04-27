package com.site.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "store_id")
    private int storeId;

    private String status;

    @Column(name = "grand_total")
    private double grandTotal;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "payment_method")
    private String paymentMethod;

    public Order() {}

    public int getId() { return id; }
    public int getUserId() { return userId; }
    public int getStoreId() { return storeId; }
    public String getStatus() { return status; }
    public double getGrandTotal() { return grandTotal; }
    public LocalDate getOrderDate() { return orderDate; }
    public String getPaymentMethod() { return paymentMethod; }

    public void setId(int id) { this.id = id; }
    public void setUserId(int userId) { this.userId = userId; }
    public void setStoreId(int storeId) { this.storeId = storeId; }
    public void setStatus(String status) { this.status = status; }
    public void setGrandTotal(double grandTotal) { this.grandTotal = grandTotal; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
