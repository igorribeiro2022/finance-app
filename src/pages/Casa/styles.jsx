import styled, { css, keyframes } from 'styled-components';
import { glassInsetHighlight, glassPanel, glassPanelElevated, gradientPrimaryButton } from '../../styles/mixins';

/* ── animações ─────────────────────────────────────────────── */
const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

/* ── layout base ────────────────────────────────────────────── */
export const PageWrapper = styled.div`
  padding: 1.5rem 2rem 3rem;
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  overflow-x: hidden;
  animation: ${fadeUp} 0.25s ease;
  @media (max-width: 768px) { padding: 1rem; }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const HeaderInfo = styled.div``;

export const PageTitle = styled.h1`
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.2rem;
`;

export const PageSubtitle = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

/* ── tabs ───────────────────────────────────────────────────── */
export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  margin-bottom: 1.5rem;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`;

export const Tab = styled.button`
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.primary : 'transparent'};
  margin-bottom: -2px;
  color: ${({ active, theme }) => active ? theme.primary : theme.textMuted};
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease;
  &:hover { color: ${({ theme }) => theme.primary}; }
`;

/* ── card ───────────────────────────────────────────────────── */
export const Card = styled.div`
  ${glassPanel}
  border-radius: 12px;
  padding: 1.25rem;
  animation: ${fadeUp} 0.25s ease;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const CardTitle = styled.h2`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textMuted};
`;

export const CardAction = styled.button`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  background: none;
  border: none;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

/* ── grids ──────────────────────────────────────────────────── */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const FullWidthCard = styled.div`
  margin-bottom: 1rem;
`;

export const PanelStack = styled.div`
  display: flex;
  flex-direction: column;

  .casa-charts {
    order: 1;
  }

  .casa-kpis {
    order: 2;
  }

  .casa-agenda {
    order: 3;
  }
`;

export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  min-width: 0;
`;

export const ChartPanel = styled.div`
  ${glassPanel}
  border-radius: 18px;
  padding: 1rem;
  min-width: 0;
`;

export const ChartHint = styled.div`
  margin-top: 0.2rem;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
`;

/* ── KPIs ───────────────────────────────────────────────────── */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const KpiCard = styled.div`
  ${glassPanelElevated}
  border-radius: 10px;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const KpiLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.3;
`;

export const KpiValue = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-variant-numeric: tabular-nums;
`;

export const KpiRating = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 99px;
  width: fit-content;
  ${({ rating, theme }) => rating === 'good' && css`
    background: ${theme.colors.success}18;
    color: ${theme.colors.success};
  `}
  ${({ rating, theme }) => rating === 'neutral' && css`
    background: ${theme.colors.warning}18;
    color: ${theme.colors.warning};
  `}
  ${({ rating, theme }) => rating === 'bad' && css`
    background: ${theme.colors.error}18;
    color: ${theme.colors.error};
  `}
  ${({ rating, theme }) => rating === 'na' && css`
    background: ${theme.colors.neutral}18;
    color: ${theme.colors.textMuted};
  `}
`;

export const KpiFormula = styled.span`
  font-size: 0.67rem;
  color: ${({ theme }) => theme.textMuted};
  opacity: 0.7;
`;

/* ── insight hero ───────────────────────────────────────────── */
export const InsightHero = styled.div`
  ${glassPanelElevated}
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 28px;
  margin-bottom: 1.5rem;
  background-image:
    radial-gradient(circle at 15% 80%, ${({ theme }) => `${theme.colors.accent}22`} 0%, transparent 28%),
    radial-gradient(circle at 90% 10%, ${({ theme }) => `${theme.colors.primary}24`} 0%, transparent 30%),
    ${({ theme }) => theme.colors.gradientAI};
`;

export const InsightIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
`;

export const InsightText = styled.div`flex: 1; min-width: 0;`;

export const InsightTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.3rem;
`;

export const InsightDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
`;

export const InsightMeta = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  opacity: 0.6;
  margin-top: 0.4rem;
`;

/* ── membros ────────────────────────────────────────────────── */
export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MemberItem = styled.div`
  ${glassPanelElevated}
  ${glassInsetHighlight}
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: 8px;
`;

export const MemberAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryHighlight};
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

export const MemberInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MemberName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MemberEmail = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const MemberRole = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 99px;
  flex-shrink: 0;
  ${({ role, theme }) => role === 'dono' ? css`
    background: ${theme.colors.primaryHighlight};
    color: ${theme.colors.primary};
  ` : css`
    background: ${theme.colors.surfaceOffset};
    color: ${theme.colors.textMuted};
  `}
`;

/* ── metas ──────────────────────────────────────────────────── */
export const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const MetaItem = styled.div`
  ${glassPanelElevated}
  border-radius: 10px;
  padding: 1rem;
`;

export const MetaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

export const MetaName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const MetaValues = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

export const MetaProgressBar = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.border};
  border-radius: 99px;
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ pct }) => Math.min(pct, 100)}%;
    background: ${({ theme }) => theme.primary};
    border-radius: 99px;
    transition: width 0.5s ease;
  }
`;

export const MetaDeadline = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  opacity: 0.7;
  margin-top: 0.35rem;
`;

export const MetaActions = styled.div`
  display: flex;
  gap: 0.35rem;
`;

/* ── agenda ─────────────────────────────────────────────────── */
export const AgendaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

export const AgendaItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.875rem;
  &:last-child { border-bottom: none; }
`;

export const AgendaDesc = styled.div`
  color: ${({ theme }) => theme.text};
  flex: 1;
  min-width: 0;
`;

export const AgendaBadge = styled.span`
  font-size: 0.68rem;
  padding: 0.15rem 0.4rem;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  color: ${({ theme }) => theme.textMuted};
  flex-shrink: 0;
