import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
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
  UserMenu,
  UserAvatar,
  UserPhoto,
  UserName,
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

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ui = useSelector((state) => state.ui || {});
  const auth = useSelector((state) => state.auth || {});

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
            <UserMenu as={NavLink} to="/perfil">
              <UserAvatar>
                {user?.foto_perfil_url ? (
                  <UserPhoto src={user.foto_perfil_url} alt="" />
                ) : (
                  <Icon name="user" size={18} />
                )}
              </UserAvatar>
              <UserName>{user?.nome?.split(' ')[0] ?? 'Usuario'}</UserName>
            </UserMenu>
          </TopbarRight>
        </Topbar>

        <PageContent>{children}</PageContent>
      </div>
    </Wrapper>
  );
}
