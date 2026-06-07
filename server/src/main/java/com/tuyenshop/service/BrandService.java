package com.tuyenshop.service;

import com.tuyenshop.exception.AppException;
import com.tuyenshop.exception.ErrorCode;
import com.tuyenshop.model.Brand;
import com.tuyenshop.payload.response.BrandResponse;
import com.tuyenshop.mapper.BrandMapper;
import java.util.stream.Collectors;
import com.tuyenshop.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @org.springframework.beans.factory.annotation.Autowired
    private BrandMapper brandMapper;
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream().map(brandMapper::toResponse).collect(Collectors.toList());
    }
    
    public BrandResponse getBrandById(Long id) {
        return brandMapper.toResponse(brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND)));
    }
    
    public BrandResponse createBrand(Brand brand) {
        return brandMapper.toResponse(brandRepository.save(brand));
    }
    
    public BrandResponse updateBrand(Long id, Brand brandDetails) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        
        if (brand.getLogo() != null && !brand.getLogo().equals(brandDetails.getLogo())) {
            cloudinaryService.deleteImageByUrl(brand.getLogo());
        }
        
        brand.setName(brandDetails.getName());
        brand.setLogo(brandDetails.getLogo());
        brand.setDescription(brandDetails.getDescription());
        return brandMapper.toResponse(brandRepository.save(brand));
    }
    
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        if (brand.getLogo() != null) {
            cloudinaryService.deleteImageByUrl(brand.getLogo());
        }
        brandRepository.delete(brand);
    }
}
