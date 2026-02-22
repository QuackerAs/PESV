import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const USE_MOCK = false; // true = no back, false = back active

const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@pesv.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'administrador',
    isCommitteeMember: false
  },
  {
    id: 2,
    email: 'user@pesv.com',
    password: 'user123',
    name: 'Usuario Regular',
    role: 'usuario',
    isCommitteeMember: true
  },
  {
    id: 3,
    email: 'coordinador@pesv.com',
    password: 'coord123',
    name: 'Coordinador',
    role: 'coordinador',
    isCommitteeMember: true
  }
];

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // token may already include scheme (e.g. 'Basic xxxx' or 'Bearer xxxx')
      if (token.startsWith('Basic ') || token.startsWith('Bearer ')) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = MOCK_USERS.find(u => u.email === credentials.email);
          
          if (user && user.password === credentials.password) {
            const userData = { ...user };
            delete userData.password;
            resolve({
              data: {
                token: 'mock_token_' + Date.now(),
                user: userData
              }
            });
          } else {
            reject({
              response: {
                data: {
                  message: 'Email o contraseña incorrectos'
                }
              }
            });
          }
        }, 800);
      });
    }
    
    // If backend is active, use Basic auth against /api/auth/me
    const token = btoa(`${credentials.email}:${credentials.password}`);
    const header = `Basic ${token}`;
    localStorage.setItem('token', header);
    api.defaults.headers.Authorization = header;
    const resp = await api.get('/auth/me');
    return { data: { token: header, user: resp.data } };
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = localStorage.getItem('user');
          if (user) {
            resolve({ data: JSON.parse(user) });
          }
        }, 300);
      });
    }
    return api.get('/auth/me');
  },
};

export const userService = {
  getAll: () => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              data: MOCK_USERS.map(u => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
              })
            }
          });
        }, 500);
      });
    }
    return api.get('/admin/users').then(resp => ({ data: { data: resp.data } }));
  },
  
  create: (userData) => api.post('/users', userData),
  
  update: (id, userData) => api.put(`/users/${id}`, userData),
  
  delete: (id) => api.delete(`/users/${id}`),
  
  // Calculate route for a user (calls backend route calculator)
  calculateRoute: (userId, payload, provider = 'google') => {
    return api.post(`/users/${userId}/routes/calc?provider=${provider}`, payload);
  },

  // Admin: get routes for a user
  getRoutesForUser: (userId) => api.get(`/admin/users/${userId}/routes`),

  // Report emergency
  reportEmergency: (userId, payload) => {
    return api.post(`/users/${userId}/emergency`, payload);
  },

  // Send telemetry (location + speed)
  sendTelemetry: (userId, lat, lng, speed) => {
    return api.post(`/users/${userId}/telemetry`, { lat, lng, speed });
  },
};

// TODO: Implement the following services when backend is available
// export const documentService = { ... }
// export const vehicleService = { ... }
// export const inspectionService = { ... }
// export const trainingService = { ... }
// export const accidentService = { ... }
// export const indicatorService = { ... }
// export const responsibilityService = { ... }
// export const taskService = { ... }
// export const committeeService = { ... }
// export const maintenanceService = { ... }

export default api;