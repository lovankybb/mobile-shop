package com.tuyenshop.repository;

import com.tuyenshop.model.ProductVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductVersionRepository extends JpaRepository<ProductVersion, Long> {
    Optional<ProductVersion> findByName(String name);
    boolean existsByName(String name);
}
