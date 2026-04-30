import api from './api';

export const getMe = () => api.get('/auth/me/');
export const patchMe = (body) => api.patch('/auth/me/', body);
