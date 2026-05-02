import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SIDEBAR_WIDTH = '240px';

export const Wrapper = styled.div`
  display: flex;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.bg};
  position: relative;
  overflow-x: hidden;

  @media (min-width: 769px) {
    padding-left: ${SIDEBAR_WIDTH};
  }
`;

export const Overlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(8px);
  z-index: 99;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const Sidebar = styled.aside`
  width: ${SIDEBAR_WIDTH};
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border-right: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100dvh;
  flex-shrink: 0;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.glassBorder};
`;

export const BrandMark = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 1.1rem;

  .brand-chip {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.primaryHighlight};
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.glassBorder};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.glassHighlight};
  }
`;

export const NavMenu = styled.ul`
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
`;

export const NavItem = styled.li`
  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textMuted};
    transition: ${({ theme }) => theme.transition};

    .icon {
      width: 20px;
      height: 20px;
      text-align: center;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.surfaceOffset};
      color: ${({ theme }) => theme.colors.text};
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.primaryHighlight};
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
    }
  }
`;

export const SidebarFooter = styled.div`
  padding: 1rem 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.glassBorder};
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 100%;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: rgba(217, 7, 7, 0.08);
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const Topbar = styled.header`
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.glassBg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.glassBorder};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  position: sticky;
  top: 0;
  z-index: 50;

  @media (max-width: 768px) {
    padding: 0.65rem 1rem;
  }
`;

export const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const AccountMenu = styled.div`
  position: relative;
  display: inline-flex;
`;

export const CollapseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceOffset};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ThemeControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.glassHighlight};
`;

export const PaletteSwatches = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const PaletteButton = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.glassBorder};
  background: linear-gradient(135deg, ${({ $primary }) => $primary} 0%, ${({ $secondary }) => $secondary} 100%);
  box-shadow: ${({ $active, theme }) => $active ? `0 0 0 3px ${theme.colors.primaryHighlight}` : 'none'};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-1px);
  }
`;

export const ModeToggle = styled.button`
  min-width: 56px;
  padding: 0.35rem 0.65rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.surfaceOffset};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHighlight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ThemeField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.35rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.glassHighlight};
`;

export const ThemeLabel = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradientCTA};
  box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryHighlight};
  flex-shrink: 0;
`;

export const FieldIcon = styled.span`
  font-size: 0.8rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

export const ThemeSelect = styled.select`
  min-width: 108px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  outline: none;
  transition: ${({ theme }) => theme.transition};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.28rem 0.75rem 0.28rem 0.32rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
  }
`;

export const UserMenuChevron = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${({ theme }) => theme.transition};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;

export const UserAvatar = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primaryHighlight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.7rem;
  font-weight: 800;
  overflow: hidden;
`;

export const UserPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const AccountDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 0.6rem);
  width: min(290px, calc(100vw - 2rem));
  padding: 0.55rem;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  z-index: 90;
`;

export const AccountMenuHeader = styled.div`
  padding: 0.8rem 0.85rem 0.7rem;
`;

export const AccountMenuTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.82rem;
  font-weight: 900;
`;

export const AccountMenuHint = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.74rem;
  margin-top: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AccountMenuDivider = styled.div`
  height: 1px;
  margin: 0.35rem 0.25rem;
  background: ${({ theme }) => theme.colors.glassBorder};
`;

export const AccountMenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.72rem 0.85rem;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.86rem;
  font-weight: 750;
  text-decoration: none;
  transition: ${({ theme }) => theme.transition};

  .icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
  }

  &:hover,
  &.active {
    background: ${({ theme }) => theme.colors.primaryHighlight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const AccountLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.72rem 0.85rem;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.86rem;
  font-weight: 750;
  transition: ${({ theme }) => theme.transition};

  .icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: rgba(217, 7, 7, 0.08);
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const PageContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-x: hidden;
  position: relative;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.85rem;
  }
`;
