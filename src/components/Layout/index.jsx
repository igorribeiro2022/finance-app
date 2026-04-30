import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { setThemeMode, setThemePalette, toggleSidebar } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import api from '../../services/api';
import { themeModeOptions, themePaletteOptions } from '../../styles/theme';

import {
  Wrapper,
  Sidebar,
  SidebarHeader,
  BrandMark,
  NavMenu,
  NavItem,
  SidebarFooter,
  Topbar,
  TopbarLeft,
  TopbarRight,
  FieldIcon,
  ThemeField,
  ThemeLabel,
  ThemeSelect,
  UserMenu,
  UserName,
  PageContent,
  Overlay,
  LogoutButton,
  CollapseButton,
} from './styles';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/categorias', label: 'Categorias', icon: '◌' },
  { to: '/gastos-fixos', label: 'Gastos Fixos', icon: '↓' },
  { to: '/ganhos-fixos', label: 'Ganhos Fixos', icon: '↑' },
  { to: '/eventuais', label: 'Eventuais', icon: '◎' },
  { to: '/calendario', label: 'Calendário', icon: '▣' },
  { to: '/vista-bancaria', label: 'Bancos', icon: '◈' },
  { to: '/casa', label: 'Casa', icon: '⌂' },
  { to: '/open-finance', label: 'Open Finance', icon: '⟳' },
];

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ui = useSelector((state) => state.ui || {});
  const auth = useSelector((state) => state.auth || {});

  const themePalette = themePaletteOptions.some((palette) => palette.value === ui.themePalette)
    ? ui.themePalette
    : 'emerald';
  const themeMode = themeModeOptions.some((option) => option.value === ui.themeMode)
    ? ui.themeMode
    : 'dark';
  const sidebarOpen = !!ui.sidebarOpen;
  const user = auth.user || null;
  const refreshToken = auth.refreshToken || '';

  const closeSidebar = () => {
    if (sidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (_) {
      // ignora erro de logout remoto
    } finally {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return (
    <Wrapper>
      <AnimatePresence>
        {sidebarOpen && (
          <Overlay onClick={closeSidebar} />
        )}
      </AnimatePresence>

      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <BrandMark>
            <span className="brand-chip">F</span>
            Finance
          </BrandMark>

          <CollapseButton
            onClick={closeSidebar}
            aria-label="Fechar menu"
            type="button"
          >
            ✕
          </CollapseButton>
        </SidebarHeader>

        <NavMenu>
          {navItems.map((item) => (
            <NavItem key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeSidebar}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </NavItem>
          ))}
        </NavMenu>

        <SidebarFooter>
          <LogoutButton onClick={handleLogout} type="button">
            <span className="icon">↩</span>
            <span>Sair</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <div style={{ flex: 1, minWidth: 0 }}>
        <Topbar>
          <TopbarLeft>
            <CollapseButton
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Abrir menu"
              type="button"
            >
              ☰
            </CollapseButton>
          </TopbarLeft>

          <TopbarRight>
            <ThemeField>
              <ThemeLabel aria-hidden="true" />
              <ThemeSelect
                aria-label="Selecionar paleta"
                value={themePalette}
                onChange={(event) => dispatch(setThemePalette(event.target.value))}
              >
                {themePaletteOptions.map((palette) => (
                  <option key={palette.value} value={palette.value}>
                    {palette.label}
                  </option>
                ))}
              </ThemeSelect>
            </ThemeField>

            <ThemeField>
              <FieldIcon aria-hidden="true">{themeMode === 'dark' ? '☾' : '☀'}</FieldIcon>
              <ThemeSelect
                aria-label="Selecionar modo de cor"
                value={themeMode}
                onChange={(event) => dispatch(setThemeMode(event.target.value))}
              >
                {themeModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </ThemeSelect>
            </ThemeField>

            <UserMenu>
              <UserName>{user?.nome?.split(' ')[0] ?? 'Usuário'}</UserName>
            </UserMenu>
          </TopbarRight>
        </Topbar>

        <PageContent>{children}</PageContent>
      </div>
    </Wrapper>
  );
}
