import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';
import { AlertCircle } from 'lucide-react';

// solucionar problema de iconos de Leaflet con webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RouteMap = ({ routeData, onEmergency }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const currentMarker = useRef(null);
  const polyline = useRef(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // inicializar mapa
    if (!map.current && mapContainer.current) {
      map.current = L.map(mapContainer.current).setView([4.7, -74.0], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }
  }, []);

  useEffect(() => {
    if (!map.current || !routeData) return;

    // borrar polilínea anterior
    if (polyline.current) {
      map.current.removeLayer(polyline.current);
    }

    const origin = [routeData.originLat, routeData.originLng];
    const destination = [routeData.destLat, routeData.destLng];

    // ajustar límites para mostrar ambos puntos
    const bounds = L.latLngBounds([origin, destination]);
    map.current.fitBounds(bounds, { padding: [50, 50] });

    // marcador de origen (verde)
    L.circleMarker(origin, {
      radius: 8,
      fillColor: '#4CAF50',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    })
      .bindPopup('<b>Origen</b>')
      .addTo(map.current);

    // marcador de destino (rojo)
    L.circleMarker(destination, {
      radius: 8,
      fillColor: '#f44336',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    })
      .bindPopup('<b>Destino</b>')
      .addTo(map.current);

    // dibujar polilínea (línea recta para demo)
    polyline.current = L.polyline([origin, destination], {
      color: '#2196F3',
      weight: 4,
      opacity: 0.7,
      dashArray: '5, 10',
    }).addTo(map.current);

    // marcador de posición actual (azul)
    if (!currentMarker.current) {
      currentMarker.current = L.circleMarker(origin, {
        radius: 10,
        fillColor: '#2196F3',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .bindPopup('<b>Posición Actual</b>')
        .addTo(map.current);
    } else {
      currentMarker.current.setLatLng(origin);
    }

    setDistance(routeData.distanceMeters || 0);
    setDuration(routeData.durationSeconds || 0);
  }, [routeData]);

  const simulateMovement = () => {
    if (!routeData || !currentMarker.current) return;

    setIsSimulating(!isSimulating);

    if (isSimulating) return;

    const origin = [routeData.originLat, routeData.originLng];
    const destination = [routeData.destLat, routeData.destLng];
    let progress = 0;
    const step = 0.02; // incremento de movimiento

    const interval = setInterval(() => {
      if (progress >= 1) {
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }

      // Linear interpolation
      const lat = origin[0] + (destination[0] - origin[0]) * progress;
      const lng = origin[1] + (destination[1] - origin[1]) * progress;

      currentMarker.current.setLatLng([lat, lng]);

      // Simulate speed variation (30-80 km/h)
      const speed = 30 + Math.random() * 50;
      setCurrentSpeed(speed.toFixed(1));

      progress += step;
    }, 1000);
  };

  const handleEmergency = () => {
    if (onEmergency) {
      const lat = currentMarker.current ? currentMarker.current.getLatLng().lat : routeData.originLat;
      const lng = currentMarker.current ? currentMarker.current.getLatLng().lng : routeData.originLng;
      onEmergency(lat, lng, 'Reportado desde la ruta');
    }
  };

  if (!routeData) {
    return (
      <div className="route-map-placeholder">
        <p>No hay ruta activa. Calcula una ruta primero.</p>
      </div>
    );
  }

  const durationMin = Math.floor(duration / 60);
  const distanceKm = (distance / 1000).toFixed(1);

  return (
    <div className="route-map-container">
      <div className="map-wrapper">
        <div ref={mapContainer} className="map-canvas" />
        <div className="map-info">
          <div className="info-card">
            <h4>📍 Información de la Ruta</h4>
            <p>Distancia: <strong>{distanceKm} km</strong></p>
            <p>Duración: <strong>{durationMin} min</strong></p>
            <p>Proveedor: <strong>{routeData.provider || 'Desconocido'}</strong></p>
          </div>
        </div>
      </div>

      <div className="map-controls">
        <div className="speed-display">
          <h3>Velocidad Actual</h3>
          <div className="speed-value">{currentSpeed} km/h</div>
        </div>

        <button
          className={`btn-simulate ${isSimulating ? 'active' : ''}`}
          onClick={simulateMovement}
        >
          {isSimulating ? '⏸ Detener Simulación' : '▶ Iniciar Simulación'}
        </button>

        <button className="btn-emergency" onClick={handleEmergency}>
          <AlertCircle size={20} />
          <span>🚨 Reportar Emergencia</span>
        </button>
      </div>
    </div>
  );
};

export default RouteMap;
