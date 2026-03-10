import React, { useState, useEffect } from 'react';
import { 
  Users, Car, FileText, AlertTriangle, 
  CheckCircle, Clock, TrendingUp, Calendar 
} from 'lucide-react';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalVehiculos: 0,
    documentosPendientes: 0,
    incidentesActivos: 0,
    tareasCompletadas: 0,
    tareasPendientes: 0,
    capacitacionesActivas: 0,
    proximasInspecciones: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setStats({
      totalUsuarios: 45,
      totalVehiculos: 23,
      documentosPendientes: 8,
      incidentesActivos: 3,
      tareasCompletadas: 67,
      tareasPendientes: 12,
      capacitacionesActivas: 5,
      proximasInspecciones: 7
    });
  };

  const StatCard = ({ icon, title, value, color, trend }) => (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {trend && (
          <div className="stat-trend">
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Bienvenido al sistema de gestión PESV</p>
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

      <div className="stats-grid">
        <StatCard
          icon={<Users size={28} />}
          title="Total Usuarios"
          value={stats.totalUsuarios}
          color="var(--primary-color)"
          trend="+5% este mes"
        />
        <StatCard
          icon={<Car size={28} />}
          title="Vehículos Registrados"
          value={stats.totalVehiculos}
          color="var(--secondary-color)"
        />
        <StatCard
          icon={<FileText size={28} />}
          title="Documentos Pendientes"
          value={stats.documentosPendientes}
          color="var(--warning-color)"
        />
        <StatCard
          icon={<AlertTriangle size={28} />}
          title="Incidentes Activos"
          value={stats.incidentesActivos}
          color="var(--danger-color)"
        />
      </div>

      <div className="dashboard-row">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Tareas del Sistema</h2>
          </div>
          <div className="tasks-summary">
            <div className="task-item">
              <CheckCircle size={24} color="var(--success-color)" />
              <div>
                <h3>{stats.tareasCompletadas}</h3>
                <p>Tareas Completadas</p>
              </div>
            </div>
            <div className="task-item">
              <Clock size={24} color="var(--warning-color)" />
              <div>
                <h3>{stats.tareasPendientes}</h3>
                <p>Tareas Pendientes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Actividades Próximas</h2>
          </div>
          <div className="activities-list">
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-info">
                <h4>Capacitaciones Activas</h4>
                <p>{stats.capacitacionesActivas} programadas este mes</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🔍</div>
              <div className="activity-info">
                <h4>Inspecciones Pendientes</h4>
                <p>{stats.proximasInspecciones} próximas inspecciones</p>
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
          <button className="quick-action-btn">
            <Users size={20} />
            <span>Agregar Usuario</span>
          </button>
          <button className="quick-action-btn">
            <Car size={20} />
            <span>Registrar Vehículo</span>
          </button>
          <button className="quick-action-btn">
            <FileText size={20} />
            <span>Subir Documento</span>
          </button>
          <button className="quick-action-btn">
            <Calendar size={20} />
            <span>Programar Capacitación</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;