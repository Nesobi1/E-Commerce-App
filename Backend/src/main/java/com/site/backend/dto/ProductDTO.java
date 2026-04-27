package com.site.backend.dto;

public class ProductDTO {
    private int id;
    private int storeId;
    private int categoryId;
    private String name;
    private double unitPrice;
    private int stock;

    public ProductDTO() {}

    public ProductDTO(int id, int storeId, int categoryId, String name, double unitPrice, int stock) {
        this.id = id;
        this.storeId = storeId;
        this.categoryId = categoryId;
        this.name = name;
        this.unitPrice = unitPrice;
        this.stock = stock;
    }

    public int getId() { return id; }
    public int getStoreId() { return storeId; }
    public int getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public double getUnitPrice() { return unitPrice; }
    public int getStock() { return stock; }

    public void setId(int id) { this.id = id; }
    public void setStoreId(int storeId) { this.storeId = storeId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }
    public void setName(String name) { this.name = name; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public void setStock(int stock) { this.stock = stock; }
}