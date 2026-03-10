package com.example.pesv.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        Map<String, Object> map = new HashMap<>();
        if (authentication == null) {
            return Map.of();
        }
        String username = authentication.getName();
        String role = "usuario";
        for (GrantedAuthority a : authentication.getAuthorities()) {
            if (a.getAuthority().contains("ADMIN")) {
                role = "administrador";
            }
        }
        map.put("id", username.equals("admin") ? 1 : 2);
        map.put("nombre", username.equals("admin") ? "Admin Demo" : "Usuario Demo");
        map.put("email", username + "@pesv.co");
        map.put("role", role);
        map.put("isCommitteeMember", false);
        return map;
    }
}
