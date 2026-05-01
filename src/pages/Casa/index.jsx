import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import Icon from '../../components/Icon';
import {
  getCasa, postCasa, deleteCasa, postCasaSair,
  getCasaDashboard, getCasaLancamentos, getCasaMetas, postCasaMeta,
  patchCasaMeta, deleteCasaMeta, postConvite, deleteCasaMembro,
} from '../../services/casa';
import { buildCasaInviteUrl } from '../../utils/casaInvite';
import {
  PageWrapper, PageHeader, HeaderInfo, PageTitle, PageSubtitle, HeaderActions,
  TabBar, Tab, Card, CardHeader, CardTitle,
  ChartGrid, ChartHint, ChartPanel,
  FullWidthCard,
  InsightHero, InsightIcon, InsightText, InsightTitle, InsightDescription, InsightMeta,
  KpiGrid, KpiCard, KpiLabel, KpiValue, KpiRating, KpiFormula,
  MemberList, MemberItem, MemberAvatar, MemberInfo, MemberName, MemberEmail, MemberRole,
  MetaList, MetaItem, MetaHeader, MetaName, MetaValues, MetaProgressBar, MetaDeadline, MetaActions,
  AgendaList, AgendaItem, AgendaDesc, AgendaBadge, AgendaValue,
  MovementToolbar, MonthControl, SummaryGrid, SummaryCard, SummaryLabel, SummaryValue,
  MemberMovementGroup, MemberMovementHeader, MemberMovementTitle, MemberMovementStats,
  MovementList, MovementItem, MovementMain, MovementTitle, MovementMeta,
  MovementBadges, MovementBadge, MovementValue,
  CasaBanner, CasaIconBig, CasaInfoText, CasaNome, CasaMeta,
  NoCasaWrapper, NoCasaIcon, NoCasaTitle, NoCasaDesc, NoCasaActions,
  EmptyState, EmptyIcon, EmptyTitle, EmptyDesc,
  PrimaryBtn, SecondaryBtn, DangerBtn, GhostBtn, SpinnerIcon, SkeletonBlock,
  ErrorBanner, SuccessBanner,
  InviteLinkPanel, InviteLinkText, InviteLinkActions, InviteLinkInput,
  ModalOverlay, ModalBox, ModalTitle, ModalText, ModalActions,
  FormGroup, FormLabel, FormInput,
} from './styles';

/* ── helpers ─────────────────────────────────────────────────── */
const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0);

const formatPct = (v) =>
  v == null ? '—' : `${Number(v).toFixed(1)}%`;

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const avatarInitials = (nome) =>
  (nome || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const num = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const arr = (value) => Array.isArray(value) ? value : [];

const obj = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};

function ChartTooltip({ active, payload, label, theme }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: theme.colors.glassBgElevated,
      border: `1px solid ${theme.colors.glassBorder}`,
      color: theme.colors.text,
      borderRadius: 14,
      padding: '10px 12px',
      fontSize: 12,
      boxShadow: theme.colors.glassShadow,
    }}>
      {label && <p style={{ marginBottom: 4, fontWeight: 800 }}>{label}</p>}
      {payload.map((item, index) => (
        <p key={`${item.dataKey || item.name}-${index}`} style={{ color: item.color }}>
          {item.name}: {formatBRL(item.value)}
        </p>
      ))}
    </div>
  );
}

/* ── definição das 20 KPIs ───────────────────────────────────── */
const KPI_DEFS = [
  { key: 'patrimonio_liquido',         label: 'Patrimônio Líquido',             fmt: 'brl',  formula: 'Ativos totais − Passivos totais' },
  { key: 'taxa_poupanca',              label: 'Taxa de Poupança',               fmt: 'pct',  formula: '(Sobra / Ganhos) × 100' },
  { key: 'taxa_investimento',          label: 'Taxa de Investimento',           fmt: 'pct',  formula: '(Investimentos / Ganhos) × 100' },
  { key: 'reserva_emergencia_meses',   label: 'Reserva de Emergência',         fmt: 'meses', formula: 'Reserva / Gasto médio mensal' },
  { key: 'indice_liquidez_basica',     label: 'Liquidez Básica',               fmt: 'x',    formula: 'Ativos líquidos / Gasto mensal' },
  { key: 'liquidez_sobre_patrimonio',  label: 'Liquidez / Patrimônio',         fmt: 'pct',  formula: 'Ativos líquidos / Ativos totais' },
  { key: 'fluxo_caixa_mensal',        label: 'Fluxo de Caixa',                fmt: 'brl',  formula: 'Ganhos − Gastos' },
  { key: 'margem_sobra_mensal',       label: 'Margem de Sobra',               fmt: 'pct',  formula: '(Fluxo / Ganhos) × 100' },
  { key: 'indice_despesas_fixas',     label: 'Despesas Fixas',                fmt: 'pct',  formula: 'Gastos fixos / Ganhos' },
  { key: 'indice_despesas_essenciais',label: 'Despesas Essenciais',           fmt: 'pct',  formula: 'Essenciais / Ganhos' },
  { key: 'indice_despesas_discricionarias', label: 'Despesas Discricionárias', fmt: 'pct', formula: 'Discricionárias / Ganhos' },
  { key: 'divida_sobre_renda',        label: 'Dívida / Renda (DTI)',          fmt: 'pct',  formula: 'Passivos totais / (Ganhos × 12)' },
  { key: 'divida_total_sobre_ativos', label: 'Dívida / Ativos',              fmt: 'pct',  formula: 'Passivos / Ativos totais' },
  { key: 'divida_total_sobre_patrimonio', label: 'Dívida / Patrimônio',      fmt: 'pct',  formula: 'Passivos / Patrimônio líquido' },
  { key: 'custo_da_divida',           label: 'Custo da Dívida',              fmt: 'pct',  formula: 'Juros pagos / Passivos totais' },
  { key: 'comprometimento_moradia',   label: 'Comprometimento Moradia',      fmt: 'pct',  formula: 'Moradia / Ganhos' },
  { key: 'cobertura_divida_por_caixa',label: 'Cobertura de Dívida p/ Caixa', fmt: 'x',   formula: 'Ativos líquidos / Passivos' },
  { key: 'indice_solvencia',          label: 'Índice de Solvência',          fmt: 'x',    formula: 'Ativos totais / Passivos totais' },
  { key: 'percentual_investido_patrimonio', label: '% Investido do Patrimônio', fmt: 'pct', formula: 'Investimentos / Ativos totais' },
  { key: 'progresso_metas',           label: 'Progresso das Metas',          fmt: 'pct',  formula: 'Média do progresso das metas ativas' },
];

