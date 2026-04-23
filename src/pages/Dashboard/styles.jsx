import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.25rem;
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const KpiCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadowMd};
    transform: translateY(-1px);
  }
`;

export const KpiIcon = styled.span`
  font-size: 1.1rem;
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success :
    $type === 'expense' ? theme.colors.error :
    theme.colors.textMuted};
`;

export const KpiLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const KpiValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success :
    $type === 'expense' ? theme.colors.error :
    theme.colors.text};
  font-variant-numeric: tabular-nums;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
`;

export const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
  grid-column: ${({ $wide }) => $wide ? '1 / -1' : 'auto'};
`;

export const ChartTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

export const AgendaCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
`;

export const AgendaTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

export const AgendaList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const AgendaItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme, $type }) =>
    $type === 'income'
      ? `rgba(40, 191, 17, 0.06)`
      : `rgba(217, 7, 7, 0.06)`};
  border: 1px solid ${({ theme, $type }) =>
    $type === 'income'
      ? `rgba(40, 191, 17, 0.15)`
      : `rgba(217, 7, 7, 0.15)`};
`;

export const AgendaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const AgendaDesc = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const AgendaDate = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $proximity }) =>
    $proximity === 'Hoje' ? '#D90707' :
    $proximity === 'Amanhã' ? '#A6806A' :
    '#593D2D'};
`;

export const AgendaValue = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $type }) =>
    $type === 'income' ? theme.colors.success : theme.colors.error};
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
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  height: ${({ $tall }) => $tall ? '280px' : '100px'};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

export const KpiDelta = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $positive, theme }) => $positive ? theme.colors.success : theme.colors.error};
`;