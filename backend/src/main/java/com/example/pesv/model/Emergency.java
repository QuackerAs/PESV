package com.example.pesv.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Emergency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private double lat;
    private double lng;
    private String description;
    private Instant createdAt = Instant.now();

    public Emergency() {}

    public Emergency(User user, double lat, double lng, String description) {
        this.user = user;
        this.lat = lat;
        this.lng = lng;
        this.description = description;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public double getLat() { return lat; }
    public double getLng() { return lng; }
    public String getDescription() { return description; }
    public Instant getCreatedAt() { return createdAt; }
}
