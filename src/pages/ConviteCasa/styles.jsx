import styled, { keyframes } from 'styled-components';
import { glassPanelElevated, gradientPrimaryButton } from '../../styles/mixins';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const InvitePage = styled.main`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.bg};
`;

export const InviteCard = styled.section`
  ${glassPanelElevated}
  width: 100%;
  max-width: 440px;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  animation: ${fadeUp} 0.25s ease;
`;

export const InviteTitle = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

export const InviteText = styled.p`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
`;

export const InviteButton = styled.button`
  ${gradientPrimaryButton}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0.65rem 1.1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
`;
