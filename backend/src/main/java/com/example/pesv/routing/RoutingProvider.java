package com.example.pesv.routing;

import com.example.pesv.routing.dto.RouteResult;

public interface RoutingProvider {
    RouteResult getRoute(double originLat, double originLng, double destLat, double destLng) throws Exception;
    String providerName();
}
