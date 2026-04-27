package com.site.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "star_rating", nullable = false)
    private int starRating;

    @Column(name = "sentiment", nullable = false)
    private String sentiment;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "text", nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(name = "response", columnDefinition = "TEXT")
    private String response;

    public Review() {}

    public int getId() { return id; }
    public User getUser() { return user; }
    public Product getProduct() { return product; }
    public int getStarRating() { return starRating; }
    public String getSentiment() { return sentiment; }
    public String getTitle() { return title; }
    public String getText() { return text; }
    public String getResponse() { return response; }

    public void setId(int id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setProduct(Product product) { this.product = product; }
    public void setStarRating(int starRating) { this.starRating = starRating; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
    public void setTitle(String title) { this.title = title; }
    public void setText(String text) { this.text = text; }
    public void setResponse(String response) { this.response = response; }
}
