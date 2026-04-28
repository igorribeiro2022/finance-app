import api from './api';

const BANK_ENDPOINTS = [
  '/open-finance/banks/',
  '/open-finance/institutions/',
  '/open-finance/instituicoes/',
  '/open-finance/providers/',
];

function hasNestedArray(payload, visited = new Set()) {
  if (Array.isArray(payload)) return payload.length > 0;
  if (!payload || typeof payload !== 'object' || visited.has(payload)) return false;

  visited.add(payload);

  for (const value of Object.values(payload)) {
    if (Array.isArray(value) && value.length > 0) return true;
  }

  for (const value of Object.values(payload)) {
    if (value && typeof value === 'object' && hasNestedArray(value, visited)) return true;
  }

  return false;
}

export const getBanks = async () => {
  let firstSuccessfulResponse = null;
  let lastError = null;

  for (const endpoint of BANK_ENDPOINTS) {
    try {
      const response = await api.get(endpoint);

      if (!firstSuccessfulResponse) {
        firstSuccessfulResponse = response;
      }

      if (hasNestedArray(response.data)) {
        return response;
      }
    } catch (error) {
      lastError = error;

      if (error?.response?.status && error.response.status !== 404) {
        throw error;
      }
    }
  }

  if (firstSuccessfulResponse) {
    return firstSuccessfulResponse;
  }

  throw lastError;
};

export const getConsents = () => api.get('/open-finance/consent/');
export const createConsent = (data) => api.post('/open-finance/consent/', data);
export const revokeConsent = (id) => api.delete(`/open-finance/consent/${id}/`);
export const getAccounts = () => api.get('/open-finance/accounts/');
export const syncAccounts = () => api.post('/open-finance/sync/');
export const getTransactions = (params) => api.get('/open-finance/transactions/', { params });
