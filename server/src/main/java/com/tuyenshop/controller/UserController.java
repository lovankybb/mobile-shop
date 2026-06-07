package com.tuyenshop.controller;

import com.tuyenshop.payload.request.ChangePasswordRequest;
import com.tuyenshop.payload.request.UserUpdateRequest;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.payload.response.UserResponse;
import com.tuyenshop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.success(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.success(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ApiResponse<String> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest updateRequest) {
        userService.updateUser(id, updateRequest);
        return ApiResponse.success("User updated successfully!");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.success("User deleted successfully!");
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ApiResponse<String> changePassword(@PathVariable Long id, @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ApiResponse.success("Password changed successfully!");
    }

    @PostMapping("/{id}/avatar")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ApiResponse<String> uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(id, file);
        return ApiResponse.success("Avatar updated successfully!", avatarUrl);
    }
}
