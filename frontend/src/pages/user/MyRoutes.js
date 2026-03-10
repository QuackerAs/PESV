import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RouteMap from '../../components/RouteMap/RouteMap';
import { userService } from '../../services/api';
import './MyRoutes.css';

const MyRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState(null);

  const loadActiveRoute = useCallback(async () => {
    if (!user) return;
    try {
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
    if (!user) return alert('User not authenticated');
    try {
      alert('🚨 Emergencia reportada en (' + lat.toFixed(4) + ', ' + lng.toFixed(4) + ')');
      // llamada al backend
      await userService.reportEmergency(user.id, { lat, lng, description });
    } catch (err) {
      console.error(err);
      alert('Error reporting emergency');
    }
  };

  return (
    <div className="my-routes-container">
      <div className="my-routes-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1>
          <MapPin size={24} />
          Mis Rutas
        </h1>
      </div>

      <div className="my-routes-content">
        <RouteMap routeData={activeRoute} onEmergency={handleEmergency} />
      </div>
    </div>
  );
};

export default MyRoutes;
