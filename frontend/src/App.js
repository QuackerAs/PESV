import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import MyRoutes from './pages/user/MyRoutes';
import './styles/globals.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login />} 
      />

      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Layout>
              {isAdmin() ? <AdminDashboard /> : <UserDashboard />}
            </Layout>
          </PrivateRoute>
        } 
      />

      <Route 
        path="/admin/*" 
        element={
          <AdminRoute>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<div>Página en construcción</div>} />
              </Routes>
            </Layout>
          </AdminRoute>
        } 
      />

      <Route 
        path="/user/*" 
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="my-routes" element={<MyRoutes />} />
                <Route path="*" element={<div>Página en construcción</div>} />
              </Routes>
            </Layout>
          </PrivateRoute>
        } 
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;