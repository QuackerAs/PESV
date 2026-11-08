import React, { useEffect, useState } from 'react';
import { Search, Users as UsersIcon } from 'lucide-react';
import { userService } from '../../services/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAll()
      .then(({ data }) => setUsers(data.data))
      .catch(() => setError('No se pudo cargar la lista de usuarios. Comprueba la conexión con la API.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(user => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="users-page">
    <div className="page-header"><div><h1>Usuarios</h1><p>Directorio de cuentas de demostración</p></div></div>
    <div className="users-toolbar">
      <label className="search-box"><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar usuarios</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por nombre, correo o rol" /></label>
      <span className="toolbar-info">{filtered.length} usuarios</span>
    </div>
    {loading ? <p>Cargando usuarios…</p> : error ? <p role="alert">{error}</p> : <div className="users-table-container"><table className="users-table">
      <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
      <tbody>{filtered.map(user => <tr key={user.id}><td><div className="user-cell"><span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>{user.name}</div></td><td>{user.email}</td><td><span className={`role-badge ${user.role}`}>{user.role}</span></td></tr>)}</tbody>
    </table>{filtered.length === 0 && <div className="empty-state"><UsersIcon size={32} /><h3>Sin resultados</h3><p>Prueba otra búsqueda.</p></div>}</div>}
  </div>;
};

export default Users;
