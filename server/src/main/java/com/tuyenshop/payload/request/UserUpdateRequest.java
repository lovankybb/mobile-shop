package com.tuyenshop.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    @Size(max = 50)
    @Email
    private String email;

    @Size(max = 20)
    private String phone;

    private String address;

    private String avatarUrl;
}
