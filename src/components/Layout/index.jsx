import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { setThemePalette, toggleSidebar, toggleTheme } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import api from '../../services/api';
import { themePaletteOptions } from '../../styles/theme';

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
  ThemeControls,
  PaletteSwatches,
  PaletteButton,
  ModeToggle,
  UserMenu,
  UserAvatar,
  UserName,
  PageContent,
  Overlay,
  LogoutButton,
  CollapseButton,
} from './styles';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'D' },
  { to: '/categorias', label: 'Categorias', icon: 'C' },
  { to: '/gastos-fixos', label: 'Gastos Fixos', icon: '-' },
  { to: '/ganhos-fixos', label: 'Ganhos Fixos', icon: '+' },
  { to: '/eventuais', label: 'Eventuais', icon: '*' },
  { to: '/calendario', label: 'Calendario', icon: 'Q' },
  { to: '/vista-bancaria', label: 'Bancos', icon: 'B' },
  { to: '/casa', label: 'Casa', icon: 'H' },
  { to: '/open-finance', label: 'Open Finance', icon: 'O' },
  { to: '/perfil', label: 'Perfil', icon: 'P' },
];

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ui = useSelector((state) => state.ui || {});
  const auth = useSelector((state) => state.auth || {});

  const themePalette = themePaletteOptions.some((palette) => palette.value === ui.themePalette)
    ? ui.themePalette
    : 'emerald';
  const themeMode = ui.themeMode === 'light' ? 'light' : 'dark';
  const sidebarOpen = !!ui.sidebarOpen;
  const user = auth.user || null;
  const refreshToken = auth.refreshToken || '';
  const userInitials = (user?.nome || user?.email || 'U')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

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
      // Ignora erro de logout remoto.
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
            x
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
            <span className="icon">S</span>
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
              =
            </CollapseButton>
          </TopbarLeft>

          <TopbarRight>
            <ThemeControls>
              <PaletteSwatches aria-label="Selecionar paleta">
                {themePaletteOptions.map((palette) => (
                  <PaletteButton
                    key={palette.value}
                    type="button"
                    title={palette.label}
                    aria-label={`Usar paleta ${palette.label}`}
                    $active={themePalette === palette.value}
                    $primary={palette.primary}
                    $secondary={palette.secondary}
                    onClick={() => dispatch(setThemePalette(palette.value))}
                  />
                ))}
              </PaletteSwatches>
              <ModeToggle type="button" onClick={() => dispatch(toggleTheme())}>
                {themeMode === 'dark' ? 'Dark' : 'Light'}
              </ModeToggle>
            </ThemeControls>

            <UserMenu as={NavLink} to="/perfil">
              <UserAvatar>{userInitials}</UserAvatar>
              <UserName>{user?.nome?.split(' ')[0] ?? 'Usuario'}</UserName>
            </UserMenu>
          </TopbarRight>
        </Topbar>

        <PageContent>{children}</PageContent>
      </div>
    </Wrapper>
  );
}
