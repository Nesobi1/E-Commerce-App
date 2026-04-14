package com.site.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int id;
    private String name;
    @Column(name = "parent_id")
    private Integer  parentId;

    public Category(){

    }

    public int getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public Integer getParentId(){
        return parentId;
    }


    public void setId(int id){
        this.id = id;
    }
    public void setName(String name){
        this.name = name;
    }
    public void setParentId(Integer parentId){
        this.parentId = parentId;
    }
}
