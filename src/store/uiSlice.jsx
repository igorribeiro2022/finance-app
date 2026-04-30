import { createSlice } from '@reduxjs/toolkit';

export const UI_STORAGE_KEY = 'finance-app-ui';

function loadStoredUi() {
  if (typeof window === 'undefined') return {};

  try {
    const rawValue = window.localStorage.getItem(UI_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

const storedUi = loadStoredUi();

const initialState = {
  themeMode: storedUi.themeMode === 'light' ? 'light' : 'dark',
  themePalette: typeof storedUi.themePalette === 'string' ? storedUi.themePalette : 'emerald',
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload === 'light' ? 'light' : 'dark';
    },
    setThemePalette: (state, action) => {
      state.themePalette = typeof action.payload === 'string' ? action.payload : state.themePalette;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleTheme, setThemeMode, setThemePalette, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
