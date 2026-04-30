import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import AppRoutes from './routes';
import GlobalStyles from './styles/GlobalStyles';
import { getTheme } from './styles/theme';

function App() {
  const themePalette = useSelector((state) => state.ui.themePalette);
  const themeMode = useSelector((state) => state.ui.themeMode);
  const theme = getTheme(themePalette, themeMode);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
