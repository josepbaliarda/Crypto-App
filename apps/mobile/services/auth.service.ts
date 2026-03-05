import { api } from './api';
import type { RegisterDto, LoginDto, AuthResponse } from '@crypto-app/shared-types';

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    return data;
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  async getMe() {
    const { data } = await api.get('/users/me');
    return data;
  },
};
