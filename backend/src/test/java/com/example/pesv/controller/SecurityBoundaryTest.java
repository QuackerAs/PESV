package com.example.pesv.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityBoundaryTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rejectsAnonymousRouteRequests() throws Exception {
        mockMvc.perform(get("/api/users/1/active-route"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsUserAccessToAnotherUsersRoute() throws Exception {
        mockMvc.perform(get("/api/users/2/active-route").header(HttpHeaders.AUTHORIZATION, basic("user", "user")))
                .andExpect(status().isForbidden());
    }

    @Test
    void returnsThePersistedAdminIdentity() throws Exception {
        mockMvc.perform(get("/api/auth/me").header(HttpHeaders.AUTHORIZATION, basic("admin", "admin")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.role").value("administrador"));
    }

    private String basic(String username, String password) {
        String value = username + ":" + password;
        return "Basic " + Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }
}
