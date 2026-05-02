import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Icon from '../Icon';
import { toggleSidebar } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import api from '../../services/api';

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
  AccountMenu,
  AccountDropdown,
  AccountMenuDivider,
  AccountMenuHeader,
  AccountMenuHint,
  AccountMenuItem,
  AccountMenuTitle,
  AccountLogoutButton,
  UserMenu,
  UserAvatar,
  UserPhoto,
  UserName,
  UserMenuChevron,
  PageContent,
  Overlay,
  LogoutButton,
  CollapseButton,
} from './styles';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/gastos-fixos', label: 'Gastos Fixos', icon: 'expense' },
  { to: '/ganhos-fixos', label: 'Ganhos Fixos', icon: 'income' },
  { to: '/eventuais', label: 'Eventuais', icon: 'event' },
  { to: '/calendario', label: 'Calendario', icon: 'calendar' },
  { to: '/vista-bancaria', label: 'Bancos', icon: 'bank' },
  { to: '/casa', label: 'Casa', icon: 'home' },
  { to: '/open-finance', label: 'Open Finance', icon: 'openFinance' },
];

const accountItems = [
  { to: '/perfil', label: 'Perfil', icon: 'user' },
  { to: '/perfil?secao=preferencias', label: 'Preferencias', icon: 'settings' },
  { to: '/seguranca', label: 'Seguranca', icon: 'shield' },
  { to: '/membros-casa', label: 'Membros da casa', icon: 'people' },
];

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const accountMenuRef = useRef(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const ui = useSelector((state) => state.ui || {});
  const auth = useSelector((state) => state.auth || {});

  const sidebarOpen = !!ui.sidebarOpen;
  const user = auth.user || null;
  const refreshToken = auth.refreshToken || '';
  const profileSection = new URLSearchParams(location.search).get('secao');

  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [accountMenuOpen]);

  const closeSidebar = () => {
    if (sidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  const handleLogout = async () => {
    setAccountMenuOpen(false);
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

  const getAccountItemClassName = (item, isActive) => {
    if (item.to === '/perfil') {
      return location.pathname === '/perfil' && !profileSection ? 'active' : '';
    }

    if (item.to.startsWith('/perfil?secao=preferencias')) {
      return location.pathname === '/perfil' && profileSection === 'preferencias' ? 'active' : '';
    }

    return isActive ? 'active' : '';
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
            <Icon name="close" size={18} />
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
                <span className="icon"><Icon name={item.icon} size={18} /></span>
                <span>{item.label}</span>
              </NavLink>
            </NavItem>
          ))}
        </NavMenu>

        <SidebarFooter>
          <LogoutButton onClick={handleLogout} type="button">
            <span className="icon"><Icon name="logout" size={18} /></span>
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
              <Icon name="menu" size={20} />
            </CollapseButton>
          </TopbarLeft>

          <TopbarRight>
            <AccountMenu ref={accountMenuRef}>
              <UserMenu
                as="button"
                type="button"
                onClick={() => setAccountMenuOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
              >
                <UserAvatar>
                  {user?.foto_perfil_url ? (
                    <UserPhoto src={user.foto_perfil_url} alt="" />
                  ) : (
                    <Icon name="user" size={18} />
                  )}
                </UserAvatar>
                <UserName>{user?.nome?.split(' ')[0] ?? 'Usuario'}</UserName>
                <UserMenuChevron $open={accountMenuOpen}>
                  <Icon name="chevronDown" size={15} />
                </UserMenuChevron>
              </UserMenu>

              {accountMenuOpen && (
                <AccountDropdown role="menu">
                  <AccountMenuHeader>
                    <AccountMenuTitle>Minha conta</AccountMenuTitle>
                    <AccountMenuHint>{user?.email || 'Gerencie sua conta Finance'}</AccountMenuHint>
                  </AccountMenuHeader>

                  <AccountMenuDivider />

                  {accountItems.map((item) => (
                    <AccountMenuItem
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      className={({ isActive }) => getAccountItemClassName(item, isActive)}
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <span className="icon"><Icon name={item.icon} size={18} /></span>
                      <span>{item.label}</span>
                    </AccountMenuItem>
                  ))}

                  <AccountMenuDivider />

                  <AccountLogoutButton type="button" onClick={handleLogout} role="menuitem">
                    <span className="icon"><Icon name="logout" size={18} /></span>
                    <span>Sair</span>
                  </AccountLogoutButton>
                </AccountDropdown>
              )}
            </AccountMenu>
          </TopbarRight>
        </Topbar>

        <PageContent>{children}</PageContent>
      </div>
    </Wrapper>
  );
}
