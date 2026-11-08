package com.example.pesv.controller;

import com.example.pesv.model.Route;
import com.example.pesv.model.User;
import com.example.pesv.model.Emergency;
import com.example.pesv.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserRoutesController {

    @Autowired
    private RouteService routeService;

    @PostMapping("/{userId}/routes/calc")
    public ResponseEntity<?> calcRoute(@PathVariable Long userId, @RequestBody Map<String, Object> body, @RequestParam(defaultValue = "waze") String provider, Authentication authentication) throws Exception {
        requireOwnerOrAdmin(userId, authentication);
        double oLat = ((Number)body.get("originLat")).doubleValue();
        double oLng = ((Number)body.get("originLng")).doubleValue();
        double dLat = ((Number)body.get("destLat")).doubleValue();
        double dLng = ((Number)body.get("destLng")).doubleValue();
        Route r = routeService.calculateAndSave(userId, oLat, oLng, dLat, dLng, provider);
        return ResponseEntity.ok(r);
    }

    @GetMapping("/{userId}/active-route")
    public ResponseEntity<?> getActiveRoute(@PathVariable Long userId, Authentication authentication) {
        requireOwnerOrAdmin(userId, authentication);
        Route r = routeService.getActiveRouteForUser(userId);
        if (r == null) return ResponseEntity.ok(Map.of());
        return ResponseEntity.ok(r);
    }

    @PostMapping("/{userId}/telemetry")
    public ResponseEntity<?> postTelemetry(@PathVariable Long userId, @RequestBody Map<String, Object> body, Authentication authentication) {
        requireOwnerOrAdmin(userId, authentication);
        Double lat = body.get("lat") == null ? null : ((Number)body.get("lat")).doubleValue();
        Double lng = body.get("lng") == null ? null : ((Number)body.get("lng")).doubleValue();
        Double speed = body.get("speed") == null ? null : ((Number)body.get("speed")).doubleValue();
        Route updated = routeService.updateTelemetry(userId, lat, lng, speed);
        if (updated == null) return ResponseEntity.badRequest().body(Map.of("error","no active route"));
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{userId}/emergency")
    public ResponseEntity<?> postEmergency(@PathVariable Long userId, @RequestBody Map<String, Object> body, Authentication authentication) {
        requireOwnerOrAdmin(userId, authentication);
        double lat = ((Number)body.get("lat")).doubleValue();
        double lng = ((Number)body.get("lng")).doubleValue();
        String desc = (String) body.getOrDefault("description", "");
        User user = routeService.findUserById(userId);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("error","user not found"));
        Emergency e = new Emergency(user, lat, lng, desc);
        routeService.saveEmergency(e);
        return ResponseEntity.ok(Map.of("status","ok","id",e.getId()));
    }

    private void requireOwnerOrAdmin(Long userId, Authentication authentication) {
        boolean admin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        if (admin) return;
        User user = routeService.findUserByEmail(authentication.getName() + "@example.com");
        if (user == null || !user.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}