`;

export const AgendaValue = styled.div`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text};
  flex-shrink: 0;
`;

/* ── banner da casa ─────────────────────────────────────────── */
export const MovementToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const MonthControl = styled.div`
  min-width: 180px;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  text-transform: capitalize;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const SummaryCard = styled.div`
  ${glassPanelElevated}
  border-radius: 12px;
  padding: 0.9rem;
`;

export const SummaryLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.25rem;
`;

export const SummaryValue = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, positive, negative }) => {
    if (positive) return theme.colors.success;
    if (negative) return theme.colors.error;
    return theme.text;
  }};
`;

export const MemberMovementGroup = styled.div`
  ${glassPanelElevated}
  border-radius: 14px;
  padding: 1rem;
  margin-top: 0.75rem;
`;

export const MemberMovementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

export const MemberMovementTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const MemberMovementStats = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.78rem;

  strong {
    color: ${({ theme }) => theme.text};
    font-variant-numeric: tabular-nums;
  }
`;

export const MovementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

export const MovementItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const MovementMain = styled.div`
  min-width: 0;
  flex: 1;
`;

export const MovementTitle = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  font-weight: 700;
`;

export const MovementMeta = styled.div`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.76rem;
  margin-top: 0.15rem;
`;

export const MovementBadges = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.45rem;
`;

export const MovementBadge = styled.span`
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  background: ${({ theme, type }) => {
    if (type === 'ganho') return `${theme.colors.success}18`;
    if (type === 'gasto') return `${theme.colors.error}18`;
    return theme.colors.surfaceOffset;
  }};
  color: ${({ theme, type }) => {
    if (type === 'ganho') return theme.colors.success;
    if (type === 'gasto') return theme.colors.error;
    return theme.textMuted;
  }};
`;

export const MovementValue = styled.div`
  font-size: 1rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, type }) => type === 'ganho' ? theme.colors.success : theme.colors.error};
  white-space: nowrap;
`;

export const CasaBanner = styled.div`
  ${glassPanelElevated}
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const CasaIconBig = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primaryHighlight};
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

export const CasaInfoText = styled.div`flex: 1; min-width: 0;`;

export const CasaNome = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const CasaMeta = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
`;

/* ── estado sem casa ────────────────────────────────────────── */
export const NoCasaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
  gap: 0.75rem;
`;

export const NoCasaIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 0.25rem;
`;

export const NoCasaTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

export const NoCasaDesc = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  max-width: 38ch;
  line-height: 1.5;
`;

export const NoCasaActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
`;

/* ── estados vazios ─────────────────────────────────────────── */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1rem;
  gap: 0.5rem;
`;

export const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
`;

export const EmptyTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const EmptyDesc = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  max-width: 36ch;
  line-height: 1.5;
`;

/* ── botões ─────────────────────────────────────────────────── */
const btnBase = css`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.18s ease, opacity 0.18s ease;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const PrimaryBtn = styled.button`
  ${btnBase}
  ${gradientPrimaryButton}
`;

export const SecondaryBtn = styled.button`
  ${btnBase}
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  &:hover:not(:disabled) { background: ${({ theme }) => theme.background}; }
`;

export const DangerBtn = styled.button`
  ${btnBase}
  background: ${({ theme }) => `${theme.colors.error}18`};
  color: ${({ theme }) => theme.colors.error};
  &:hover:not(:disabled) { background: ${({ theme }) => `${theme.colors.error}24`}; }
`;

export const GhostBtn = styled.button`
  ${btnBase}
  background: none;
  color: ${({ theme }) => theme.textMuted};
  &:hover:not(:disabled) { background: ${({ theme }) => theme.background}; }
`;

/* ── spinner ────────────────────────────────────────────────── */
export const SpinnerIcon = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.7s linear infinite;
`;

/* ── skeleton ───────────────────────────────────────────────── */
export const SkeletonBlock = styled.div`
  height: ${({ h }) => h || '1rem'};
  width: ${({ w }) => w || '100%'};
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.background} 25%,
    ${({ theme }) => theme.border} 50%,
    ${({ theme }) => theme.background} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

/* ── banners de feedback ────────────────────────────────────── */
export const ErrorBanner = styled.div`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => `${theme.colors.error}15`};
  border: 1px solid ${({ theme }) => `${theme.colors.error}33`};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const SuccessBanner = styled.div`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => `${theme.colors.success}15`};
  border: 1px solid ${({ theme }) => `${theme.colors.success}33`};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

/* ── modal ──────────────────────────────────────────────────── */
export const InviteLinkPanel = styled.div`
  padding: 0.85rem 1rem;
  background: ${({ theme }) => `${theme.colors.success}12`};
  border: 1px solid ${({ theme }) => `${theme.colors.success}33`};
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const InviteLinkText = styled.div`
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.45;
  margin-bottom: 0.65rem;
`;

export const InviteLinkActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const InviteLinkInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.7rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surfaceOffset};
  color: ${({ theme }) => theme.text};
  font-size: 0.8rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalBox = styled.div`
  ${glassPanelElevated}
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 480px;
`;

export const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.4rem;
`;

export const ModalText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
`;

/* ── formulário ─────────────────────────────────────────────── */
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.875rem;
`;

export const FormLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const FormInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${({ theme }) => theme.surfaceOffset};
  color: ${({ theme }) => theme.text};
  outline: none;
  transition: border-color 0.18s ease;
  &:focus { border-color: ${({ theme }) => theme.primary}; }
  &::placeholder { color: ${({ theme }) => theme.textMuted}; opacity: 0.6; }
`;
