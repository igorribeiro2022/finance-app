import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

// ── Layout ──────────────────────────────────────────────────────────────────

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

// ── Tabs de visualização ───────────────────────────────────────────────────

export const ViewTabs = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 3px;
  gap: 2px;
`;

export const ViewTab = styled.button`
  padding: 0.35rem 0.9rem;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ $active, theme }) => $active ? theme.colors.surface : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textMuted};
  box-shadow: ${({ $active, theme }) => $active ? `0 1px 4px ${theme.colors.shadow}` : 'none'};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

// ── Barra de navegação + filtros ───────────────────────────────────────────

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  height: 32px;
  padding: 0 0.75rem;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  font-weight: ${({ $today }) => $today ? '700' : '500'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $today, theme }) => $today ? theme.colors.primary : theme.colors.surface};
  color: ${({ $today, theme }) => $today ? theme.colors.textInverse : theme.colors.text};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ $today, theme }) => $today ? theme.colors.primaryHover : theme.colors.surfaceOffset};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PeriodLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  min-width: 100px;
`;

export const FilterChip = styled.button`
  height: 28px;
  padding: 0 0.75rem;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1.5px solid ${({ $active, $color, theme }) =>
    $active
      ? $color === 'income' ? theme.colors.success
      : $color === 'expense' ? theme.colors.error
      : theme.colors.primary
      : theme.colors.border};
  background: ${({ $active, $color, theme }) =>
    $active
      ? $color === 'income' ? `${theme.colors.success}18`
      : $color === 'expense' ? `${theme.colors.error}18`
      : theme.colors.primaryHighlight
      : 'transparent'};
  color: ${({ $active, $color, theme }) =>
    $active
      ? $color === 'income' ? theme.colors.success
      : $color === 'expense' ? theme.colors.error
      : theme.colors.primary
      : theme.colors.textMuted};
  transition: ${({ theme }) => theme.transition};

  &:hover { opacity: 0.8; }
`;

export const Legend = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $color }) =>
    $color === 'income' ? theme.colors.success : theme.colors.error};
`;

// ── Visão Mês ───────────────────────────────────────────────────────────────

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: ${({ $header }) => $header ? '2px' : '0'};
`;

export const DayHeader = styled.div`
  padding: 0.4rem 0;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const DayCell = styled.div`
  min-height: 90px;
  padding: 0.4rem 0.35rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $today, $selected }) =>
    $selected ? theme.colors.primaryHighlight
    : $today   ? theme.colors.surface2
    : theme.colors.surface};
  border: 1.5px solid ${({ theme, $today, $selected }) =>
    $selected ? theme.colors.primary
    : $today   ? `${theme.colors.primary}60`
    : theme.colors.border};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    min-height: 64px;
    padding: 0.3rem 0.2rem;
  }

  @media (max-width: 480px) {
    min-height: 48px;
    padding: 0.25rem 0.15rem;
  }
`;

export const DayEmpty = styled.div`
  min-height: 90px;
  border-radius: ${({ theme }) => theme.radius.md};

  @media (max-width: 768px) { min-height: 64px; }
  @media (max-width: 480px) { min-height: 48px; }
`;

export const DayNumber = styled.span`
  font-size: 0.8rem;
  font-weight: ${({ $today }) => $today ? '800' : '500'};
  color: ${({ theme, $today }) => $today ? theme.colors.primary : theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $today, theme }) => $today ? `${theme.colors.primary}18` : 'transparent'};
  margin-bottom: 1px;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    width: 18px;
    height: 18px;
  }
`;

export const EventChip = styled.div`
  width: 100%;
  padding: 0.12rem 0.35rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  background: ${({ $color }) => $color === 'income' ? '#437a22' : $color === 'expense' ? '#a12c7b' : '#888'};
  color: #fff;

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 0.08rem 0.25rem;
  }
`;

export const OverflowChip = styled.div`
  font-size: 0.63rem;
  color: ${({ theme }) => theme.colors.textFaint};
  padding: 0 0.2rem;
  font-weight: 500;
`;

