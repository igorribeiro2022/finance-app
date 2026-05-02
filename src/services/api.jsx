import axios from 'axios';
import { store } from '../store';
import { updateAccessToken, logout } from '../store/authSlice';

const API_URL = 'https://web-production-defc2.up.railway.app';
const BASE_URL = process.env.REACT_APP_API_URL
  || (process.env.NODE_ENV === 'production' ? '/api' : API_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let pendingRequests = [];

function processQueue(error, token = null) {
  pendingRequests.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  pendingRequests = [];
}

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.accessToken;
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    config.headers = config.headers || {};

    if (token && !config.headers.Authorization && !config.headers.authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isFormData) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    } else if (!config.headers['Content-Type'] && !config.headers['content-type']) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Content-Type', 'application/json');
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/register') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password') ||
      url.includes('/auth/google') ||
      url.includes('/auth/apple');

    if (error.response.status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = store.getState().auth?.refreshToken;
    if (!refreshToken) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh || refreshToken;

      store.dispatch(
        updateAccessToken({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );

      processQueue(null, newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
