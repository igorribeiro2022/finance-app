import axios from 'axios';
import { store } from '../store';
import { updateAccessToken, logout } from '../store/authSlice';

const API_URL = 'https://web-production-defc2.up.railway.app';
const BASE_URL = process.env.REACT_APP_API_URL
  || (process.env.NODE_ENV === 'production' ? '/api' : API_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
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
      url.includes('/auth/register');

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
