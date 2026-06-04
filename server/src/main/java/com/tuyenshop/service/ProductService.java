package com.tuyenshop.service;

import com.tuyenshop.exception.AppException;
import com.tuyenshop.exception.ErrorCode;
import com.tuyenshop.model.Brand;
import com.tuyenshop.model.Category;
import com.tuyenshop.model.Product;
import com.tuyenshop.model.ProductImage;
import com.tuyenshop.payload.request.ProductCreationRequest;
import com.tuyenshop.payload.response.ProductResponse;
import com.tuyenshop.payload.response.ProductDetailResponse;
import com.tuyenshop.mapper.ProductMapper;
import com.tuyenshop.repository.BrandRepository;
import com.tuyenshop.repository.CategoryRepository;
import com.tuyenshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private com.tuyenshop.repository.ReviewRepository reviewRepository;

    @Autowired
    private BrandService brandService;

    @Autowired
    private CategoryService categoryService;

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToProductResponse);
    }

    public Page<ProductResponse> getProductsByFilter(String keyword, Long categoryId, Long brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }
            if (brandId != null) {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("id"), brandId));
            }
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return productRepository.findAll(spec, pageable).map(this::mapToProductResponse);
    }

    public ProductResponse getProductById(Long id) {
        return mapToProductResponse(productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
    }

    public ProductResponse getProductBySlug(String slug) {
        return mapToProductResponse(productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
    }

    public ProductResponse createProduct(ProductCreationRequest request) {
        Product product = new Product();
        updateProductFromRequest(product, request);
        return mapToProductResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductCreationRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        updateProductFromRequest(product, request);
        return mapToProductResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        productRepository.delete(product);
    }

    private void updateProductFromRequest(Product product, ProductCreationRequest request) {
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice() != null ? request.getSalePrice() : request.getPrice());
        product.setDescription(request.getDescription());
        product.setStatus(request.getStatus());
        product.setSlug(request.getSlug());

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId()).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
            product.setBrand(brand);
        } else {
            product.setBrand(null);
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }
    }

    private ProductResponse mapToProductResponse(Product product) {

        ProductResponse productResponse = productMapper.toResponse(product);
        // map main images if needed
        if (!product.getImages().isEmpty()) {
            productResponse.setImage(product.getImages().getFirst().getUrl());
        }
        return productResponse;

    }

    public ProductDetailResponse getProductDetailById(Long id) {
        return mapToProductDetailResponse(productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
    }

    public ProductDetailResponse getProductDetailBySlug(String slug) {
        return mapToProductDetailResponse(productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
    }

    private ProductDetailResponse mapToProductDetailResponse(Product product) {
        ProductDetailResponse response = productMapper.toDetailResponse(product);
        
        response.setImages(product.getImages().stream().map(ProductImage::getUrl).collect(Collectors.toSet()));
        
        List<com.tuyenshop.payload.response.ProductVariantSimpleResponse> variantResponses = product.getVariants().stream()
                .map(productMapper::toVariantSimpleResponse)
                .collect(Collectors.toList());
        response.setVariants(variantResponses);
        
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId());
        response.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        response.setReviewCount(reviewRepository.countByProductId(product.getId()));
        
        return response;
    }
}
