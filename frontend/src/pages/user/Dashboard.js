import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Clock, AlertCircle, Car, 
  GraduationCap, FileText, Calendar, TrendingUp 
} from 'lucide-react';
import '../admin/Dashboard.css';

import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [userStats, setUserStats] = useState({
    tareasPendientes: 0,
    tareasCompletadas: 0,
    capacitacionesPendientes: 0,
    documentosPendientes: 0,
    chequeoHoy: false,
    proximaInspeccion: null
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    setUserStats({
      tareasPendientes: 3,
      tareasCompletadas: 15,
      capacitacionesPendientes: 2,
      documentosPendientes: 1,
      chequeoHoy: false,
      proximaInspeccion: 'Próxima semana'
    });
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Mi espacio de trabajo</h1>
          <p>{user?.name || 'Usuario'} · datos de demostración</p>
        </div>
        <div className="dashboard-date">
          <Calendar size={20} />
          <span>{new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Alerta de chequeo diario */}
      {!userStats.chequeoHoy && (
        <div className="alert-banner warning">
          <AlertCircle size={24} />
          <div>
            <h3>Chequeo preoperacional pendiente</h3>
            <p>Este recordatorio forma parte de los datos de demostración.</p>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          icon={<Clock size={28} />}
          title="Tareas Pendientes"
          value={userStats.tareasPendientes}
          color="var(--warning-color)"
          action="Ver Tareas"
        />
        <StatCard
          icon={<CheckCircle size={28} />}
          title="Tareas Completadas"
          value={userStats.tareasCompletadas}
          color="var(--success-color)"
        />
        <StatCard
          icon={<GraduationCap size={28} />}
          title="Capacitaciones Pendientes"
          value={userStats.capacitacionesPendientes}
          color="var(--secondary-color)"
          action="Ver Capacitaciones"
        />
        <StatCard
          icon={<FileText size={28} />}
          title="Documentos por Revisar"
          value={userStats.documentosPendientes}
          color="var(--primary-color)"
        />
      </div>

      <div className="dashboard-row">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Mis Responsabilidades</h2>
          </div>
          <div className="activities-list">
            <div className="activity-item">
              <div className="activity-icon">DOC</div>
              <div className="activity-info">
                <h4>Reporte de Seguridad</h4>
                <p>Vence en 3 días</p>
              </div>
              <div className="badge badge-warning">Pendiente</div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">VEH</div>
              <div className="activity-info">
                <h4>Mantenimiento Vehículo</h4>
                <p>Vence en 7 días</p>
              </div>
              <div className="badge badge-warning">Pendiente</div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><GraduationCap size={20} /></div>
              <div className="activity-info">
                <h4>Capacitación de Seguridad</h4>
                <p>Completada hace 2 días</p>
              </div>
              <div className="badge badge-success">Completada</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Mi Vehículo</h2>
          </div>
          <div className="vehicle-card">
            <Car size={48} color="var(--primary-color)" />
            <div className="vehicle-info">
              <h3>Toyota Corolla 2021</h3>
              <p>Placa: ABC-123</p>
              <div className="vehicle-status">
                <div className="status-item">
                  <span className="status-label">Último chequeo:</span>
                  <span className="status-value">Hace 2 días</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Próxima inspección:</span>
                  <span className="status-value">{userStats.proximaInspeccion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Acciones Rápidas</h2>
        </div>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => navigate('/user/my-routes')}>
            <TrendingUp size={20} />
            <span>Ver Rutas</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
