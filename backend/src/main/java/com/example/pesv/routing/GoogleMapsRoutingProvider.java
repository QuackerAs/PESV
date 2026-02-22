package com.example.pesv.routing;

import com.example.pesv.routing.dto.RouteResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component("google")
public class GoogleMapsRoutingProvider implements RoutingProvider {

    @Value("${google.api.key:}")
    private String apiKey;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public RouteResult getRoute(double originLat, double originLng, double destLat, double destLng) throws Exception {
        String origin = originLat + "," + originLng;
        String dest = destLat + "," + destLng;
        String url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + dest + "&key=" + apiKey + "&units=metric";
        String resp = rest.getForObject(url, String.class);
        JsonNode root = mapper.readTree(resp);
        JsonNode routes = root.path("routes");
        if (!routes.isArray() || routes.size() == 0) throw new Exception("No route from Google");
        JsonNode route = routes.get(0);
        String poly = route.path("overview_polyline").path("points").asText();
        JsonNode legs = route.path("legs");
        JsonNode leg = legs.get(0);
        long distance = leg.path("distance").path("value").asLong();
        long duration = leg.path("duration").path("value").asLong();
        return new RouteResult(distance, duration, poly);
    }

    @Override
    public String providerName() { return "google"; }
}
