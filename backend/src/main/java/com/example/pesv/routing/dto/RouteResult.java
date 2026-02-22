package com.example.pesv.routing.dto;

public class RouteResult {
    private long distanceMeters;
    private long durationSeconds;
    private String overviewPolyline;

    public RouteResult() {}

    public RouteResult(long distanceMeters, long durationSeconds, String overviewPolyline) {
        this.distanceMeters = distanceMeters;
        this.durationSeconds = durationSeconds;
        this.overviewPolyline = overviewPolyline;
    }

    public long getDistanceMeters() { return distanceMeters; }
    public long getDurationSeconds() { return durationSeconds; }
    public String getOverviewPolyline() { return overviewPolyline; }
}
