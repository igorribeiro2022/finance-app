import styled from 'styled-components';
import { glassPanel, glassPanelElevated } from '../../styles/mixins';

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 2rem 3rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(1.35rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 0.25rem;
`;

export const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const SecurityCard = styled.section`
  ${glassPanel}
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  border-radius: 18px;
  padding: 1.1rem;
`;

export const SecurityIcon = styled.span`
  ${glassPanelElevated}
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

export const SecurityCardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.98rem;
  font-weight: 850;
  margin-bottom: 0.35rem;
`;

export const SecurityCardText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
  line-height: 1.55;
`;

export const StatusPill = styled.span`
  display: inline-flex;
  margin-top: 0.8rem;
  padding: 0.28rem 0.55rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primaryHighlight};
  border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.72rem;
  font-weight: 850;
`;
