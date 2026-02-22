package com.example.pesv.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private double originLat;
    private double originLng;
    private double destLat;
    private double destLng;
    private long distanceMeters;
    private long durationSeconds;
    private String polyline;
    private String provider;
    private Instant createdAt = Instant.now();
    private boolean assigned = false;
    private Double currentLat;
    private Double currentLng;
    private Double currentSpeed;

    public Route() {}

    public Route(User user, double originLat, double originLng, double destLat, double destLng, long distanceMeters, long durationSeconds, String polyline, String provider) {
        this.user = user;
        this.originLat = originLat;
        this.originLng = originLng;
        this.destLat = destLat;
        this.destLng = destLng;
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.polyline = polyline;
        this.provider = provider;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public double getOriginLat() { return originLat; }
    public double getOriginLng() { return originLng; }
    public double getDestLat() { return destLat; }
    public double getDestLng() { return destLng; }
    public long getDistanceMeters() { return distanceMeters; }
    public long getDurationSeconds() { return durationSeconds; }
    public String getPolyline() { return polyline; }
    public String getProvider() { return provider; }
    public Instant getCreatedAt() { return createdAt; }
    public boolean isAssigned() { return assigned; }
    public void setAssigned(boolean assigned) { this.assigned = assigned; }
    public Double getCurrentLat() { return currentLat; }
    public Double getCurrentLng() { return currentLng; }
    public Double getCurrentSpeed() { return currentSpeed; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }
    public void setCurrentSpeed(Double currentSpeed) { this.currentSpeed = currentSpeed; }
}
