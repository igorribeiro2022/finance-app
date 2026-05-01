import api from './api';

export const getMe = () => api.get('/auth/me/');
export const patchMe = (body) => api.patch('/auth/me/', body);
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('foto', file);

  return api.post('/auth/avatar/', formData);
};
export const deleteAvatar = () => api.delete('/auth/avatar/');
