import api from './api';

export const getCategorias = (params = {}) =>
  api.get('/categorias/', { params });

export const createCategoria = (payload) =>
  api.post('/categorias/', payload);

export const updateCategoria = (id, payload) =>
  api.patch(`/categorias/${id}/`, payload);

export const deleteCategoria = (id, transferToId) =>
  api.delete(`/categorias/${id}/`, {
    data: transferToId ? { transfer_to_id: transferToId } : undefined,
  });
