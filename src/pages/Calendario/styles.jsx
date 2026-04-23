import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const PageHeader = styled.div`
  margin-bottom: 1rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.2rem;
`;

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

export const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transition};
  background: ${({ theme }) => theme.colors.surface};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const MonthLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  min-width: 160px;
  text-align: center;
`;

export const Legend = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

export const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $color }) =>
    $color === 'income' ? theme.colors.success : theme.colors.error};
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: ${({ $header }) => $header ? '2px' : '0'};
`;

export const DayCell = styled.div`
  min-height: ${({ $header }) => $header ? 'auto' : '80px'};
  padding: ${({ $header }) => $header ? '0.5rem 0.25rem' : '0.5rem'};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $today, $selected }) =>
    $selected
      ? theme.colors.primaryHighlight
      : $today
        ? theme.colors.surface2
        : theme.colors.surface};
  border: 1.5px solid ${({ theme, $today, $selected }) =>
    $selected
      ? theme.colors.primary
      : $today
        ? theme.colors.primary + '60'
        : theme.colors.border};
  cursor: ${({ $header }) => $header ? 'default' : 'pointer'};
  transition: ${({ theme }) => theme.transition};
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    background: ${({ theme, $header }) => !$header && theme.colors.surfaceOffset};
    border-color: ${({ theme, $header }) => !$header && theme.colors.primary};
  }
`;

export const DayEmpty = styled.div`
  min-height: 80px;
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const DayNumber = styled.span`
  font-size: ${({ $header }) => $header ? '0.75rem' : '0.875rem'};
  font-weight: ${({ $today, $header }) => $today || $header ? '700' : '500'};
  color: ${({ theme, $today, $header }) =>
    $header
      ? theme.colors.textMuted
      : $today
        ? theme.colors.primary
        : theme.colors.text};
  text-align: ${({ $header }) => $header ? 'center' : 'left'};
  display: block;
`;

export const EventList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  align-items: center;
`;

export const EventValue = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ theme, $color }) =>
    $color === 'income'
      ? theme.colors.success
      : $color === 'expense'
        ? theme.colors.error
        : theme.colors.text};
`;

export const EmptyDay = styled.div`
  flex: 1;
`;

export const SkeletonCell = styled.div`
  min-height: 80px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceOffset} 25%,
    ${({ theme }) => theme.colors.surface2} 50%,
    ${({ theme }) => theme.colors.surfaceOffset} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const ErrorBanner = styled.div`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ $info }) => $info ? 'rgba(0,100,148,0.08)' : 'rgba(217,7,7,0.08)'};
  border: 1px solid ${({ $info }) => $info ? 'rgba(0,100,148,0.2)' : 'rgba(217,7,7,0.2)'};
  color: ${({ theme, $info }) => $info ? theme.colors.blue : theme.colors.error};
`;

export const EventChip = styled.div`
  display: block;
  width: 100%;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  line-height: 1.4;

  ${({ $color }) =>
    $color === 'income' && `
      background: #437a22;
      color: #fff;
    `}

  ${({ $color }) =>
    $color === 'expense' && `
      background: #a12c7b;
      color: #fff;
    `}

  ${({ $overflow }) =>
    $overflow && `
      background: transparent;
      color: inherit;
      opacity: 0.5;
      font-size: 0.65rem;
      padding-left: 0.2rem;
    `}
`;