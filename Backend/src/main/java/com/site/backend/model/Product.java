package com.site.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int id;
    @Column(name = "store_id")
    private int storeId;
    @Column(name = "category_id")
    private int categoryId;
    private int sku;
    private String name;
    @Column(name = "unit_price")
    private double unitPrice;

    public Product(){

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
    public int getSku(){
        return sku;
    }
    public String getName(){
        return name;
    }
    public double getUnitPrice(){
        return unitPrice;
    }


    public void setId(int id){
        this.id = id;
    }
    public void setStoreId(int storeId){
        this.storeId = storeId;
    }
    public void setCategoryId(int categoryId){
        this.categoryId = categoryId;
    }
    public void setSku(int sku){
        this.sku = sku;
    }
    public void setName(String name){
        this.name = name;
    }
    public void setUnitPrice(double unitPrice){
        this.unitPrice = unitPrice;
    }
}
