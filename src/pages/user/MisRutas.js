import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RouteMap from '../../components/RouteMap/RouteMap';
import './MisRutas.css';

const MisRutas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState(null);

  const loadActiveRoute = useCallback(async () => {
    if (!user) return;
    try {
      // Para demo, usamos una ruta mock
      const mockRoute = {
        originLat: 4.7,
        originLng: -74.0,
        destLat: 4.72,
        destLng: -74.05,
        distanceMeters: 5000,
        durationSeconds: 600,
        provider: 'waze-sim',
        currentLat: 4.705,
        currentLng: -74.025,
        currentSpeed: 45,
      };
      setActiveRoute(mockRoute);
    } catch (err) {
      console.error('Error loading active route:', err);
    }
  }, [user]);

  useEffect(() => {
    loadActiveRoute();
    const interval = setInterval(loadActiveRoute, 3000);
    return () => clearInterval(interval);
  }, [loadActiveRoute]);

  const handleEmergency = async (lat, lng, description) => {
    if (!user) return alert('Usuario no autenticado');
    try {
      alert('🚨 Emergencia reportada en (' + lat.toFixed(4) + ', ' + lng.toFixed(4) + ')');
      // Aquí irá la llamada real al backend:
      // await userService.reportEmergency(user.id, { lat, lng, description });
    } catch (err) {
      console.error(err);
      alert('Error al reportar emergencia');
    }
  };

  return (
    <div className="mis-rutas-container">
      <div className="mis-rutas-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1>
          <MapPin size={24} />
          Mis Rutas
        </h1>
      </div>

      <div className="mis-rutas-content">
        <RouteMap routeData={activeRoute} onEmergency={handleEmergency} />
      </div>
    </div>
  );
};

export default MisRutas;
