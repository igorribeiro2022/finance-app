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
  background: rgba(38, 28, 20, 0.4);
  z-index: 99;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const Sidebar = styled.aside`
  width: ${SIDEBAR_WIDTH};
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.divider};
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

export const BrandMark = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 1.1rem;
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
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
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
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
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
  gap: 1rem;
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

export const ThemeToggle = styled.button`
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

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`;