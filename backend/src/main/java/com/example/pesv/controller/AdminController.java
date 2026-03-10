package com.example.pesv.controller;

import com.example.pesv.model.Route;
import com.example.pesv.model.User;
import com.example.pesv.repository.UserRepository;
import com.example.pesv.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteService routeService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> listUsers() { return userRepository.findAll(); }

    @GetMapping("/users/{userId}/routes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Route>> listUserRoutes(@PathVariable Long userId) {
        List<Route> routes = routeService.listByUser(userId);
        return ResponseEntity.ok(routes);
    }

    @PostMapping("/users/{userId}/routes/{routeId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignRouteToUser(@PathVariable Long userId, @PathVariable Long routeId) {
        List<Route> routes = routeService.listByUser(userId);
        Route toAssign = routes.stream().filter(r -> r.getId().equals(routeId)).findFirst().orElse(null);
        if (toAssign == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Route not found for user"));
        }
        // desasignar las demás rutas
        for (Route r : routes) {
            if (r.getId().equals(routeId)) r.setAssigned(true); else r.setAssigned(false);
        }
        routeService.saveAll(routes);
        return ResponseEntity.ok(Map.of("status", "assigned", "routeId", routeId));
    }
}
