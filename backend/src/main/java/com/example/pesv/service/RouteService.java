package com.example.pesv.service;

import com.example.pesv.model.Route;
import com.example.pesv.model.User;
import com.example.pesv.repository.RouteRepository;
import com.example.pesv.repository.UserRepository;
import com.example.pesv.routing.RoutingProvider;
import com.example.pesv.routing.dto.RouteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import com.example.pesv.model.Emergency;
import com.example.pesv.repository.EmergencyRepository;

@Service
public class RouteService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private Map<String, RoutingProvider> providers;

    @Autowired
    private EmergencyRepository emergencyRepository;

    public Route calculateAndSave(Long userId, double oLat, double oLng, double dLat, double dLng, String providerKey) throws Exception {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        RoutingProvider provider = providers.getOrDefault(providerKey, providers.get("google"));
        RouteResult res = provider.getRoute(oLat, oLng, dLat, dLng);
        Route r = new Route(user, oLat, oLng, dLat, dLng, res.getDistanceMeters(), res.getDurationSeconds(), res.getOverviewPolyline(), provider.providerName());
        return routeRepository.save(r);
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public List<Route> listByUser(Long userId) { return routeRepository.findByUserId(userId); }

    public void saveAll(List<Route> routes) { routeRepository.saveAll(routes); }

    public Route getActiveRouteForUser(Long userId) {
        return routeRepository.findByUserId(userId).stream().filter(Route::isAssigned).findFirst().orElse(null);
    }

    public Emergency saveEmergency(Emergency e) { return emergencyRepository.save(e); }

    public Route updateTelemetry(Long userId, Double lat, Double lng, Double speed) {
        Route active = getActiveRouteForUser(userId);
        if (active == null) return null;
        active.setCurrentLat(lat);
        active.setCurrentLng(lng);
        active.setCurrentSpeed(speed);
        return routeRepository.save(active);
    }
}
