package com.tuyenshop.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        String publicId = UUID.randomUUID().toString();
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", publicId
        ));
        return uploadResult.get("url").toString();
    }
    
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public void deleteImageByUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return;
        }
        try {
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex != -1) {
                String afterUpload = imageUrl.substring(uploadIndex + 8);
                int versionSlashIndex = afterUpload.indexOf("/");
                if (versionSlashIndex != -1 && afterUpload.startsWith("v")) {
                    afterUpload = afterUpload.substring(versionSlashIndex + 1);
                }
                String publicId = afterUpload;
                if (afterUpload.lastIndexOf(".") != -1) {
                    publicId = afterUpload.substring(0, afterUpload.lastIndexOf("."));
                }
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            System.err.println("Failed to delete image: " + e.getMessage());
        }
    }
}
