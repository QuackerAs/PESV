package com.example.pesv.controller;

import org.springframework.security.core.Authentication;
import com.example.pesv.model.User;
import com.example.pesv.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        Map<String, Object> map = new HashMap<>();
        if (authentication == null) {
            return Map.of();
        }
        User user = userRepository.findByEmail(authentication.getName() + "@example.com")
                .orElseThrow(() -> new IllegalStateException("Demo user not found"));
        map.put("id", user.getId());
        map.put("nombre", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole().equals("ROLE_ADMIN") ? "administrador" : "usuario");
        map.put("isCommitteeMember", false);
        return map;
    }
}
