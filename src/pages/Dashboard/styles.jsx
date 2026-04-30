import styled, { keyframes } from 'styled-components';
import { glassPanel, glassPanelElevated } from '../../styles/mixins';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const DashboardShell = styled.div`
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  overflow-x: hidden;
`;

export const HeroPanel = styled.section`
  ${glassPanelElevated}
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  background-image:
    radial-gradient(circle at 12% 88%, ${({ theme }) => `${theme.colors.accent}22`} 0%, transparent 28%),
    radial-gradient(circle at 84% 16%, ${({ theme }) => `${theme.colors.primary}24`} 0%, transparent 30%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.glassBgElevated}, ${({ theme }) => theme.colors.surface});
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.35rem, 2.6vw, 2rem);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.75fr);
  gap: 1rem;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: grid;
  gap: 1rem;
  min-width: 0;
`;

export const SideColumn = styled.div`
  display: grid;
  gap: 1rem;
  min-width: 0;
`;

export const BalanceCard = styled.div`
  ${glassPanel}
  border-radius: 24px;
  padding: clamp(1rem, 2vw, 1.4rem);
  min-height: 210px;
`;

export const BalanceLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 800;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const BalanceValue = styled.div`
  color: ${({ theme, $negative }) => $negative ? theme.colors.error : theme.colors.text};
  font-size: clamp(2.1rem, 6vw, 4rem);
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.08em;
  margin: 0.6rem 0 1rem;
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

export const QuickPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.82rem;
  font-weight: 800;
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const KpiCard = styled.div`
  ${glassPanel}
  border-radius: 20px;
  padding: 1rem;
  min-width: 0;
`;

export const KpiIcon = styled.div`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${({ theme, $type }) =>
    $type === 'income' ? `${theme.colors.success}18`
    : $type === 'expense' ? `${theme.colors.error}18`
    : theme.colors.primaryHighlight};
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success
    : $type === 'expense' ? theme.colors.error
    : theme.colors.primary};
  margin-bottom: 0.7rem;
`;

export const KpiLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
  font-weight: 800;
`;

export const KpiValue = styled.div`
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success
    : $type === 'expense' ? theme.colors.error
    : theme.colors.text};
  font-size: 1.2rem;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
`;

export const ChartCard = styled.div`
  ${glassPanel}
  border-radius: 24px;
  padding: 1rem;
  min-width: 0;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const ChartTitle = styled.h2`
  font-size: 1rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
`;

export const SideCard = styled.div`
  ${glassPanel}
  border-radius: 24px;
  padding: 1rem;
`;

export const Gauge = styled.div`
  width: 172px;
  height: 92px;
  margin: 1rem auto 0.25rem;
  border-radius: 180px 180px 0 0;
  background:
    radial-gradient(circle at bottom, ${({ theme }) => theme.colors.surface} 0 52%, transparent 53%),
    conic-gradient(from 225deg, ${({ theme }) => theme.colors.success} 0deg, ${({ theme }) => theme.colors.warning} ${({ $value }) => Math.min($value * 1.8, 180)}deg, ${({ theme }) => theme.colors.surfaceOffset} 0deg);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const GaugeValue = styled.div`
  transform: translateY(14px);
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  font-weight: 950;
`;

export const AgendaList = styled.div`
  display: grid;
  gap: 0.55rem;
`;

export const AgendaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
`;

export const AgendaIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${({ theme, $type }) => $type === 'income' ? `${theme.colors.success}16` : `${theme.colors.error}16`};
  color: ${({ theme, $type }) => $type === 'income' ? theme.colors.success : theme.colors.error};
`;

export const AgendaInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

export const AgendaDesc = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.86rem;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AgendaDate = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
`;

export const AgendaValue = styled.div`
  color: ${({ theme, $type }) => $type === 'income' ? theme.colors.success : theme.colors.error};
  font-size: 0.82rem;
  font-weight: 900;
  white-space: nowrap;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 0.875rem;
`;

export const SkeletonCard = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceOffset} 25%,
    ${({ theme }) => theme.colors.surface2} 50%,
    ${({ theme }) => theme.colors.surfaceOffset} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 24px;
  min-height: ${({ $tall }) => $tall ? '260px' : '118px'};
`;

export const SkeletonText = styled.div`
  height: ${({ $h }) => $h || '14px'};
  width: ${({ $w }) => $w || '100%'};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.divider};
`;

export const ErrorBanner = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: rgba(217, 7, 7, 0.08);
  border: 1px solid rgba(217, 7, 7, 0.2);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;
