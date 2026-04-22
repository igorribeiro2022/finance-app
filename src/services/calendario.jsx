import api from './api';

export const getCalendario = (mes, ano) =>
  api.get('/calendario/', { params: { mes, ano } });