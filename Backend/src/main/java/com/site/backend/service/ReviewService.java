package com.site.backend.service;

import com.site.backend.dto.ReviewDTO;
import com.site.backend.dto.ReviewRequest;
import com.site.backend.model.Product;
import com.site.backend.model.Review;
import com.site.backend.model.User;
import com.site.backend.repository.ProductRepository;
import com.site.backend.repository.ReviewRepository;
import com.site.backend.repository.StoreRepository;
import com.site.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         UserRepository userRepository,
                         ProductRepository productRepository,
                         StoreRepository storeRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
    }

    private ReviewDTO toDTO(Review r) {
        return new ReviewDTO(
                r.getId(),
                r.getUser().getEmail(),
                r.getStarRating(),
                r.getSentiment(),
                r.getTitle(),
                r.getText(),
                r.getResponse(),
                r.getProduct().getName()
        );
    }

    public List<ReviewDTO> getByProduct(int productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ReviewDTO> getByStore(int storeId) {
        return reviewRepository.findByStoreId(storeId).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public ReviewDTO submitResponse(int reviewId, String response) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found: " + reviewId));
        review.setResponse(response);
        return toDTO(reviewRepository.save(review));
    }

    public ReviewDTO submit(int productId, String email, ReviewRequest req) {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found: " + email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        String sentiment = req.getStarRating() >= 4 ? "positive"
                : req.getStarRating() == 3 ? "neutral"
                : "negative";

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setStarRating(req.getStarRating());
        review.setTitle(req.getTitle());
        review.setText(req.getText());
        review.setSentiment(sentiment);

        return toDTO(reviewRepository.save(review));
    }
}
