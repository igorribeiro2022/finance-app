import { css } from 'styled-components';

export const glassPanel = css`
  background: ${({ theme }) => theme.colors.glassBg};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
`;

export const glassPanelElevated = css`
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
`;

export const glassInsetHighlight = css`
  box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.glassHighlight};
`;

export const gradientPrimaryButton = css`
  background: ${({ theme }) => theme.colors.gradientCTA};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  box-shadow: 0 12px 24px ${({ theme }) => theme.colors.shadow};
  transition: ${({ theme }) => theme.transition};

  &:hover:not(:disabled) {
    filter: brightness(1.04);
    transform: translateY(-1px);
  }
`;
