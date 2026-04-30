import styled, { keyframes } from 'styled-components';

/* ── Animações ───────────────────────────────────────────────────── */
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ── Layout base ─────────────────────────────────────────────────── */
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
  position: relative;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

export const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* ── Tabs ────────────────────────────────────────────────────────── */
export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
  padding-bottom: 0.125rem;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

export const Tab = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: ${({ active }) => (active ? '600' : '500')};
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.textMuted)};
  border-bottom: 2px solid ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  white-space: nowrap;
  transition: ${({ theme }) => theme.transition};
  margin-bottom: -1px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

/* ── Cards ───────────────────────────────────────────────────────── */
export const Card = styled.div`
  background: ${({ theme }) => theme.colors.glassBg};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const CardAction = styled.button`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: ${({ theme }) => theme.transition};
  &:hover { opacity: 0.75; }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthCard = styled(Card)`
  grid-column: 1 / -1;
`;

/* ── Hero de insight ─────────────────────────────────────────────── */
export const InsightHero = styled.div`
  background: ${({ theme }) => theme.colors.gradientAI};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.glassHighlight} 0%, transparent 100%);
    pointer-events: none;
  }
`;

export const InsightIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryHighlight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

export const InsightText = styled.div`
  flex: 1;
`;

export const InsightTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const InsightDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

export const InsightMeta = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textFaint};
  margin-top: 0.5rem;
  display: block;
`;

/* ── KPI Cards ───────────────────────────────────────────────────── */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const KpiCard = styled(Card)`
  padding: 1rem;
`;

export const KpiLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

export const KpiValue = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
`;

export const KpiVariation = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ positive, theme }) => (positive ? theme.colors.success : theme.colors.error)};
  margin-top: 0.25rem;
`;

/* ── Contas ──────────────────────────────────────────────────────── */
export const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const AccountItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.glassHighlight};
`;

export const AccountLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const AccountLogo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const AccountName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const AccountType = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const AccountBalance = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
`;

export const TotalBalance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TotalLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TotalValue = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
`;

/* ── Consentimentos ──────────────────────────────────────────────── */
export const ConsentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ConsentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  gap: 0.75rem;
  box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.glassHighlight};
`;

export const ConsentInfo = styled.div`
  flex: 1;
`;

export const ConsentBank = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const ConsentExpiry = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const ConsentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ status, theme }) => {
    if (status === 'ativo') return theme.colors.success + '22';
    if (status === 'expirado') return theme.colors.accent + '22';
    return theme.colors.error + '22';
  }};
  color: ${({ status, theme }) => {
    if (status === 'ativo') return theme.colors.success;
    if (status === 'expirado') return theme.colors.accent;
    return theme.colors.error;
  }};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    display: inline-block;
  }
`;

/* ── Transações ──────────────────────────────────────────────────── */
export const TransactionGroup = styled.div`
  margin-bottom: 1rem;
  &:last-child { margin-bottom: 0; }
`;

export const TransactionDate = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

export const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  gap: 0.75rem;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
  }
`;

export const TransactionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

export const TransactionIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ type, theme }) =>
    type === 'credito' || type === 'transfer_in'
      ? theme.colors.success + '20'
      : theme.colors.primaryHighlight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
`;

export const TransactionDesc = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TransactionCategory = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 1px;
`;

export const TransactionValue = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ type, theme }) =>
    type === 'credito' || type === 'transfer_in'
      ? theme.colors.success
      : theme.colors.text};
`;

/* ── Filtros ─────────────────────────────────────────────────────── */
export const FiltersRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FilterInput = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transition};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

/* ── Bancos disponíveis ──────────────────────────────────────────── */
export const BanksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
`;

export const BankCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  text-align: center;
  transition: ${({ theme }) => theme.transition};
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 12px 30px ${({ theme }) => theme.colors.shadowMd};
  }
`;

export const BankLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
  }
`;

export const BankName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const BankStatus = styled.p`
  font-size: 0.75rem;
  color: ${({ connected, theme }) => (connected ? theme.colors.success : theme.colors.textMuted)};
  font-weight: ${({ connected }) => (connected ? '600' : '400')};
