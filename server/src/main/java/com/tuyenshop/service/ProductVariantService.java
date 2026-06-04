package com.tuyenshop.service;

import com.tuyenshop.exception.AppException;
import com.tuyenshop.exception.ErrorCode;
import com.tuyenshop.model.Product;
import com.tuyenshop.model.ProductVariant;
import com.tuyenshop.payload.response.ProductVariantResponse;
import com.tuyenshop.mapper.ProductVariantMapper;
import java.util.stream.Collectors;
import com.tuyenshop.payload.request.ProductVariantRequest;
import com.tuyenshop.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductVariantService {

    @Autowired
    private com.tuyenshop.repository.ProductRepository productRepository;

    @Autowired
    private com.tuyenshop.repository.ColorRepository colorRepository;

    @Autowired
    private com.tuyenshop.repository.ProductVersionRepository versionRepository;


    @org.springframework.beans.factory.annotation.Autowired
    private ProductVariantMapper productvariantMapper;
    @Autowired
    private ProductVariantRepository variantRepository;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ColorService colorService;
    
    @Autowired
    private ProductVersionService versionService;

    public List<ProductVariantResponse> getVariantsByProductId(Long productId) {
        return variantRepository.findByProductId(productId).stream().map(productvariantMapper::toResponse).collect(Collectors.toList());
    }

    public ProductVariantResponse getVariantById(Long id) {
        return productvariantMapper.toResponse(variantRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND)));
    }

    public ProductVariantResponse createVariant(ProductVariantRequest request) {
        ProductVariant variant = new ProductVariant();
        updateVariantFromRequest(variant, request);
        return productvariantMapper.toResponse(variantRepository.save(variant));
    }

    public ProductVariantResponse updateVariant(Long id, ProductVariantRequest request) {
        ProductVariant variant = variantRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        updateVariantFromRequest(variant, request);
        return productvariantMapper.toResponse(variantRepository.save(variant));
    }

    public void deleteVariant(Long id) {
        ProductVariant variant = variantRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        variantRepository.delete(variant);
    }

    private void updateVariantFromRequest(ProductVariant variant, ProductVariantRequest request) {
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        variant.setProduct(product);
        variant.setPrice(request.getPrice());
        variant.setStock(request.getStock());

        if (request.getColorId() != null) {
            variant.setColor(colorRepository.findById(request.getColorId()).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND)));
        } else {
            variant.setColor(null);
        }

        if (request.getVersionId() != null) {
            variant.setVersion(versionRepository.findById(request.getVersionId()).orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND)));
        } else {
            variant.setVersion(null);
        }
    }
}
