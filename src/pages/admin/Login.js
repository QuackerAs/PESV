import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFormHandler } from '../../hooks/useFormHandler';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { 
    formData, 
    error, 
    loading, 
    handleChange, 
    setFormError, 
    setLoading 
  } = useFormHandler({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(result.error);
      }
    } catch (err) {
      setFormError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-shape shape-1"></div>
        <div className="background-shape shape-2"></div>
        <div className="background-shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">PESV</div>
          <h1>Sistema PESV</h1>
          <p>Plan Estratégico de Seguridad Vial</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            icon={<Mail size={20} />}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<Lock size={20} />}
            required
          />

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Recordarme</span>
            </label>
            <a href="#forgot" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="login-footer">
          <p>Resolución 40595 de 2022 - Ministerio de Transporte</p>
        </div>
      </div>
    </div>
  );
};

export default Login;