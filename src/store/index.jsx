import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer, { UI_STORAGE_KEY } from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const { themeMode, themePalette } = store.getState().ui;

    try {
      window.localStorage.setItem(
        UI_STORAGE_KEY,
        JSON.stringify({ themeMode, themePalette })
      );
    } catch {
      // ignore storage failures
    }
  });
}
