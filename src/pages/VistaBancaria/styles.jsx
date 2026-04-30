import styled, { css, keyframes } from 'styled-components';

/* ── animações ─────────────────────────────────────────────────── */
const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

/* ── layout base ────────────────────────────────────────────────── */
export const PageWrapper = styled.div`
  padding: 1.5rem 2rem 3rem;
  max-width: 1200px;
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

export const HeaderInfo  = styled.div``;

export const PageTitle   = styled.h1`
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

/* ── tabs ───────────────────────────────────────────────────────── */
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
  transition: color 0.18s, border-color 0.18s;
  &:hover { color: ${({ theme }) => theme.primary}; }
`;

/* ── card ───────────────────────────────────────────────────────── */
export const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
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

/* ── grids ──────────────────────────────────────────────────────── */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const FullWidthCard = styled.div`
  margin-bottom: 1rem;
`;

/* ── saldo hero ─────────────────────────────────────────────────── */
export const SaldoHero = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const SaldoInfo = styled.div``;

export const SaldoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.35rem;
`;

export const SaldoTotal = styled.div`
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
`;

export const SaldoMeta = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 0.3rem;
`;

export const SaldoActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

/* ── KPIs de resumo ─────────────────────────────────────────────── */
export const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const KpiCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const KpiLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textMuted};
`;

export const KpiValue = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text};
`;

export const KpiVariation = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ up, theme }) => up ? '#437a22' : theme.textMuted};
`;

/* ── lista de instituições ──────────────────────────────────────── */
export const InstList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InstItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  transition: background 0.15s;
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  &:hover { background: ${({ clickable, theme }) => clickable ? theme.border : theme.background}; }
`;

export const InstLogo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary};
  overflow: hidden;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: contain; }
`;

export const InstInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InstNome = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const InstContas = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const InstSaldo = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text};
  flex-shrink: 0;
`;

/* ── lista de contas ────────────────────────────────────────────── */
export const ContaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.4rem;
  padding-left: 0.5rem;
  border-left: 2px solid ${({ theme }) => theme.border};
`;

export const ContaItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
`;

export const ContaDesc = styled.div`
  color: ${({ theme }) => theme.text};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ContaTipo = styled.span`
  font-size: 0.68rem;
  padding: 0.1rem 0.35rem;
  border-radius: 99px;
  background: rgba(0,0,0,0.06);
  color: ${({ theme }) => theme.textMuted};
  flex-shrink: 0;
`;

export const ContaSaldo = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text};
  flex-shrink: 0;
`;

/* ── filtros ────────────────────────────────────────────────────── */
export const FiltersRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  align-items: center;
`;

export const FilterSelect = styled.select`
  padding: 0.45rem 0.7rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 0.8rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.primary}; }
`;

export const FilterInput = styled.input`
  padding: 0.45rem 0.7rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 0.8rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.primary}; }
  &::placeholder { color: ${({ theme }) => theme.textMuted}; opacity: 0.6; }
`;

/* ── transações ─────────────────────────────────────────────────── */
export const TxGroup = styled.div`
  margin-bottom: 1rem;
  &:last-child { margin-bottom: 0; }
`;

export const TxDate = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.35rem;
  padding: 0 0.25rem;
`;

export const TxList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.5rem;
  border-radius: 8px;
  transition: background 0.15s;
  cursor: default;
  &:hover { background: ${({ theme }) => theme.background}; }
`;

export const TxIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  background: ${({ type }) =>
    type === 'credito'
      ? 'rgba(67,122,34,0.1)'
      : 'rgba(161,44,123,0.08)'};
`;

export const TxBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TxDesc = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TxMeta = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.15rem;
`;

export const TxCategoria = styled.span``;

export const TxOrigem = styled.span`
  padding: 0.1rem 0.35rem;
  border-radius: 99px;
  background: rgba(0,0,0,0.05);
  font-size: 0.66rem;
`;

export const TxValue = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  color: ${({ type }) => type === 'credito' ? '#437a22' : 'inherit'};
`;

/* ── resumo de categorias ───────────────────────────────────────── */
export const CatTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const CatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text};
  width: 130px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CatBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.border};
  border-radius: 99px;
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ pct }) => pct}%;
    background: ${({ theme }) => theme.primary};
    border-radius: 99px;
  }
`;

export const CatValue = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text};
  width: 90px;
  text-align: right;
  flex-shrink: 0;
`;

/* ── estados ────────────────────────────────────────────────────── */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1rem;
  gap: 0.5rem;
`;

export const EmptyIcon  = styled.div`font-size: 2.5rem; margin-bottom: 0.25rem;`;
export const EmptyTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;
export const EmptyDesc  = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  max-width: 36ch;
  line-height: 1.5;
`;

export const ErrorBanner = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(161,44,123,0.08);
  border: 1px solid rgba(161,44,123,0.2);
  border-radius: 8px;
  color: #a12c7b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

/* ── botões ─────────────────────────────────────────────────────── */
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
  transition: background 0.18s, opacity 0.18s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const PrimaryBtn = styled.button`
  ${btnBase}
  background: ${({ theme }) => theme.primary};
  color: #fff;
  &:hover:not(:disabled) { opacity: 0.88; }
`;

export const SecondaryBtn = styled.button`
  ${btnBase}
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  &:hover:not(:disabled) { background: ${({ theme }) => theme.background}; }
`;

/* ── skeleton / spinner ─────────────────────────────────────────── */
export const SpinnerIcon = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.7s linear infinite;
`;

export const SkeletonBlock = styled.div`
  height: ${({ h }) => h || '1rem'};
  width:  ${({ w }) => w || '100%'};
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.background} 25%,
    ${({ theme }) => theme.border}     50%,
    ${({ theme }) => theme.background} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;
