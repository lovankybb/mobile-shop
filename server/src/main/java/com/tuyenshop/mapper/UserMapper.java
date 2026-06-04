package com.tuyenshop.mapper;
import com.tuyenshop.model.Role;
import com.tuyenshop.model.User;
import com.tuyenshop.payload.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    
    default String roleToString(Role role) {
        return role != null ? role.getName() : null;
    }
}