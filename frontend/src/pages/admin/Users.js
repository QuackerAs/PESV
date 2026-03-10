import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cedula.includes(searchTerm)
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        alert('User deleted successfully');
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handleViewRoutes = async (userId) => {
    try {
      const resp = await userService.getRoutesForUser(userId);
      const routes = resp.data;
      if (!routes || routes.length === 0) {
        alert('No routes found for this user');
        return;
      }
      const summary = routes.map(r => `#${r.id} - ${r.provider} - ${r.distanceMeters}m / ${r.durationSeconds}s`).join('\n');
      alert(summary);
    } catch (err) {
      console.error(err);
      alert('Error getting user routes');
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
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage PESV system users</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={handleCreate}
        >
          New User
        </Button>
      </div>

      <div className="users-toolbar">
        <div className="search-box">
          <Input
            type="text"
            placeholder="Search by name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
          />
        </div>
        <div className="toolbar-info">
          <span>{filteredUsers.length} users found</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>ID</th>
                <th>Position</th>
                <th>Role</th>
                <th>Road Actor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
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
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="action-btn view"
                        onClick={() => handleViewRoutes(user.id)}
                        title="View Routes"
                      >
                        📍
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <Users size={48} />
              <h3>No users found</h3>
              <p>Try different search criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Modal for creating/editing user */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSave={loadUsers}
        />
      )}
    </div>
  );
};

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
        // update
        await userService.update(user.id, formData);
        alert('User updated successfully');
      } else {
        // create
        await userService.create(formData);
        alert('User created successfully');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? 'Edit User' : 'New User'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              label="Full Name"
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
              label="ID"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
            />
            <Input
              label="Position"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              required
            />
          </div>

          {!user && (
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
            />
          )}

          <div className="form-row">
            <div className="input-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="usuario">User</option>
                <option value="administrador">Admin</option>
              </select>
            </div>

            <div className="input-group">
              <label>Road Actor Type</label>
              <select
                name="tipoActorVial"
                value={formData.tipoActorVial}
                onChange={handleChange}
                className="input"
              >
                <option value="conductor">Driver</option>
                <option value="peaton">Pedestrian</option>
                <option value="motociclista">Motorcyclist</option>
                <option value="ciclista">Cyclist</option>
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
              <span>Road Safety Committee Member</span>
            </label>

            <label>
              <input
                type="checkbox"
                name="canViewIndicators"
                checked={formData.canViewIndicators}
                onChange={handleChange}
              />
              <span>Can view indicators</span>
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

export default Users;