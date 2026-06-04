package com.tuyenshop.service;

import com.tuyenshop.exception.AppException;
import com.tuyenshop.exception.ErrorCode;
import com.tuyenshop.mapper.ReviewMapper;
import com.tuyenshop.model.Product;
import com.tuyenshop.model.Review;
import com.tuyenshop.model.User;
import com.tuyenshop.payload.request.ReviewRequest;
import com.tuyenshop.payload.response.ReviewResponse;
import com.tuyenshop.repository.OrderDetailRepository;
import com.tuyenshop.repository.ProductRepository;
import com.tuyenshop.repository.ReviewRepository;
import com.tuyenshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ReviewMapper reviewMapper;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable).map(reviewMapper::toResponse);
    }

    public ReviewResponse postReview(ReviewRequest request) {
        User user = getCurrentUser();
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!orderDetailRepository.existsByUserIdAndProductIdAndDelivered(user.getId(), product.getId())) {
            throw new AppException(ErrorCode.NOT_BOUGHT_PRODUCT);
        }
        
        Optional<Review> existingReview = reviewRepository.findByUserIdAndProductId(user.getId(), product.getId());
        if (existingReview.isPresent()) {
            throw new AppException(ErrorCode.REVIEW_EXISTED);
        }

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return reviewMapper.toResponse(reviewRepository.save(review));
    }
}
