import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'finance_auth';
const EXPIRY_DAYS = 20;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.expiry || Date.now() > parsed.expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data,
      expiry: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    }));
  } catch {}
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

const persisted = loadFromStorage();

const initialState = persisted ?? {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      saveToStorage({
        user: action.payload.user,
        accessToken: action.payload.access,
        refreshToken: action.payload.refresh,
        isAuthenticated: true,
      });
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      saveToStorage({
        user: state.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
      });
    },
    updateUser: (state, action) => {
      state.user = { ...(state.user || {}), ...(action.payload || {}) };
      saveToStorage({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      });
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearStorage();
    },
  },
});

export const { setCredentials, updateAccessToken, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