`;

/* ── Botões ──────────────────────────────────────────────────────── */
export const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.gradientCTA};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  white-space: nowrap;
  box-shadow: 0 12px 24px ${({ theme }) => theme.colors.shadow};

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const DangerBtn = styled(SecondaryBtn)`
  &:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

/* ── Spinner ─────────────────────────────────────────────────────── */
export const SpinnerIcon = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

/* ── Skeleton ────────────────────────────────────────────────────── */
export const SkeletonBlock = styled.div`
  height: ${({ h }) => h || '16px'};
  width: ${({ w }) => w || '100%'};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceOffset} 25%,
    ${({ theme }) => theme.colors.surface2} 50%,
    ${({ theme }) => theme.colors.surfaceOffset} 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

/* ── Empty state ─────────────────────────────────────────────────── */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1.5rem;
  gap: 0.75rem;
`;

export const EmptyIcon = styled.div`
  font-size: 36px;
  opacity: 0.5;
`;

export const EmptyTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 32ch;
  line-height: 1.5;
`;

/* ── Erro ────────────────────────────────────────────────────────── */
export const ErrorBanner = styled.div`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  font-weight: 500;
`;

/* ── Modal ───────────────────────────────────────────────────────── */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
`;

export const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.glassBgElevated};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.2s ease;
  box-shadow: ${({ theme }) => theme.colors.glassShadow};
  backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBackdrop};
`;

export const ModalTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

export const ModalText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  margin-bottom: 1.25rem;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

/* ── Heatmap ─────────────────────────────────────────────────────── */
export const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const HeatmapDayLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding-bottom: 0.25rem;
  font-weight: 500;
`;

export const HeatmapCell = styled.div`
  aspect-ratio: 1;
  border-radius: 4px;
  background: ${({ intensity, theme }) => {
    if (!intensity) return theme.colors.border;
    const hex = theme.colors.primary;
    const alpha = Math.min(0.15 + intensity * 0.75, 0.9);
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return hex + alphaHex;
  }};
  cursor: ${({ hasData }) => (hasData ? 'pointer' : 'default')};
  position: relative;
  transition: ${({ theme }) => theme.transition};

  &:hover { opacity: 0.75; }
`;

export const HeatmapSummary = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const HeatmapStat = styled.div``;

export const HeatmapStatLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const HeatmapStatValue = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.bg};
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  pointer-events: none;
  z-index: 10;
`;

/* ── Categorias ──────────────────────────────────────────────────── */
export const CategoryTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CategoryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
  }
`;

export const CategoryRowHeader = styled(CategoryRow)`
  cursor: default;
  &:hover { background: transparent; }
`;

export const CategoryColLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: ${({ align }) => align || 'left'};
`;

export const CategoryName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const CategoryEmoji = styled.span`
  font-size: 16px;
`;

export const CategoryAmount = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

export const CategoryVariation = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-align: right;
  color: ${({ up, theme }) => (up ? theme.colors.error : theme.colors.success)};
`;

export const CategoryPrev = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

/* ── Assinaturas ─────────────────────────────────────────────────── */
export const SubscriptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SubscriptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  gap: 0.75rem;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
  }
`;

export const SubscriptionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

export const SubscriptionIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryHighlight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

export const SubscriptionName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const SubscriptionDue = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 1px;
`;

export const SubscriptionAmount = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const SubscriptionTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primaryHighlight};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 0.5rem;
`;

export const SubscriptionTotalLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SubscriptionTotalValue = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-variant-numeric: tabular-nums;
`;

/* ── Parcelamentos ───────────────────────────────────────────────── */
export const InstallmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InstallmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  gap: 0.75rem;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
  }
`;

export const InstallmentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InstallmentName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const InstallmentProgress = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const InstallmentProgressBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  margin-top: 0.5rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ pct }) => pct}%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radius.full};
    transition: width 0.6s ease;
  }
`;

export const InstallmentAmount = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

/* ── Cartões ─────────────────────────────────────────────────────── */
export const CardsEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 2.5rem 1.5rem;
`;

export const CardsEmptyIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.primaryHighlight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

/* ── FAB de chat ─────────────────────────────────────────────────── */
export const ChatFab = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.gradientCTA};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadowMd};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: ${({ theme }) => theme.transition};
  z-index: 100;

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 6px 28px ${({ theme }) => theme.colors.shadowLg};
    transform: scale(1.06);
  }
`;
