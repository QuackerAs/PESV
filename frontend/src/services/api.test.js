jest.mock('axios', () => ({
  create: jest.fn(() => ({
    defaults: { headers: { common: {} } },
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

import { authService, userService } from './api';
import axios from 'axios';

const client = axios.create.mock.results[0].value;

describe('API demo client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('does not log credentials while authenticating', async () => {
    client.get.mockResolvedValue({ data: { id: 2, role: 'administrador' } });
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    await authService.login({ email: 'admin@example.com', password: 'admin' });

    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    log.mockRestore();
    error.mockRestore();
  });

  test('uses the local route provider by default', () => {
    userService.calculateRoute(1, { originLat: 1, originLng: 2, destLat: 3, destLng: 4 });

    expect(client.post).toHaveBeenCalledWith('/users/1/routes/calc?provider=waze', expect.any(Object));
  });
});
