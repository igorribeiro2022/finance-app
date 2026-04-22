import api from './api';

export const getEventuais = (params = {}) =>
  api.get('/eventuais/', { params });

export const getEventual = (id) =>
  api.get(`/eventuais/${id}/`);

export const createEventual = (payload) =>
  api.post('/eventuais/', payload);

export const updateEventual = (id, payload) =>
  api.patch(`/eventuais/${id}/`, payload);

export const deleteEventual = (id) =>
  api.delete(`/eventuais/${id}/`);