// ── Visão Semana ────────────────────────────────────────────────────────────

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  min-height: 400px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
  }
`;

export const WeekDayCol = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme, $today, $selected }) =>
    $selected ? theme.colors.primary
    : $today   ? `${theme.colors.primary}60`
    : theme.colors.border};
  background: ${({ theme, $today, $selected }) =>
    $selected ? theme.colors.primaryHighlight
    : $today   ? theme.colors.surface2
    : theme.colors.surface};
  overflow: hidden;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const WeekDayHeader = styled.div`
  padding: 0.5rem 0.4rem 0.35rem;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  background: ${({ $today, theme }) => $today ? `${theme.colors.primary}10` : 'transparent'};
`;

export const WeekDayName = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const WeekDayNumber = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${({ $today, theme }) => $today ? theme.colors.primary : theme.colors.text};
  margin-top: 2px;

  @media (max-width: 768px) { font-size: 0.9rem; }
`;

export const WeekEventBlock = styled.div`
  margin: 3px 4px;
  padding: 0.25rem 0.4rem;
  border-radius: 5px;
  font-size: 0.7rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: ${({ $color }) => $color === 'income' ? '#437a22' : $color === 'expense' ? '#a12c7b' : '#888'};
  color: #fff;
  overflow: hidden;

  @media (max-width: 768px) { font-size: 0.6rem; padding: 0.2rem 0.3rem; }
`;

// ── Visão Dia ───────────────────────────────────────────────────────────────

export const DayView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0;
`;

export const DayViewDate = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  background: ${({ $color }) => $color === 'income' ? '#437a22' : $color === 'expense' ? '#a12c7b' : '#888'};
`;

export const TimelineInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TimelineDesc = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const TimelineMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const TimelineValue = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $color, theme }) =>
    $color === 'income' ? theme.colors.success
    : $color === 'expense' ? theme.colors.error
    : theme.colors.text};
`;

// ── Visão Ano ───────────────────────────────────────────────────────────────

export const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 768px)  { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
`;

export const YearMonthCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0.75rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }
`;

export const YearMonthTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

export const YearMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
`;

export const YearMiniDay = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  font-weight: ${({ $today }) => $today ? '800' : '400'};
  color: ${({ theme, $today, $header }) =>
    $header ? theme.colors.textFaint
    : $today ? theme.colors.primary
    : theme.colors.text};
  border-radius: 3px;
  background: ${({ $hasIncome, $hasExpense, $today }) =>
    $today ? 'rgba(89,61,45,0.15)'
    : $hasIncome && $hasExpense ? 'linear-gradient(135deg, #437a2240 50%, #a12c7b40 50%)'
    : $hasIncome ? '#437a2230'
    : $hasExpense ? '#a12c7b30'
    : 'transparent'};
  position: relative;
`;

// ── Painel de detalhes ──────────────────────────────────────────────────────

export const DetailPanel = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const DetailDate = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.75rem;
`;

export const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0.85rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) =>
    $color === 'income' ? 'rgba(67,122,34,0.07)'
    : $color === 'expense' ? 'rgba(161,44,123,0.07)'
    : 'transparent'};
  border-left: 3px solid ${({ $color }) =>
    $color === 'income' ? '#437a22'
    : $color === 'expense' ? '#a12c7b'
    : '#888'};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

export const DetailItemInfo = styled.div` flex: 1; min-width: 0; `;

export const DetailItemDesc = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const DetailItemMeta = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const DetailItemValue = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $color, theme }) =>
    $color === 'income' ? theme.colors.success
    : $color === 'expense' ? theme.colors.error
    : theme.colors.text};
`;

// ── Utilitários ──────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textFaint};
  text-align: center;
`;

export const SkeletonCell = styled.div`
  min-height: 90px;
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
  background: rgba(217,7,7,0.08);
  border: 1px solid rgba(217,7,7,0.2);
  color: ${({ theme }) => theme.colors.error};
`;