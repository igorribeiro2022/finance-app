import api from './api';

const normalizePayload = ({ categoriaid, categoria_id, ...payload }) => ({
  ...payload,
  categoria_id: categoria_id ?? categoriaid,
});

export const getEventuais = (params = {}) =>
  api.get('/eventuais/', { params });

export const getEventual = (id) =>
  api.get(`/eventuais/${id}/`);

export const createEventual = (payload) =>
  api.post('/eventuais/', normalizePayload(payload));

export const updateEventual = (id, payload) =>
  api.patch(`/eventuais/${id}/`, normalizePayload(payload));

export const deleteEventual = (id) =>
  api.delete(`/eventuais/${id}/`);
