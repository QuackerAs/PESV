import axios from 'axios';

// la URL base se puede configurar vía variable de entorno o usar proxy de CRA
// durante desarrollo se recomienda dejarla en '/api' y usar "proxy" en package.json
const API_URL = process.env.REACT_APP_API_URL || '/api';

const USE_MOCK = false; // true = usa la versión simulada, false = usa el backend real

const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@pesv.co',
    password: 'admin123',
    name: 'Administrador',
    role: 'administrador',
    isCommitteeMember: false
  },
  {
    id: 2,
    email: 'user@pesv.co',
    password: 'user123',
    name: 'Usuario Regular',
    role: 'usuario',
    isCommitteeMember: true
  },
  {
    id: 3,
    email: 'coordinador@pesv.co',
    password: 'coord123',
    name: 'Coordinador',
    role: 'coordinador',
    isCommitteeMember: true
  }
];

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // el token puede traer ya el esquema ('Basic ' o 'Bearer ')
      if (token.startsWith('Basic ') || token.startsWith('Bearer ')) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Log request details in development
    if (process.env.NODE_ENV === 'development' && config.url?.includes('auth')) {
      console.log('[AUTH REQUEST]', {
        url: config.url,
        method: config.method,
        hasAuth: !!config.headers.Authorization,
        authType: config.headers.Authorization?.split(' ')[0] || 'none'
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development' && response.config.url?.includes('auth')) {
      console.log('[AUTH RESPONSE]', {
        status: response.status,
        url: response.config.url
      });
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development' && error.config?.url?.includes('auth')) {
      console.log('[AUTH ERROR]', {
        status: error.response?.status,
        url: error.config.url,
        message: error.response?.data?.message || error.message
      });
    }
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
    
    // si hay backend activo usamos HTTP Basic en /api/auth/me
    // el demo de Spring crea usuarios simples "admin"/"admin" y "user"/"user",
    // por lo que la aplicación aceptará también correos tipo "admin@..." extrayendo
    // la parte antes de la arroba para facilitar pruebas desde la UI.
    
    console.log('[LOGIN] Attempting login with email:', credentials.email);
    
    // normalize credentials: remove whitespace and lowercase
    let username = credentials.email.trim().toLowerCase();
    if (!USE_MOCK && username.includes('@')) {
      username = username.split('@')[0];
    }

    console.log('[LOGIN] Normalized username:', username);
    
    const credentials_string = `${username}:${credentials.password}`;
    const encoded = btoa(credentials_string);
    const token = `Basic ${encoded}`;
    
    console.log('[LOGIN] Generated token scheme: Basic');
    console.log('[LOGIN] Credentials string:', credentials_string);
    console.log('[LOGIN] Encoded credentials:', encoded);
    
    // Store token in localStorage immediately
    localStorage.setItem('token', token);
    console.log('[LOGIN] Token stored in localStorage');
    
    try {
      // Make request with explicit Authorization header (bypass interceptor initially)
      console.log('[LOGIN] Making GET request to /auth/me');
      const resp = await api.get('/auth/me', {
        headers: {
          'Authorization': token
        }
      });
      
      console.log('[LOGIN] Success! Received user data:', resp.data);
      
      // On success, also set in defaults for future requests
      api.defaults.headers.common['Authorization'] = token;
      
      return { data: { token: token, user: resp.data } };
    } catch (error) {
      console.error('[LOGIN] Authentication failed!');
      console.error('[LOGIN] Error status:', error.response?.status);
      console.error('[LOGIN] Error data:', error.response?.data);
      console.error('[LOGIN] Error message:', error.message);
      
      // Clear token on auth failure
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
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
  
  // calcular ruta para un usuario (invoca backend)
  calculateRoute: (userId, payload, provider = 'google') => {
    return api.post(`/users/${userId}/routes/calc?provider=${provider}`, payload);
  },

  // admin: obtener rutas de un usuario
  getRoutesForUser: (userId) => api.get(`/admin/users/${userId}/routes`),

  // reportar emergencia
  reportEmergency: (userId, payload) => {
    return api.post(`/users/${userId}/emergency`, payload);
  },

  // enviar telemetría (posición + velocidad)
  sendTelemetry: (userId, lat, lng, speed) => {
    return api.post(`/users/${userId}/telemetry`, { lat, lng, speed });
  },
};


export default api;