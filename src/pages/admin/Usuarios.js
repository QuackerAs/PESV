import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      setUsuarios(response.data.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cedula.includes(searchTerm)
  );

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await userService.delete(id);
        alert('Usuario eliminado exitosamente');
        loadUsuarios();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleViewRoutes = async (userId) => {
    try {
      const resp = await userService.getRoutesForUser(userId);
      const routes = resp.data;
      if (!routes || routes.length === 0) {
        alert('No hay rutas para este usuario');
        return;
      }
      // Mostrar resumen simple
      const summary = routes.map(r => `#${r.id} - ${r.provider} - ${r.distanceMeters}m / ${r.durationSeconds}s`).join('\n');
      alert(summary);
    } catch (err) {
      console.error(err);
      alert('Error al obtener rutas del usuario');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  return (
    <div className="usuarios-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema PESV</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={handleCreate}
        >
          Nuevo Usuario
        </Button>
      </div>

      <div className="usuarios-toolbar">
        <div className="search-box">
          <Input
            type="text"
            placeholder="Buscar por nombre, email o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
          />
        </div>
        <div className="toolbar-info">
          <span>{filteredUsuarios.length} usuarios encontrados</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Cédula</th>
                <th>Cargo</th>
                <th>Rol</th>
                <th>Actor Vial</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{user.nombre[0]}</div>
                      <span>{user.nombre}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.cedula}</td>
                  <td>{user.cargo}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.tipoActorVial}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(user)}
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="action-btn view"
                        onClick={() => handleViewRoutes(user.id)}
                        title="Ver Rutas"
                      >
                        📍
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(user.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsuarios.length === 0 && (
            <div className="empty-state">
              <Users size={48} />
              <h3>No se encontraron usuarios</h3>
              <p>Intenta con otros criterios de búsqueda</p>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSave={loadUsuarios}
        />
      )}
    </div>
  );
};

// Componente Modal para crear/editar usuario
const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    cedula: user?.cedula || '',
    cargo: user?.cargo || '',
    role: user?.role || 'usuario',
    tipoActorVial: user?.tipoActorVial || 'conductor',
    tipoDesplazamiento: user?.tipoDesplazamiento || 'vehiculo_particular',
    isCommitteeMember: user?.isCommitteeMember || false,
    canViewIndicators: user?.canViewIndicators || false,
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Actualizar
        await userService.update(user.id, formData);
        alert('Usuario actualizado exitosamente');
      } else {
        // Crear
        await userService.create(formData);
        alert('Usuario creado exitosamente');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              label="Nombre Completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Cédula"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
            />
            <Input
              label="Cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              required
            />
          </div>

          {!user && (
            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
            />
          )}

          <div className="form-row">
            <div className="input-group">
              <label>Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div className="input-group">
              <label>Tipo de Actor Vial</label>
              <select
                name="tipoActorVial"
                value={formData.tipoActorVial}
                onChange={handleChange}
                className="input"
              >
                <option value="conductor">Conductor</option>
                <option value="peaton">Peatón</option>
                <option value="motociclista">Motociclista</option>
                <option value="ciclista">Ciclista</option>
              </select>
            </div>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isCommitteeMember"
                checked={formData.isCommitteeMember}
                onChange={handleChange}
              />
              <span>Miembro del Comité de Seguridad Vial</span>
            </label>

            <label>
              <input
                type="checkbox"
                name="canViewIndicators"
                checked={formData.canViewIndicators}
                onChange={handleChange}
              />
              <span>Puede ver indicadores</span>
            </label>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {user ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Usuarios;