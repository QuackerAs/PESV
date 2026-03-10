import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, FileText, ClipboardList, Car,
  Target, Calendar, GraduationCap, Shield,
  AlertTriangle, Activity, Wrench, Building2, BarChart3,
  FileWarning, MessageSquare, CheckSquare
} from 'lucide-react';
import { X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const { isAdmin } = useAuth();

  const adminMenuItems = [
    { 
      title: 'Panel Principal', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin/dashboard' 
    },
    { 
      title: 'Parametrización', 
      icon: <Users size={20} />, 
      path: '/admin/parametrizacion',
      submenu: [
        { title: 'Usuarios', path: '/admin/usuarios' },
        { title: 'Roles', path: '/admin/roles' },
        { title: 'Responsabilidades', path: '/admin/responsabilidades' },
        { title: 'Lista Chequeo', path: '/admin/lista-chequeo' }
      ]
    },
    { 
      title: 'Documental', 
      icon: <FileText size={20} />, 
      path: '/admin/documental' 
    },
    { 
      title: 'Comité Vial', 
      icon: <Users size={20} />, 
      path: '/admin/comite' 
    },
    { 
      title: 'Caracterización', 
      icon: <ClipboardList size={20} />, 
      path: '/admin/caracterizacion',
      submenu: [
        { title: 'Vehículos', path: '/admin/vehiculos' },
        { title: 'Contratistas', path: '/admin/contratistas' },
        { title: 'Diagnóstico', path: '/admin/diagnostico' },
        { title: 'Línea Base', path: '/admin/linea-base' },
        { title: 'Rutogramas', path: '/admin/rutogramas' }
      ]
    },
    { 
      title: 'Matriz Riesgos', 
      icon: <AlertTriangle size={20} />, 
      path: '/admin/matriz-riesgos' 
    },
    { 
      title: 'Objetivos y Metas', 
      icon: <Target size={20} />, 
      path: '/admin/objetivos' 
    },
    { 
      title: 'Programas Gestión', 
      icon: <Calendar size={20} />, 
      path: '/admin/programas' 
    },
    { 
      title: 'Plan Formación', 
      icon: <GraduationCap size={20} />, 
      path: '/admin/formacion' 
    },
    { 
      title: 'Comportamiento', 
      icon: <Activity size={20} />, 
      path: '/admin/comportamiento' 
    },
    { 
      title: 'Plan Emergencia', 
      icon: <Shield size={20} />, 
      path: '/admin/emergencias' 
    },
    { 
      title: 'Investigación', 
      icon: <FileWarning size={20} />, 
      path: '/admin/investigacion' 
    },
    { 
      title: 'Inspección Vías', 
      icon: <CheckSquare size={20} />, 
      path: '/admin/inspeccion-vias' 
    },
    { 
      title: 'Mantenimiento', 
      icon: <Wrench size={20} />, 
      path: '/admin/mantenimiento' 
    },
    { 
      title: 'Control Contratistas', 
      icon: <Building2 size={20} />, 
      path: '/admin/control-contratistas' 
    },
    { 
      title: 'Indicadores', 
      icon: <BarChart3 size={20} />, 
      path: '/admin/indicadores' 
    },
    { 
      title: 'Acciones Correctivas', 
      icon: <CheckSquare size={20} />, 
      path: '/admin/acciones-correctivas' 
    }
  ];

  const userMenuItems = [
    { 
      title: 'Mi Panel', 
      icon: <LayoutDashboard size={20} />, 
      path: '/user/dashboard' 
    },
    { 
      title: 'Mi Perfil', 
      icon: <Users size={20} />, 
      path: '/user/perfil' 
    },
    { 
      title: 'Documentos', 
      icon: <FileText size={20} />, 
      path: '/user/documentos' 
    },
    { 
      title: 'Mis Responsabilidades', 
      icon: <ClipboardList size={20} />, 
      path: '/user/responsabilidades' 
    },
    { 
      title: 'Mis Tareas', 
      icon: <CheckSquare size={20} />, 
      path: '/user/tareas' 
    },
    { 
      title: 'Capacitaciones', 
      icon: <GraduationCap size={20} />, 
      path: '/user/capacitaciones' 
    },
    { 
      title: 'Mi Vehículo', 
      icon: <Car size={20} />, 
      path: '/user/vehiculo',
      submenu: [
        { title: 'Información', path: '/user/vehiculo/info' },
        { title: 'Chequeo Diario', path: '/user/vehiculo/chequeo' },
        { title: 'Mantenimientos', path: '/user/vehiculo/mantenimiento' }
      ]
    },
    { 
      title: 'Mis Rutas', 
      icon: <Activity size={20} />, 
      path: '/user/my-routes' 
    },
    { 
      title: 'Reportar Incidente', 
      icon: <AlertTriangle size={20} />, 
      path: '/user/reportar-incidente' 
    },
    { 
      title: 'Reportar Riesgo', 
      icon: <FileWarning size={20} />, 
      path: '/user/reportar-riesgo' 
    },
    { 
      title: 'Sugerencias', 
      icon: <MessageSquare size={20} />, 
      path: '/user/sugerencias' 
    }
  ];

  const menuItems = isAdmin() ? adminMenuItems : userMenuItems;

  return (
    <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Menú de Navegación</h2>
        <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">
          <X size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="sidebar-item">
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.title}</span>
            </NavLink>

            {item.submenu && (
              <div className="sidebar-submenu">
                {item.submenu.map((subitem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subitem.path}
                    className={({ isActive }) => 
                      `sidebar-sublink ${isActive ? 'active' : ''}`
                    }
                  >
                    {subitem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