const fmtKpi = (def, val) => {
  if (val == null) return '—';
  if (def.fmt === 'brl')   return formatBRL(val);
  if (def.fmt === 'pct')   return formatPct(val);
  if (def.fmt === 'meses') return `${Number(val).toFixed(1)} m`;
  if (def.fmt === 'x')     return `${Number(val).toFixed(2)}×`;
  return String(val);
};

const CASA_KPI_ALIASES = {
  patrimonio_liquido: 'kpi_01_patrimonio_liquido',
  taxa_poupanca: 'kpi_02_taxa_poupanca',
  taxa_investimento: 'kpi_03_taxa_investimento',
  reserva_emergencia_meses: 'kpi_04_reserva_emergencia_meses',
  indice_liquidez_basica: 'kpi_05_liquidez_basica',
  liquidez_sobre_patrimonio: 'kpi_06_liquidez_patrimonio',
  fluxo_caixa_mensal: 'kpi_07_fluxo_caixa_mensal',
  margem_sobra_mensal: 'kpi_08_margem_sobra_mensal',
  indice_despesas_fixas: 'kpi_09_indice_despesas_fixas',
  indice_despesas_essenciais: 'kpi_10_despesas_essenciais',
  indice_despesas_discricionarias: 'kpi_11_despesas_discricionarias',
  divida_sobre_renda: 'kpi_12_dti',
  divida_total_sobre_ativos: 'kpi_13_divida_sobre_ativos',
  divida_total_sobre_patrimonio: 'kpi_14_divida_sobre_patrimonio',
  custo_da_divida: 'kpi_15_custo_divida',
  comprometimento_moradia: 'kpi_16_comprometimento_moradia',
  cobertura_divida_por_caixa: 'kpi_17_cobertura_divida_caixa',
  indice_solvencia: 'kpi_18_indice_solvencia',
  percentual_investido_patrimonio: 'kpi_19_percentual_investido',
  progresso_metas: 'kpi_20_progresso_metas',
};

const getCasaKpiValue = (kpis, key) => {
  const value = kpis?.[key] ?? kpis?.[CASA_KPI_ALIASES[key]];
  if (value && typeof value === 'object' && !Array.isArray(value)) return value.valor;
  return value;
};

const kpiRating = (def, val) => {
  if (val == null) return 'na';
  const n = Number(val);
  const pctKeys = ['taxa_poupanca', 'taxa_investimento', 'margem_sobra_mensal'];
  const lowBadKeys = ['divida_sobre_renda', 'divida_total_sobre_ativos', 'indice_despesas_fixas', 'indice_despesas_discricionarias', 'comprometimento_moradia', 'custo_da_divida'];
  if (pctKeys.includes(def.key)) return n >= 20 ? 'good' : n >= 10 ? 'neutral' : 'bad';
  if (lowBadKeys.includes(def.key)) return n <= 30 ? 'good' : n <= 50 ? 'neutral' : 'bad';
  if (def.key === 'reserva_emergencia_meses') return n >= 6 ? 'good' : n >= 3 ? 'neutral' : 'bad';
  if (def.key === 'indice_solvencia' || def.key === 'indice_liquidez_basica') return n >= 2 ? 'good' : n >= 1 ? 'neutral' : 'bad';
  if (def.key === 'progresso_metas') return n >= 75 ? 'good' : n >= 40 ? 'neutral' : 'bad';
  return 'na';
};

const ratingLabel = { good: 'Bom', neutral: 'Atencao', bad: 'Critico', na: '-' };

/* ── skeleton helper ─────────────────────────────────────────── */
const SkeletonCard = ({ rows = 3 }) => (
  <Card>
    <CardHeader><SkeletonBlock h="14px" w="120px" /></CardHeader>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonBlock key={i} h="40px" style={{ marginBottom: 8 }} />
    ))}
  </Card>
);

/* ── tabs ────────────────────────────────────────────────────── */
const TABS = [
  { key: 'painel',  label: 'Painel' },
  { key: 'lancamentos', label: 'Lancamentos' },
  { key: 'membros', label: 'Membros' },
  { key: 'metas',   label: 'Metas' },
];

