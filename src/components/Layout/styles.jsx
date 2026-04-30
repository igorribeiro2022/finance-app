import styled from 'styled-components';

const SIDEBAR_WIDTH = '240px';

export const Wrapper = styled.div`
  display: flex;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.bg};
  position: relative;
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
  position: sticky;
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
      font-size: 1rem;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
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
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
`;

export const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`;
