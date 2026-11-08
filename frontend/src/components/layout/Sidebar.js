import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Route, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const { isAdmin } = useAuth();
  const items = isAdmin()
    ? [{ title: 'Vista general', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> }, { title: 'Usuarios', path: '/admin/usuarios', icon: <Users size={18} /> }]
    : [{ title: 'Mi panel', path: '/user/dashboard', icon: <LayoutDashboard size={18} /> }, { title: 'Mis rutas', path: '/user/my-routes', icon: <Route size={18} /> }];

  return <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
    <div className="sidebar-header"><h2>PESV <span>Espacio de trabajo</span></h2><button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú"><X size={18} /></button></div>
    <nav className="sidebar-nav" aria-label="Navegación principal">
      {items.map(item => <div className="sidebar-item" key={item.path}><NavLink to={item.path} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><span className="sidebar-icon">{item.icon}</span><span className="sidebar-text">{item.title}</span></NavLink></div>)}
    </nav>
    <div className="sidebar-foot">Demostración local</div>
  </aside>;
};

export default Sidebar;
