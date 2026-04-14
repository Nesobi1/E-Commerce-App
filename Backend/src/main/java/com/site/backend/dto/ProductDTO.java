package com.site.backend.dto;

public class ProductDTO {
    private int id;
    private int storeId;
    private int categoryId;
    private String name;
    private double unitPrice;

    public ProductDTO(int id, int storeId, int categoryId, String name, double unitPrice){
        this.id = id;
        this.storeId = storeId;
        this.categoryId = categoryId;
        this.name = name;
        this.unitPrice = unitPrice;
    }

    public int getId(){
        return id;
    }
    public int getStoreId(){
        return storeId;
    }
    public int getCategoryId(){
        return categoryId;
    }
    public String getName(){
        return name;
    }
    public double getUnitPrice(){
        return unitPrice;
    }
}