/* ── componente principal ────────────────────────────────────── */
export default function Casa() {
  const auth     = useSelector((s) => s.auth);
  const userId   = auth?.user?.id;
  const theme = useTheme();
  const userName = auth?.user?.nome?.split(' ')[0] ?? 'você';

  /* estado global */
  const [activeTab, setActiveTab] = useState('painel');

  /* dados */
  const [casa,      setCasa]      = useState(null);
  const [membros,   setMembros]   = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [lancamentosCasa, setLancamentosCasa] = useState(null);
  const [metas,     setMetas]     = useState([]);
  const [periodoLancamentos, setPeriodoLancamentos] = useState(() => {
    const hoje = new Date();
    return { mes: hoje.getMonth() + 1, ano: hoje.getFullYear() };
  });

  /* loading por seção */
  const [loadingCasa,      setLoadingCasa]      = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingLancamentos, setLoadingLancamentos] = useState(true);
  const [loadingMetas,     setLoadingMetas]     = useState(true);

  /* ações */
  const [savingConvite, setSavingConvite] = useState(false);
  const [savingMeta,    setSavingMeta]    = useState(false);
  const [savingCasa,    setSavingCasa]    = useState(false);
  const [removingId,    setRemovingId]    = useState(null);

  /* feedback */
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  /* modais */
  const [showCriarModal,   setShowCriarModal]   = useState(false);
  const [showConviteModal, setShowConviteModal] = useState(false);
  const [showMetaModal,    setShowMetaModal]    = useState(false);
  const [showEncerrarModal,setShowEncerrarModal]= useState(false);
  const [showSairModal,    setShowSairModal]    = useState(false);
  const [confirmRemoveMembro, setConfirmRemoveMembro] = useState(null);
  const [editingMeta,      setEditingMeta]      = useState(null);

  /* forms */
  const [nomeCasa,    setNomeCasa]    = useState('');
  const [emailConvite,setEmailConvite]= useState('');
  const [metaForm,    setMetaForm]    = useState({ descricao: '', valor_meta: '', valor_acumulado: '', prazo: '' });

  /* ── carregamento de dados ─────────────────────────────────── */
  const loadCasa = useCallback(async () => {
    try {
      setLoadingCasa(true);
      const res = await getCasa();
      const d = res.data;
      setCasa(d?.casa ?? d);
      setMembros(d?.membros ?? []);
    } catch (e) {
      if (e?.response?.status === 404) {
        setCasa(null);
        setMembros([]);
        setLancamentosCasa(null);
      } else {
        setError('Erro ao carregar dados da Casa.');
      }
    } finally {
      setLoadingCasa(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const res = await getCasaDashboard();
      setDashboard(res.data);
    } catch {
      setDashboard(null);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const loadLancamentos = useCallback(async () => {
    try {
      setLoadingLancamentos(true);
      const res = await getCasaLancamentos(periodoLancamentos);
      setLancamentosCasa(res.data);
    } catch {
      setLancamentosCasa(null);
    } finally {
      setLoadingLancamentos(false);
    }
  }, [periodoLancamentos]);

  const loadMetas = useCallback(async () => {
    try {
      setLoadingMetas(true);
      const res = await getCasaMetas();
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setMetas(data);
    } catch {
      setMetas([]);
    } finally {
      setLoadingMetas(false);
    }
  }, []);

  useEffect(() => {
    loadCasa();
  }, [loadCasa]);

  useEffect(() => {
    if (!casa) return;
    loadDashboard();
    loadLancamentos();
    loadMetas();
  }, [casa, loadDashboard, loadLancamentos, loadMetas]);

  /* ── ações de Casa ─────────────────────────────────────────── */
  const handleCriarCasa = useCallback(async () => {
    if (!nomeCasa.trim()) return;
    try {
      setSavingCasa(true);
      setError('');
      await postCasa({ nome: nomeCasa.trim() });
      setShowCriarModal(false);
      setNomeCasa('');
      setSuccess('Casa criada com sucesso!');
      await loadCasa();
    } catch {
      setError('Erro ao criar Casa. Tente novamente.');
    } finally {
      setSavingCasa(false);
    }
  }, [nomeCasa, loadCasa]);

  const handleEncerrarCasa = useCallback(async () => {
    try {
      setSavingCasa(true);
      setError('');
      await deleteCasa();
      setShowEncerrarModal(false);
      setCasa(null);
      setMembros([]);
      setDashboard(null);
      setLancamentosCasa(null);
      setMetas([]);
      setSuccess('Casa encerrada.');
    } catch {
      setError('Erro ao encerrar Casa.');
    } finally {
      setSavingCasa(false);
    }
  }, []);

  const handleSairCasa = useCallback(async () => {
    try {
      setSavingCasa(true);
      setError('');
      await postCasaSair();
      setShowSairModal(false);
      setCasa(null);
      setMembros([]);
      setDashboard(null);
      setLancamentosCasa(null);
      setMetas([]);
      setSuccess('Você saiu da Casa.');
    } catch {
      setError('Erro ao sair da Casa.');
    } finally {
      setSavingCasa(false);
    }
  }, []);

  /* ── convite ───────────────────────────────────────────────── */
  const handleEnviarConvite = useCallback(async () => {
    if (!emailConvite.trim()) return;
    try {
      setSavingConvite(true);
      setError('');
      setInviteLink('');
      const res = await postConvite({ email_convidado: emailConvite.trim() });
      const link = buildCasaInviteUrl(res.data?.token);
      setShowConviteModal(false);
      setEmailConvite('');
      setInviteLink(link);
      setSuccess(link ? 'Convite criado com sucesso!' : 'Convite enviado com sucesso!');
    } catch (e) {
      const msg = e?.response?.data?.email_convidado?.[0]
        ?? e?.response?.data?.email?.[0]
        ?? e?.response?.data?.detail
        ?? 'Erro ao enviar convite.';
      setError(msg);
    } finally {
      setSavingConvite(false);
    }
  }, [emailConvite]);

  const handleCopiarConvite = useCallback(async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setSuccess('Link do convite copiado!');
    } catch {
      setError('Não foi possível copiar o link automaticamente.');
    }
  }, [inviteLink]);

  /* ── remover membro ────────────────────────────────────────── */
  const handleRemoverMembro = useCallback(async () => {
    if (!confirmRemoveMembro) return;
    try {
      setRemovingId(confirmRemoveMembro.id);
      setError('');
      await deleteCasaMembro(confirmRemoveMembro.id);
      setConfirmRemoveMembro(null);
      setSuccess('Membro removido.');
      await loadCasa();
    } catch {
      setError('Erro ao remover membro.');
    } finally {
      setRemovingId(null);
    }
  }, [confirmRemoveMembro, loadCasa]);

  /* ── metas ─────────────────────────────────────────────────── */
  const handleOpenMetaModal = (meta = null) => {
    setEditingMeta(meta);
    setMetaForm(meta
      ? { descricao: meta.descricao, valor_meta: meta.valor_meta, valor_acumulado: meta.valor_acumulado, prazo: meta.prazo }
      : { descricao: '', valor_meta: '', valor_acumulado: '', prazo: '' }
    );
    setShowMetaModal(true);
  };

  const handleSalvarMeta = useCallback(async () => {
    if (!metaForm.descricao.trim() || !metaForm.valor_meta) return;
    try {
      setSavingMeta(true);
      setError('');
      const body = {
        descricao:       metaForm.descricao.trim(),
        valor_meta:      parseFloat(metaForm.valor_meta),
        valor_acumulado: parseFloat(metaForm.valor_acumulado) || 0,
        prazo:           metaForm.prazo || undefined,
      };
      if (editingMeta) {
        await patchCasaMeta(editingMeta.id, body);
      } else {
        await postCasaMeta(body);
      }
      setShowMetaModal(false);
      setEditingMeta(null);
      setSuccess(editingMeta ? 'Meta atualizada!' : 'Meta criada!');
      await loadMetas();
    } catch {
      setError('Erro ao salvar meta.');
    } finally {
      setSavingMeta(false);
    }
  }, [metaForm, editingMeta, loadMetas]);

  const handleExcluirMeta = useCallback(async (id) => {
    try {
      setError('');
      await deleteCasaMeta(id);
      setSuccess('Meta removida.');
      await loadMetas();
    } catch {
      setError('Erro ao excluir meta.');
    }
  }, [loadMetas]);

  /* ── derivações ────────────────────────────────────────────── */
  const isDono = useMemo(
    () => membros.find((m) => m.user?.id === userId || m.user === userId)?.papel === 'dono',
    [membros, userId]
  );

  const kpis     = useMemo(() => dashboard?.kpis ?? {}, [dashboard]);
  const graficos = useMemo(() => obj(dashboard?.graficos), [dashboard]);
  const agenda   = useMemo(() => {
    const list = dashboard?.agenda ?? {};
    return Object.entries(list).flatMap(([data, itens]) =>
      (Array.isArray(itens) ? itens : [itens]).map((i) => ({ ...i, data }))
    ).slice(0, 8);
  }, [dashboard]);

  const historicoCasa = useMemo(() => (
    arr(graficos.historico_6_meses).map((item) => {
      const ganhos = num(item.ganhos_eventuais ?? item.ganhos);
      const gastos = num(item.gastos_eventuais ?? item.gastos);
      return {
        mes: item.mes,
        ganhos,
        gastos,
        saldo: ganhos - gastos,
      };
    })
  ), [graficos]);

  const porMembroChart = useMemo(() => (
    arr(graficos.por_membro).map((item) => ({
      nome: item.usuario || item.nome || 'Membro',
      ganhos: num(item.total_ganhos),
      gastos: num(item.total_gastos),
      saldo: num(item.total_ganhos) - num(item.total_gastos),
    }))
  ), [graficos]);

  const fixosVsEventuaisCasa = useMemo(() => {
    const base = obj(graficos.fixos_vs_eventuais);
    return [
      { name: 'Ganhos', Fixos: num(base.ganhos_fixos), Eventuais: num(base.ganhos_eventuais) },
      { name: 'Gastos', Fixos: num(base.gastos_fixos), Eventuais: num(base.gastos_eventuais) },
    ];
  }, [graficos]);

  const gastosPorCategoriaCasa = useMemo(() => {
    const mapa = {};
    arr(lancamentosCasa?.lancamentos).forEach((item) => {
      if (item.tipo !== 'gasto') return;
      const categoria = item.categoria || 'Sem categoria';
      mapa[categoria] = (mapa[categoria] || 0) + num(item.valor);
    });
    return Object.entries(mapa)
      .map(([name, valor]) => ({ name, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8);
  }, [lancamentosCasa]);

  const chartColors = [
    theme.colors.primary,
    theme.colors.accent,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.error,
    theme.colors.neutral,
  ];

  const totalMembros = membros.length;
  const periodoLabel = useMemo(() => {
    const data = new Date(periodoLancamentos.ano, periodoLancamentos.mes - 1, 1);
    return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [periodoLancamentos]);

  const handlePeriodoDelta = useCallback((delta) => {
    setPeriodoLancamentos((atual) => {
      const data = new Date(atual.ano, atual.mes - 1 + delta, 1);
      return { mes: data.getMonth() + 1, ano: data.getFullYear() };
    });
  }, []);

  /* limpa feedback após 3s */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 3000);
    return () => clearTimeout(t);
  }, [success]);

  /* ── render: sem casa ──────────────────────────────────────── */
  const renderNoCasa = () => (
    <NoCasaWrapper>
      <NoCasaIcon><Icon name="home" size={46} /></NoCasaIcon>
      <NoCasaTitle>Você ainda não tem uma Casa</NoCasaTitle>
      <NoCasaDesc>
        Crie uma Casa para compartilhar finanças com sua família ou aceite
        um convite de outra pessoa.
      </NoCasaDesc>
      <NoCasaActions>
        <PrimaryBtn onClick={() => setShowCriarModal(true)}>
          Criar Casa
        </PrimaryBtn>
      </NoCasaActions>
    </NoCasaWrapper>
  );

  /* ── render: painel ────────────────────────────────────────── */
  const renderPainel = () => (
    <>
      {/* Insight */}
      <InsightHero>
        <InsightIcon><Icon name="home" size={30} /></InsightIcon>
        <InsightText>
          <InsightTitle>
            {dashboard
              ? `Painel consolidado de ${casa?.nome}`
              : `Bem-vindo à ${casa?.nome}, ${userName}!`}
          </InsightTitle>
          <InsightDescription>
            {dashboard
              ? `Todos os dados financeiros de ${totalMembros} membro${totalMembros !== 1 ? 's' : ''} consolidados abaixo.`
              : 'Adicione dados de patrimônio para desbloquear as 20 KPIs financeiras da Casa.'}
          </InsightDescription>
          <InsightMeta>
            Atualizado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </InsightMeta>
        </InsightText>
      </InsightHero>

      {/* 20 KPIs */}
      <Card style={{ marginBottom: '1rem' }}>
        <CardHeader>
          <CardTitle>20 KPIs Financeiras</CardTitle>
          {loadingDashboard && <SpinnerIcon />}
        </CardHeader>
        {loadingDashboard ? (
          <KpiGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <KpiCard key={i}><SkeletonBlock h="12px" w="80px" /><SkeletonBlock h="28px" w="100px" style={{ marginTop: 6 }} /></KpiCard>
            ))}
          </KpiGrid>
        ) : !dashboard ? (
          <EmptyState>
            <EmptyIcon><Icon name="chart" size={36} /></EmptyIcon>
            <EmptyTitle>Nenhum dado disponível</EmptyTitle>
            <EmptyDesc>
              As KPIs serão calculadas conforme os membros registrarem seus dados de patrimônio.
            </EmptyDesc>
          </EmptyState>
        ) : (
          <KpiGrid>
            {KPI_DEFS.map((def) => {
              const val = getCasaKpiValue(kpis, def.key);
              const rating = kpiRating(def, val);
              return (
                <KpiCard key={def.key}>
                  <KpiLabel>{def.label}</KpiLabel>
                  <KpiValue>{fmtKpi(def, val)}</KpiValue>
                  <KpiRating rating={rating}>{ratingLabel[rating]}</KpiRating>
                  <KpiFormula>{def.formula}</KpiFormula>
                </KpiCard>
              );
            })}
          </KpiGrid>
        )}
      </Card>

      <ChartGrid>
        <ChartPanel>
          <CardHeader>
            <div>
              <CardTitle>Fluxo da Casa</CardTitle>
              <ChartHint>Ganhos, gastos e saldo dos ultimos 6 meses</ChartHint>
            </div>
          </CardHeader>
          {historicoCasa.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={historicoCasa} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="casaSaldoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.36} />
                    <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.colors.textMuted }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip theme={theme} />} />
                <Area type="monotone" dataKey="saldo" name="Saldo" stroke={theme.colors.primary} strokeWidth={3} fill="url(#casaSaldoGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState>
              <EmptyIcon><Icon name="chart" size={36} /></EmptyIcon>
              <EmptyTitle>Sem historico suficiente</EmptyTitle>
              <EmptyDesc>O fluxo da Casa aparece conforme os membros registram lancamentos.</EmptyDesc>
            </EmptyState>
          )}
        </ChartPanel>

        <ChartPanel>
          <CardHeader>
            <div>
              <CardTitle>Gastos por categoria</CardTitle>
              <ChartHint>Concentracao do mes selecionado</ChartHint>
            </div>
          </CardHeader>
          {gastosPorCategoriaCasa.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip content={<ChartTooltip theme={theme} />} />
                <Pie
                  data={gastosPorCategoriaCasa}
                  dataKey="valor"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {gastosPorCategoriaCasa.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState>
              <EmptyIcon><Icon name="categories" size={36} /></EmptyIcon>
              <EmptyTitle>Sem gastos categorizados</EmptyTitle>
              <EmptyDesc>As categorias aparecem quando houver gastos no periodo.</EmptyDesc>
            </EmptyState>
          )}
        </ChartPanel>

        <ChartPanel>
          <CardHeader>
            <div>
              <CardTitle>Fixos x eventuais</CardTitle>
              <ChartHint>Recorrencia dos ganhos e gastos</ChartHint>
            </div>
          </CardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fixosVsEventuaisCasa} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.colors.textMuted }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip theme={theme} />} />
              <Bar dataKey="Fixos" stackId="a" fill={theme.colors.primary} radius={[10, 10, 0, 0]} />
              <Bar dataKey="Eventuais" stackId="a" fill={theme.colors.accent} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel>
          <CardHeader>
            <div>
              <CardTitle>Por membro</CardTitle>
              <ChartHint>Participacao individual no mes</ChartHint>
            </div>
          </CardHeader>
          {porMembroChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={porMembroChart} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.colors.textMuted }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip theme={theme} />} />
                <Bar dataKey="ganhos" name="Ganhos" fill={theme.colors.success} radius={[10, 10, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill={theme.colors.error} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState>
              <EmptyIcon><Icon name="people" size={36} /></EmptyIcon>
              <EmptyTitle>Sem comparativo ainda</EmptyTitle>
              <EmptyDesc>Convide membros e registre lancamentos para comparar a Casa.</EmptyDesc>
            </EmptyState>
          )}
        </ChartPanel>
      </ChartGrid>

      {/* Agenda */}
      {agenda.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Próximos vencimentos da Casa</CardTitle>
          </CardHeader>
          <AgendaList>
            {agenda.map((item, i) => (
              <AgendaItem key={i}>
                <AgendaDesc>{item.descricao}</AgendaDesc>
                <AgendaBadge>{item.data}</AgendaBadge>
                <AgendaValue>{formatBRL(item.valor)}</AgendaValue>
              </AgendaItem>
            ))}
          </AgendaList>
        </Card>
      )}
    </>
  );

  /* ── render: membros ───────────────────────────────────────── */
  const renderLancamentos = () => {
    const resumo = lancamentosCasa?.resumo ?? {};
    const grupos = lancamentosCasa?.por_membro ?? [];
    const totalLancamentos = Number(resumo.total_lancamentos) || 0;

    return (
      <FullWidthCard as="div">
        <Card>
          <CardHeader>
            <CardTitle>Ganhos e gastos da Casa</CardTitle>
            {loadingLancamentos && <SpinnerIcon />}
          </CardHeader>

          <MovementToolbar>
            <SecondaryBtn type="button" onClick={() => handlePeriodoDelta(-1)}>
              Mes anterior
            </SecondaryBtn>
            <MonthControl>{periodoLabel}</MonthControl>
            <SecondaryBtn type="button" onClick={() => handlePeriodoDelta(1)}>
              Proximo mes
            </SecondaryBtn>
          </MovementToolbar>

          {loadingLancamentos ? (
            <SkeletonCard rows={5} />
          ) : !lancamentosCasa || totalLancamentos === 0 ? (
            <EmptyState>
              <EmptyIcon><Icon name="wallet" size={36} /></EmptyIcon>
              <EmptyTitle>Nenhum lancamento encontrado</EmptyTitle>
              <EmptyDesc>
                Quando os membros registrarem ganhos ou gastos fixos/eventuais,
                tudo aparecera aqui consolidado por pessoa.
              </EmptyDesc>
            </EmptyState>
          ) : (
            <>
              <SummaryGrid>
                <SummaryCard>
                  <SummaryLabel>Ganhos fixos</SummaryLabel>
                  <SummaryValue positive>{formatBRL(resumo.total_ganhos_fixos)}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Ganhos eventuais</SummaryLabel>
                  <SummaryValue positive>{formatBRL(resumo.total_ganhos_eventuais)}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Gastos fixos</SummaryLabel>
                  <SummaryValue negative>{formatBRL(resumo.total_gastos_fixos)}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Gastos eventuais</SummaryLabel>
                  <SummaryValue negative>{formatBRL(resumo.total_gastos_eventuais)}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Saldo da Casa</SummaryLabel>
                  <SummaryValue positive={Number(resumo.saldo) >= 0} negative={Number(resumo.saldo) < 0}>
                    {formatBRL(resumo.saldo)}
                  </SummaryValue>
                </SummaryCard>
              </SummaryGrid>

              {grupos.map((grupo) => (
                <MemberMovementGroup key={grupo.membro.id}>
                  <MemberMovementHeader>
                    <MemberMovementTitle>
                      <MemberAvatar>{avatarInitials(grupo.membro.nome)}</MemberAvatar>
                      <div>
                        <MemberName>{grupo.membro.nome}</MemberName>
                        <MemberEmail>{grupo.membro.email}</MemberEmail>
                      </div>
                    </MemberMovementTitle>
                    <MemberMovementStats>
                      <span>Ganhos: <strong>{formatBRL(grupo.resumo.total_ganhos)}</strong></span>
                      <span>Gastos: <strong>{formatBRL(grupo.resumo.total_gastos)}</strong></span>
                      <span>Saldo: <strong>{formatBRL(grupo.resumo.saldo)}</strong></span>
                    </MemberMovementStats>
                  </MemberMovementHeader>

                  {grupo.lancamentos.length === 0 ? (
                    <EmptyDesc>Sem lancamentos neste periodo.</EmptyDesc>
                  ) : (
                    <MovementList>
                      {grupo.lancamentos.map((item) => (
                        <MovementItem key={`${item.subtipo}-${item.id}`}>
                          <MovementMain>
                            <MovementTitle>{item.descricao}</MovementTitle>
                            <MovementMeta>
                              {formatDate(item.data)} · {item.categoria || 'Sem categoria'}
                            </MovementMeta>
                            <MovementBadges>
                              <MovementBadge type={item.tipo}>{item.tipo === 'ganho' ? 'Ganho' : 'Gasto'}</MovementBadge>
                              <MovementBadge>{item.origem === 'fixo' ? 'Fixo' : 'Eventual'}</MovementBadge>
                            </MovementBadges>
                          </MovementMain>
                          <MovementValue type={item.tipo}>
                            {item.tipo === 'gasto' ? '-' : '+'}{formatBRL(item.valor)}
                          </MovementValue>
                        </MovementItem>
                      ))}
                    </MovementList>
                  )}
                </MemberMovementGroup>
              ))}
            </>
          )}
        </Card>
      </FullWidthCard>
    );
  };

  const renderMembros = () => (
    <FullWidthCard as="div">
      <Card>
        <CardHeader>
          <CardTitle>Membros ({totalMembros})</CardTitle>
          {isDono && (
            <SecondaryBtn onClick={() => setShowConviteModal(true)}>
              + Convidar
            </SecondaryBtn>
          )}
        </CardHeader>
        {loadingCasa ? (
          <SkeletonCard rows={3} />
        ) : membros.length === 0 ? (
          <EmptyState>
            <EmptyIcon><Icon name="people" size={36} /></EmptyIcon>
            <EmptyTitle>Nenhum membro encontrado</EmptyTitle>
            <EmptyDesc>Convide pessoas para participar da sua Casa.</EmptyDesc>
          </EmptyState>
        ) : (
          <MemberList>
            {membros.map((m) => {
              const nome  = m.user?.nome ?? m.user?.email ?? `Membro #${m.id}`;
              const email = m.user?.email ?? '';
              const isMe  = m.user?.id === userId || m.user === userId;
              return (
                <MemberItem key={m.id}>
                  <MemberAvatar>{avatarInitials(nome)}</MemberAvatar>
                  <MemberInfo>
                    <MemberName>{nome}{isMe && ' (você)'}</MemberName>
                    <MemberEmail>{email}</MemberEmail>
                  </MemberInfo>
                  <MemberRole role={m.papel}>{m.papel === 'dono' ? 'Dono' : 'Membro'}</MemberRole>
                  {isDono && !isMe && (
                    <DangerBtn
                      onClick={() => setConfirmRemoveMembro(m)}
                      disabled={removingId === m.id}
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    >
                      {removingId === m.id ? <SpinnerIcon /> : 'Remover'}
                    </DangerBtn>
                  )}
                </MemberItem>
              );
            })}
          </MemberList>
        )}
      </Card>
    </FullWidthCard>
  );

  /* ── render: metas ─────────────────────────────────────────── */
  const renderMetas = () => (
    <FullWidthCard as="div">
      <Card>
        <CardHeader>
          <CardTitle>Metas financeiras</CardTitle>
          <PrimaryBtn onClick={() => handleOpenMetaModal()}>+ Nova meta</PrimaryBtn>
        </CardHeader>
        {loadingMetas ? (
          <SkeletonCard rows={4} />
        ) : metas.length === 0 ? (
          <EmptyState>
            <EmptyIcon><Icon name="trend" size={36} /></EmptyIcon>
            <EmptyTitle>Nenhuma meta cadastrada</EmptyTitle>
            <EmptyDesc>
              Defina metas coletivas para a Casa acompanhar o progresso juntos.
            </EmptyDesc>
            <PrimaryBtn onClick={() => handleOpenMetaModal()} style={{ marginTop: '0.5rem' }}>
              Criar primeira meta
            </PrimaryBtn>
          </EmptyState>
        ) : (
          <MetaList>
            {metas.map((meta) => {
              const pct = meta.valor_meta > 0
                ? (Number(meta.valor_acumulado) / Number(meta.valor_meta)) * 100
                : 0;
              return (
                <MetaItem key={meta.id}>
                  <MetaHeader>
                    <MetaName>{meta.descricao}</MetaName>
                    <MetaActions>
                      <GhostBtn
                        onClick={() => handleOpenMetaModal(meta)}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Editar
                      </GhostBtn>
                      <DangerBtn
                        onClick={() => handleExcluirMeta(meta.id)}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Excluir
                      </DangerBtn>
                    </MetaActions>
                  </MetaHeader>
                  <MetaValues>
                    <span>Acumulado: <strong>{formatBRL(meta.valor_acumulado)}</strong></span>
                    <span>Meta: <strong>{formatBRL(meta.valor_meta)}</strong></span>
                    <span>{pct.toFixed(0)}% concluído</span>
                  </MetaValues>
                  <MetaProgressBar pct={pct} />
                  {meta.prazo && (
                    <MetaDeadline>Prazo: {formatDate(meta.prazo)}</MetaDeadline>
                  )}
                </MetaItem>
              );
            })}
          </MetaList>
        )}
      </Card>
    </FullWidthCard>
  );

  /* ── render principal ──────────────────────────────────────── */
  return (
    <PageWrapper>
      <PageHeader>
        <HeaderInfo>
          <PageTitle>Casa</PageTitle>
          <PageSubtitle>
            Gerencie finanças coletivas, metas e membros da sua família.
          </PageSubtitle>
        </HeaderInfo>
        {casa && (
          <HeaderActions>
            {isDono ? (
              <DangerBtn onClick={() => setShowEncerrarModal(true)}>
                Encerrar Casa
              </DangerBtn>
            ) : (
              <SecondaryBtn onClick={() => setShowSairModal(true)}>
                Sair da Casa
              </SecondaryBtn>
            )}
          </HeaderActions>
        )}
      </PageHeader>

      {error   && <ErrorBanner>{error}</ErrorBanner>}
      {success && <SuccessBanner>{success}</SuccessBanner>}
      {inviteLink && (
        <InviteLinkPanel>
          <InviteLinkText>
            Envie este link para a pessoa convidada. Se ela ainda não tiver conta,
            poderá criar uma conta pelo link e entrar direto na sua Casa.
          </InviteLinkText>
          <InviteLinkActions>
            <InviteLinkInput
              value={inviteLink}
              readOnly
              onFocus={(event) => event.target.select()}
              aria-label="Link do convite"
            />
            <SecondaryBtn type="button" onClick={handleCopiarConvite}>
              Copiar link
            </SecondaryBtn>
          </InviteLinkActions>
        </InviteLinkPanel>
      )}

      {loadingCasa ? (
        <SkeletonCard rows={4} />
      ) : !casa ? (
        renderNoCasa()
      ) : (
        <>
          {/* Banner informativo */}
          <CasaBanner>
            <CasaIconBig><Icon name="home" size={24} /></CasaIconBig>
            <CasaInfoText>
              <CasaNome>{casa.nome}</CasaNome>
              <CasaMeta>
                {totalMembros} membro{totalMembros !== 1 ? 's' : ''} · criada em{' '}
                {formatDate(casa.created_at)}
              </CasaMeta>
            </CasaInfoText>
          </CasaBanner>

          <TabBar>
            {TABS.map((tab) => (
              <Tab
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Tab>
            ))}
          </TabBar>

          {activeTab === 'painel'       && renderPainel()}
          {activeTab === 'lancamentos' && renderLancamentos()}
          {activeTab === 'membros'      && renderMembros()}
          {activeTab === 'metas'        && renderMetas()}
        </>
      )}

      {/* ── modal criar casa ─────────────────────────────────── */}
      {showCriarModal && (
        <ModalOverlay onClick={() => setShowCriarModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Criar uma Casa</ModalTitle>
            <ModalText>Dê um nome para sua Casa. Você será o dono e poderá convidar membros.</ModalText>
            <FormGroup>
              <FormLabel>Nome da Casa</FormLabel>
              <FormInput
                type="text"
                placeholder="Ex: Família Ribeiro"
                value={nomeCasa}
                onChange={(e) => setNomeCasa(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCriarCasa()}
                autoFocus
              />
            </FormGroup>
            <ModalActions>
              <SecondaryBtn onClick={() => setShowCriarModal(false)}>Cancelar</SecondaryBtn>
              <PrimaryBtn onClick={handleCriarCasa} disabled={savingCasa || !nomeCasa.trim()}>
                {savingCasa ? <SpinnerIcon /> : 'Criar Casa'}
              </PrimaryBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── modal convite ─────────────────────────────────────── */}
      {showConviteModal && (
        <ModalOverlay onClick={() => setShowConviteModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Convidar membro</ModalTitle>
            <ModalText>
              Informe o e-mail da pessoa para gerar o convite de entrada em{' '}
              <strong>{casa?.nome}</strong>.
            </ModalText>
            <FormGroup>
              <FormLabel>E-mail</FormLabel>
              <FormInput
                type="email"
                placeholder="nome@email.com"
                value={emailConvite}
                onChange={(e) => setEmailConvite(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnviarConvite()}
                autoFocus
              />
            </FormGroup>
            <ModalActions>
              <SecondaryBtn onClick={() => setShowConviteModal(false)}>Cancelar</SecondaryBtn>
              <PrimaryBtn onClick={handleEnviarConvite} disabled={savingConvite || !emailConvite.trim()}>
                {savingConvite ? <SpinnerIcon /> : 'Enviar convite'}
              </PrimaryBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── modal meta ────────────────────────────────────────── */}
      {showMetaModal && (
        <ModalOverlay onClick={() => setShowMetaModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingMeta ? 'Editar meta' : 'Nova meta'}</ModalTitle>
            <FormGroup>
              <FormLabel>Descrição</FormLabel>
              <FormInput
                type="text"
                placeholder="Ex: Viagem para Europa"
                value={metaForm.descricao}
                onChange={(e) => setMetaForm((p) => ({ ...p, descricao: e.target.value }))}
                autoFocus
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Valor da meta (R$)</FormLabel>
              <FormInput
                type="number"
                min="0"
                step="0.01"
                placeholder="15000.00"
                value={metaForm.valor_meta}
                onChange={(e) => setMetaForm((p) => ({ ...p, valor_meta: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Valor acumulado (R$)</FormLabel>
              <FormInput
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={metaForm.valor_acumulado}
                onChange={(e) => setMetaForm((p) => ({ ...p, valor_acumulado: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Prazo</FormLabel>
              <FormInput
                type="date"
                value={metaForm.prazo}
                onChange={(e) => setMetaForm((p) => ({ ...p, prazo: e.target.value }))}
              />
            </FormGroup>
            <ModalActions>
              <SecondaryBtn onClick={() => setShowMetaModal(false)}>Cancelar</SecondaryBtn>
              <PrimaryBtn
                onClick={handleSalvarMeta}
                disabled={savingMeta || !metaForm.descricao.trim() || !metaForm.valor_meta}
              >
                {savingMeta ? <SpinnerIcon /> : editingMeta ? 'Salvar' : 'Criar meta'}
              </PrimaryBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── modal encerrar casa ───────────────────────────────── */}
      {showEncerrarModal && (
        <ModalOverlay onClick={() => setShowEncerrarModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Encerrar Casa?</ModalTitle>
            <ModalText>
              Isso vai excluir <strong>{casa?.nome}</strong> permanentemente, removendo todos os membros e metas. Esta ação não pode ser desfeita.
            </ModalText>
            <ModalActions>
              <SecondaryBtn onClick={() => setShowEncerrarModal(false)}>Cancelar</SecondaryBtn>
              <DangerBtn onClick={handleEncerrarCasa} disabled={savingCasa}>
                {savingCasa ? <SpinnerIcon /> : 'Encerrar Casa'}
              </DangerBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── modal sair da casa ────────────────────────────────── */}
      {showSairModal && (
        <ModalOverlay onClick={() => setShowSairModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Sair da Casa?</ModalTitle>
            <ModalText>
              Você vai sair de <strong>{casa?.nome}</strong>. Poderá ser convidado novamente a qualquer momento.
            </ModalText>
            <ModalActions>
              <SecondaryBtn onClick={() => setShowSairModal(false)}>Cancelar</SecondaryBtn>
              <DangerBtn onClick={handleSairCasa} disabled={savingCasa}>
                {savingCasa ? <SpinnerIcon /> : 'Sair da Casa'}
              </DangerBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── modal remover membro ──────────────────────────────── */}
      {confirmRemoveMembro && (
        <ModalOverlay onClick={() => setConfirmRemoveMembro(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Remover membro?</ModalTitle>
            <ModalText>
              Isso vai remover <strong>{confirmRemoveMembro.user?.nome ?? 'este membro'}</strong> da Casa.
              Ele pode ser convidado novamente depois.
            </ModalText>
            <ModalActions>
              <SecondaryBtn onClick={() => setConfirmRemoveMembro(null)}>Cancelar</SecondaryBtn>
              <DangerBtn onClick={handleRemoverMembro} disabled={!!removingId}>
                {removingId ? <SpinnerIcon /> : 'Remover'}
              </DangerBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}
