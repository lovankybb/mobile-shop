package com.tuyenshop.service;

import com.tuyenshop.exception.AppException;
import com.tuyenshop.exception.ErrorCode;
import com.tuyenshop.model.ProductVersion;
import com.tuyenshop.payload.response.ProductVersionResponse;
import com.tuyenshop.mapper.ProductVersionMapper;
import java.util.stream.Collectors;
import com.tuyenshop.repository.ProductVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductVersionService {

    @org.springframework.beans.factory.annotation.Autowired
    private ProductVersionMapper productversionMapper;
    @Autowired
    private ProductVersionRepository versionRepository;

    public List<ProductVersionResponse> getAllVersions() {
        return versionRepository.findAll().stream().map(productversionMapper::toResponse).collect(Collectors.toList());
    }

    public ProductVersionResponse getVersionById(Long id) {
        return productversionMapper.toResponse(versionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND)));
    }

    public ProductVersionResponse createVersion(ProductVersion version) {
        return productversionMapper.toResponse(versionRepository.save(version));
    }

    public ProductVersionResponse updateVersion(Long id, ProductVersion versionDetails) {
        ProductVersion version = versionRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND));
        version.setName(versionDetails.getName());
        return productversionMapper.toResponse(versionRepository.save(version));
    }

    public void deleteVersion(Long id) {
        ProductVersion version = versionRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND));
        versionRepository.delete(version);
    }
}
