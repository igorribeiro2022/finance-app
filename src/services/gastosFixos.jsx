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

export const getGastosFixos = () => api.get('/gastos-fixos/');

export const getGastoFixo = (id) => api.get(`/gastos-fixos/${id}/`);

export const createGastoFixo = (payload) => api.post('/gastos-fixos/', normalizePayload(payload));

export const updateGastoFixo = (id, payload) => api.patch(`/gastos-fixos/${id}/`, normalizePayload(payload));

export const deleteGastoFixo = (id) => api.delete(`/gastos-fixos/${id}/`);
