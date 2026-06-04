package com.tuyenshop.config;

import com.tuyenshop.model.Permission;
import com.tuyenshop.model.Role;
import com.tuyenshop.model.User;
import com.tuyenshop.repository.PermissionRepository;
import com.tuyenshop.repository.RoleRepository;
import com.tuyenshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Component
public class AppInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Init Permissions
        Permission readPerm = createPermissionIfNotFound("READ_PRIVILEGES");
        Permission writePerm = createPermissionIfNotFound("WRITE_PRIVILEGES");

        // Init Roles
        Set<Permission> adminPermissions = new HashSet<>();
        adminPermissions.add(readPerm);
        adminPermissions.add(writePerm);

        Set<Permission> userPermissions = new HashSet<>();
        userPermissions.add(readPerm);

        Role adminRole = createRoleIfNotFound("ROLE_ADMIN", adminPermissions);
        Role userRole = createRoleIfNotFound("ROLE_USER", userPermissions);

        // Init Admin User
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@tuyenshop.com");
            
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Admin user initialized with username 'admin' and password 'admin123'");
        }
    }

    private Permission createPermissionIfNotFound(String name) {
        return permissionRepository.findByName(name)
                .orElseGet(() -> {
                    Permission perm = new Permission();
                    perm.setName(name);
                    perm.setDescription("Allows " + name);
                    return permissionRepository.save(perm);
                });
    }

    private Role createRoleIfNotFound(String name, Set<Permission> permissions) {
        return roleRepository.findByName(name)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(name);
                    role.setDescription(name + " role");
                    role.setPermissions(permissions);
                    return roleRepository.save(role);
                });
    }
}
