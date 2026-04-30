import api from './api';

export const getConsolidado   = (params) => api.get('/bancos/consolidado', { params });
export const getTransacoes    = (params) => api.get('/bancos/transacoes',  { params });
