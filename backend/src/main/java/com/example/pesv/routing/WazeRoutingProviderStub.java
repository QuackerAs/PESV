package com.example.pesv.routing;

import com.example.pesv.routing.dto.RouteResult;
import org.springframework.stereotype.Component;

@Component("waze")
public class WazeRoutingProviderStub implements RoutingProvider {

    @Override
    public RouteResult getRoute(double originLat, double originLng, double destLat, double destLng) {
        double dx = originLat - destLat;
        double dy = originLng - destLng;
        double straight = Math.sqrt(dx*dx + dy*dy);
        long distanceMeters = (long)(straight * 111000); // aproximación latitud->metros
        long duration = Math.max(60, distanceMeters / 1500); // asume ~54km/h (~1500 m/min)
        return new RouteResult(distanceMeters, duration * 60, "");
    }

    @Override
    public String providerName() { return "waze-stub"; }
}
