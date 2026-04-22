import api from './api';

export const getGastosFixos = () => api.get('/gastos-fixos/');

export const getGastoFixo = (id) => api.get(`/gastos-fixos/${id}/`);

export const createGastoFixo = (payload) => api.post('/gastos-fixos/', payload);

export const updateGastoFixo = (id, payload) => api.patch(`/gastos-fixos/${id}/`, payload);

export const deleteGastoFixo = (id) => api.delete(`/gastos-fixos/${id}/`);