import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Button from '../common/Button';
import { LogOut, Menu } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isNative = typeof window.Capacitor !== 'undefined';

  const toggleSidebar = () => setSidebarOpen(v => !v);

  return (
    <div className={`layout ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="layout-main">
        <div className="layout-header">
          <div className="header-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isNative && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={toggleSidebar}
                  icon={<Menu size={16} />}
                />
              )}
              <span className="header-user">Bienvenido, {user?.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="small"
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LogOut size={16} />
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <div className="layout-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
