import api from './api';

export const getGanhosFixos = () => api.get('/ganhos-fixos/');

export const getGanhoFixo = (id) => api.get(`/ganhos-fixos/${id}/`);

export const createGanhoFixo = (payload) => api.post('/ganhos-fixos/', payload);

export const updateGanhoFixo = (id, payload) => api.patch(`/ganhos-fixos/${id}/`, payload);

export const deleteGanhoFixo = (id) => api.delete(`/ganhos-fixos/${id}/`);