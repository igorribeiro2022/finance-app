import api from './api';

export const getCasa            = ()         => api.get('/casa/');
export const postCasa           = (body)     => api.post('/casa/', body);
export const deleteCasa         = ()         => api.delete('/casa/');
export const postCasaSair       = ()         => api.post('/casa/sair/');
export const getCasaDashboard   = ()         => api.get('/casa/dashboard/');
export const getCasaMetas       = ()         => api.get('/casa/metas/');
export const postCasaMeta       = (body)     => api.post('/casa/metas/', body);
export const patchCasaMeta      = (id, body) => api.patch(`/casa/metas/${id}/`, body);
export const deleteCasaMeta     = (id)       => api.delete(`/casa/metas/${id}/`);
export const postConvite        = (body)     => api.post('/casa/convite/', body);
export const postAceitarConvite = (token)    => api.post(`/casa/convite/${token}/aceitar/`);
export const deleteCasaMembro   = (id)       => api.delete(`/casa/membros/${id}/`);
