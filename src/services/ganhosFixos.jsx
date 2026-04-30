import api from './api';

const normalizePayload = ({
  categoriaid,
  tipodia,
  numerodia,
  categoria_id,
  tipo_dia,
  numero_dia,
  ...payload
}) => ({
  ...payload,
  categoria_id: categoria_id ?? categoriaid,
  tipo_dia: tipo_dia ?? tipodia,
  numero_dia: numero_dia ?? numerodia,
});

export const getGanhosFixos = () => api.get('/ganhos-fixos/');

export const getGanhoFixo = (id) => api.get(`/ganhos-fixos/${id}/`);

export const createGanhoFixo = (payload) => api.post('/ganhos-fixos/', normalizePayload(payload));

export const updateGanhoFixo = (id, payload) => api.patch(`/ganhos-fixos/${id}/`, normalizePayload(payload));

export const deleteGanhoFixo = (id) => api.delete(`/ganhos-fixos/${id}/`);
