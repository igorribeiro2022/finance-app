import api from './api';

const trimBaseUrl = (value) => String(value || '').replace(/\/$/, '');

export const loginWithEmail = (payload) => api.post('/auth/login/', payload);
export const registerWithEmail = (payload) => api.post('/auth/register/', payload);
export const forgotPassword = (payload) => api.post('/auth/forgot-password/', payload);
export const resetPassword = (payload) => api.post('/auth/reset-password/', payload);
export const logoutSession = (refresh) => api.post('/auth/logout/', { refresh });

export const getOAuthLoginUrl = (provider) =>
  `${trimBaseUrl(api.defaults.baseURL)}/auth/${provider}/login/`;
