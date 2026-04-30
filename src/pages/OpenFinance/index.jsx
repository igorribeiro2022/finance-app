import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../components/Icon';
import api from '../../services/api';
import {
  getBanks,
  getConsents,
  createConsent,
  revokeConsent,
  getAccounts,
  syncAccounts,
  getTransactions,
} from '../../services/openfinance';

import {
  PageWrapper, PageHeader, HeaderInfo, PageTitle, PageSubtitle, HeaderActions,
  TabBar, Tab,
  Card, CardHeader, CardTitle, CardAction,
  ContentGrid, FullWidthCard,
  InsightHero, InsightIcon, InsightText, InsightTitle, InsightDescription, InsightMeta,
  KpiGrid, KpiCard, KpiLabel, KpiValue, KpiVariation,
  AccountList, AccountItem, AccountLeft, AccountLogo, AccountName, AccountType,
  AccountBalance, TotalBalance, TotalLabel, TotalValue,
  ConsentList, ConsentItem, ConsentInfo, ConsentBank, ConsentExpiry,
  ConsentActions, StatusBadge,
  TransactionGroup, TransactionDate, TransactionList, TransactionItem,
  TransactionLeft, TransactionIcon, TransactionDesc, TransactionCategory, TransactionValue,
  FiltersRow, FilterSelect, FilterInput,
  BanksGrid, BankCard, BankLogo, BankName, BankStatus,
  PrimaryBtn, SecondaryBtn, DangerBtn, SpinnerIcon,
  SkeletonBlock,
  EmptyState, EmptyIcon, EmptyTitle, EmptyDesc,
  ErrorBanner,
  ModalOverlay, ModalBox, ModalTitle, ModalText, ModalActions,
  HeatmapGrid, HeatmapDayLabel, HeatmapCell, HeatmapSummary,
  HeatmapStat, HeatmapStatLabel, HeatmapStatValue,
  CategoryTable, CategoryRow, CategoryRowHeader, CategoryColLabel,
  CategoryName, CategoryEmoji, CategoryAmount, CategoryVariation, CategoryPrev,
  SubscriptionList, SubscriptionItem, SubscriptionLeft, SubscriptionIcon,
  SubscriptionName, SubscriptionDue, SubscriptionAmount,
  SubscriptionTotal, SubscriptionTotalLabel, SubscriptionTotalValue,
  InstallmentList, InstallmentItem, InstallmentInfo, InstallmentName,
  InstallmentProgress, InstallmentProgressBar, InstallmentAmount,
  CardsEmptyState, CardsEmptyIcon,
  ChatFab, Tooltip,
} from './styles';

/* ── Helpers ────────────────────────────────────────────────────── */
function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function formatDateBR(iso) {
  if (!iso) return '-';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateGroupLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

const CATEGORY_ICON_NAMES = {
  Transporte: 'card',
  Alimentação: 'wallet',
  Restaurantes: 'wallet',
  Supermercado: 'wallet',
  Eletrônicos: 'card',
  Empréstimos: 'bank',
  Transferências: 'openFinance',
  Saúde: 'alert',
  Educação: 'categories',
  Lazer: 'event',
  Moradia: 'home',
  Assinaturas: 'event',
  Estorno: 'trend',
  Outros: 'categories',
};

function getCategoryIcon(cat, size = 16) {
  if (!cat) return <Icon name="categories" size={size} />;
  for (const key of Object.keys(CATEGORY_ICON_NAMES)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) {
      return <Icon name={CATEGORY_ICON_NAMES[key]} size={size} />;
    }
  }
  return <Icon name="categories" size={size} />;
}

const ACCOUNT_TYPE_LABEL = {
  corrente: 'Conta corrente',
  poupança: 'Poupança',
  poupanca: 'Poupança',
  investimento: 'Investimento',
};

function getAccountTypeLabel(tipo) {
  return ACCOUNT_TYPE_LABEL[tipo] || tipo || 'Conta';
}

function firstDefinedValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeId(value) {
  const resolved = firstDefinedValue(value);
  return resolved === undefined ? '' : String(resolved);
}

function resolveAssetUrl(value) {
  const rawValue = String(firstDefinedValue(value) || '').trim();

  if (!rawValue || rawValue === 'null' || rawValue === 'undefined') return '';
  if (rawValue.startsWith('data:') || rawValue.startsWith('blob:')) return rawValue;
  if (rawValue.startsWith('//')) return `https:${rawValue}`;
  if (/^https?:\/\//i.test(rawValue)) return rawValue;

  try {
    return new URL(rawValue, api.defaults.baseURL || window.location.origin).toString();
  } catch {
    return rawValue;
  }
}

function getDisplayInitial(name) {
  return String(name || '?').trim().charAt(0).toUpperCase() || '?';
}

function getCollectionFromPayload(payload, keys = []) {
  const candidateKeys = [
    'results', 'data', 'items', 'list', 'banks', 'institutions',
    'consents', 'accounts', 'transactions', ...keys,
  ];

  const queue = [payload];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (Array.isArray(current)) return current;
    if (!current || typeof current !== 'object' || visited.has(current)) continue;

    visited.add(current);

    for (const key of candidateKeys) {
      if (Array.isArray(current[key])) return current[key];
    }

    for (const key of candidateKeys) {
      const nextValue = current[key];
      if (nextValue && typeof nextValue === 'object') queue.push(nextValue);
    }

    const objectValues = Object.values(current).filter(
      (value) => value && typeof value === 'object' && !Array.isArray(value)
    );
    const looksLikeEntityMap = objectValues.length > 0 && objectValues.every((value) => (
      value.id !== undefined
      || value.name !== undefined
      || value.nome !== undefined
      || value.institution_id !== undefined
      || value.bank_id !== undefined
    ));

    if (looksLikeEntityMap) return objectValues;
  }

  return [];
}

function normalizeInstitution(rawInstitution) {
  const institution = rawInstitution && typeof rawInstitution === 'object' ? rawInstitution : {};
  const id = normalizeId(
    firstDefinedValue(
      institution.id, institution.institution_id, institution.institutionId,
      institution.bank_id, institution.bankId, institution.provider_id,
      institution.providerId, institution.connector_id, institution.connectorId,
      institution.organization_id, institution.organizationId,
      institution.codigo, institution.code, institution.ispb, institution.uuid
    )
  );

  return {
    ...institution,
    id,
    institution_id: normalizeId(firstDefinedValue(institution.institution_id, id)),
    nome: firstDefinedValue(
      institution.nome, institution.name, institution.institution_name,
      institution.institutionName, institution.trade_name, institution.tradeName,
      institution.display_name, institution.displayName, institution.razao_social,
      institution.brand_name, institution.brandName
    ) || '',
    logo_url: resolveAssetUrl(firstDefinedValue(
      institution.logo_url, institution.logoUrl, institution.logo,
      institution.image_url, institution.imageUrl, institution.icon_url,
      institution.iconUrl, institution.brand_logo_url, institution.brandLogoUrl
    ) || ''),
  };
}

function normalizeBank(rawBank) {
  const bank = rawBank && typeof rawBank === 'object' ? rawBank : {};
  const nestedInstitution = normalizeInstitution(bank.institution);
  const id = normalizeId(
    firstDefinedValue(
      bank.id, bank.institution_id, bank.institutionId, bank.bank_id, bank.bankId,
      bank.provider_id, bank.providerId, bank.connector_id, bank.connectorId,
      bank.organization_id, bank.organizationId, bank.codigo, bank.code,
      bank.ispb, bank.uuid, nestedInstitution.id, nestedInstitution.institution_id
    )
  );

  return {
    ...bank,
    id,
    institution_id: normalizeId(firstDefinedValue(bank.institution_id, id)),
    nome: firstDefinedValue(
      bank.nome, bank.name, bank.institution_name, bank.institutionName,
      bank.trade_name, bank.tradeName, bank.display_name, bank.displayName,
      bank.razao_social, bank.brand_name, bank.brandName, nestedInstitution.nome
    ) || 'Instituição financeira',
    logo_url: resolveAssetUrl(firstDefinedValue(
      bank.logo_url, bank.logoUrl, bank.logo, bank.image_url, bank.imageUrl,
      bank.icon_url, bank.iconUrl, bank.brand_logo_url, bank.brandLogoUrl,
      nestedInstitution.logo_url
    ) || ''),
  };
}

function normalizeConsent(rawConsent) {
  const consent = rawConsent && typeof rawConsent === 'object' ? rawConsent : {};
  const institution = normalizeInstitution(
    firstDefinedValue(consent.institution, consent.bank, consent.instituicao)
  );
  const institutionId = normalizeId(
    firstDefinedValue(
      consent.institution_id, consent.institutionId,
      consent.bank_id, consent.bankId,
      institution.id, institution.institution_id
    )
  );

  return {
    ...consent,
    status: String(firstDefinedValue(consent.status, consent.state, '')).trim().toLowerCase(),
    institution_id: institutionId,
    institution: {
      ...institution,
      id: normalizeId(firstDefinedValue(institution.id, institutionId)),
      nome: institution.nome || firstDefinedValue(
        consent.institution_name, consent.institutionName,
        consent.bank_name, consent.bankName
      ) || '',
      logo_url: resolveAssetUrl(institution.logo_url || firstDefinedValue(
        consent.institution_logo_url, consent.institutionLogoUrl
      ) || ''),
    },
  };
}

function normalizeAccount(rawAccount) {
  const account = rawAccount && typeof rawAccount === 'object' ? rawAccount : {};
  const institution = normalizeInstitution(
    firstDefinedValue(account.institution, account.bank, account.instituicao)
  );

  return {
    ...account,
    institution,
    nome_conta: firstDefinedValue(account.nome_conta, account.account_name, account.name) || '',
    tipo: firstDefinedValue(account.tipo, account.account_type, account.type) || '',
    saldo: firstDefinedValue(account.saldo, account.balance, account.available_balance, 0),
  };
}

function normalizeTransaction(rawTransaction) {
  const transaction = rawTransaction && typeof rawTransaction === 'object' ? rawTransaction : {};

  return {
    ...transaction,
    descricao: firstDefinedValue(transaction.descricao, transaction.description, transaction.nome) || 'Transação',
    categoria: firstDefinedValue(transaction.categoria, transaction.category, transaction.categoria_nome) || '',
    tipo: firstDefinedValue(transaction.tipo, transaction.type, transaction.transaction_type) || '',
    valor: firstDefinedValue(transaction.valor, transaction.amount, 0),
    data: firstDefinedValue(transaction.data, transaction.date, transaction.transaction_date) || '',
  };
}

const CONNECTED_CONSENT_STATUSES = new Set([
  'ativo', 'active', 'authorized', 'authorised', 'approved', 'connected', 'linked',
]);

/* ── Pluggy Connect Widget ──────────────────────────────────────── */
function loadPluggyScript() {
  return new Promise((resolve, reject) => {
    if (window.PluggyConnect) return resolve();
    const existing = document.querySelector('script[data-pluggy]');
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    // URL corrigida: /latest/ no lugar de /v2/.
    script.src = 'https://cdn.pluggy.ai/pluggy-connect/latest/pluggy-connect.js';
    script.setAttribute('data-pluggy', 'true');
    script.onload = resolve;
    script.onerror = () => reject(new Error('Falha ao carregar o Pluggy Connect.'));
    document.head.appendChild(script);
  });
}

/* ── Skeleton helpers ───────────────────────────────────────────── */
function SkeletonCard({ rows = 3 }) {
  return (
    <Card>
      <CardHeader>
        <SkeletonBlock h="14px" w="120px" />
      </CardHeader>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} h="40px" style={{ marginBottom: 8 }} />
      ))}
    </Card>
  );
}

function InstitutionLogo({ Component, logoUrl, name }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  return (
    <Component>
      {!logoUrl || hasError ? (
        getDisplayInitial(name)
      ) : (
        <img
          src={logoUrl}
          alt={name || 'InstituiÃ§Ã£o'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      )}
    </Component>
  );
}

/* ── Componente principal ───────────────────────────────────────── */
const TABS = [
  { key: 'overview',      label: 'Visão geral' },
  { key: 'transactions',  label: 'Transações' },
  { key: 'installments',  label: 'Parcelamentos' },
  { key: 'subscriptions', label: 'Assinaturas' },
  { key: 'categories',    label: 'Categorias' },
  { key: 'cards',         label: 'Cartões' },
];

export default function OpenFinance() {
  const auth = useSelector((state) => state.auth);
  const userName = auth?.user?.nome?.split(' ')[0] ?? 'você';

  const [activeTab, setActiveTab] = useState('overview');

  const [banks, setBanks]               = useState([]);
  const [consents, setConsents]         = useState([]);
  const [accounts, setAccounts]         = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loadingBanks, setLoadingBanks]               = useState(true);
  const [loadingAccounts, setLoadingAccounts]         = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const [syncing, setSyncing]             = useState(false);
  const [connectingId, setConnectingId]   = useState(null);
  const [revokingId, setRevokingId]       = useState(null);
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const [txFilters, setTxFilters] = useState({
    tipo: '', categoria: '', data_inicio: '', data_fim: '',
  });

  const [error, setError] = useState('');

  const connectedBankIds = useMemo(
    () => new Set(
      consents
        .filter((c) => CONNECTED_CONSENT_STATUSES.has(c.status))
        .map((c) => normalizeId(firstDefinedValue(c.institution?.id, c.institution_id)))
        .filter(Boolean)
    ),
    [consents]
  );

  const availableBanks = useMemo(
    () => banks.filter((bank) => {
      const bankId = normalizeId(firstDefinedValue(bank.id, bank.institution_id));
      return bankId && !connectedBankIds.has(bankId);
    }),
    [banks, connectedBankIds]
  );

  /* ── Carregamento de dados ────────────────────────────────────── */
  const loadBanks = useCallback(async () => {
    try {
      setLoadingBanks(true);
      const res = await getBanks();
      const data = getCollectionFromPayload(res.data, ['banks', 'institutions']);
      setBanks(data.map(normalizeBank).filter((b) => b.id || b.nome));
    } catch {
      setError('Erro ao carregar instituições disponíveis.');
    } finally {
      setLoadingBanks(false);
    }
  }, []);

  const loadConsents = useCallback(async () => {
    try {
      const res = await getConsents();
      const data = getCollectionFromPayload(res.data, ['consents']);
      setConsents(data.map(normalizeConsent).filter((c) => c.id || c.institution_id));
    } catch { /* silencioso */ }
  }, []);

  const loadAccounts = useCallback(async () => {
    try {
      setLoadingAccounts(true);
      const res = await getAccounts();
      const data = getCollectionFromPayload(res.data, ['accounts']);
      setAccounts(data.map(normalizeAccount).filter((a) => a.id || a.nome_conta));
    } catch { /* silencioso */ }
    finally { setLoadingAccounts(false); }
  }, []);

  const loadTransactions = useCallback(async (filters) => {
    try {
      setLoadingTransactions(true);
      const params = {};
      if (filters?.tipo)        params.tipo        = filters.tipo;
      if (filters?.categoria)   params.categoria   = filters.categoria;
      if (filters?.data_inicio) params.data_inicio = filters.data_inicio;
      if (filters?.data_fim)    params.data_fim    = filters.data_fim;
      const res = await getTransactions(params);
      const data = getCollectionFromPayload(res.data, ['transactions']);
      setTransactions(data.map(normalizeTransaction));
    } catch { /* silencioso */ }
    finally { setLoadingTransactions(false); }
  }, []);

  useEffect(() => {
    loadBanks();
    loadConsents();
    loadAccounts();
    loadTransactions({});
  }, [loadBanks, loadConsents, loadAccounts, loadTransactions]);

  /* ── Ações ────────────────────────────────────────────────────── */
  const handleConnect = useCallback(async (bank) => {
    if (!bank?.id) {
      setError('Selecione um banco válido para iniciar a conexão.');
      return;
    }

    setError('');
    setShowConnectModal(false);
    setConnectingId(bank.id);

    try {
      const res = await createConsent({ institution_id: bank.id });
      const connectToken = res.data?.connect_token;

      if (!connectToken) {
        throw new Error('connect_token não retornado pelo servidor.');
      }

      await loadPluggyScript();

      const pluggyConnect = new window.PluggyConnect({
        connectToken,
        onSuccess: async ({ item }) => {
          console.log('Pluggy: item conectado', item);
          await loadAccounts();
          await loadConsents();
          await loadTransactions({});
        },
        onError: (err) => {
          console.error('Pluggy: erro no widget', err);
          setError('Erro durante a autorização. Tente novamente.');
        },
        onClose: () => {
          // widget fechado sem completar — sem ação necessária
        },
      });

      // .init() renderiza o widget no body.
    await pluggyConnect.init();

    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Falha ao iniciar conexão. Tente novamente.';
      console.error('Erro ao conectar banco:', err?.response?.data ?? err);
      setError(`Erro: ${detail}`);
    } finally {
      setConnectingId(null);
    }
  }, [loadAccounts, loadConsents, loadTransactions]);

  const handleStartBankConnection = useCallback(() => {
    setError('');
    if (activeTab !== 'overview') setActiveTab('overview');
    if (!loadingBanks && availableBanks.length === 1) {
      handleConnect(availableBanks[0]);
      return;
    }
    setShowConnectModal(true);
  }, [activeTab, availableBanks, handleConnect, loadingBanks]);

  const handleSync = async () => {
    setError('');
    setSyncing(true);
    try {
      await syncAccounts();
      await loadAccounts();
      await loadTransactions(txFilters);
      await loadConsents();
    } catch {
      setError('Erro ao sincronizar. Tente novamente.');
    } finally {
      setSyncing(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirmRevoke) return;
    setRevokingId(confirmRevoke.id);
    try {
      await revokeConsent(confirmRevoke.id);
      setConfirmRevoke(null);
      await loadConsents();
      await loadAccounts();
    } catch {
      setError('Erro ao revogar acesso.');
    } finally {
      setRevokingId(null);
    }
  };

  const handleApplyFilters = () => loadTransactions(txFilters);

  /* ── Derivações ───────────────────────────────────────────────── */
  const totalBalance = useMemo(
    () => accounts.reduce((acc, a) => acc + Number(a.saldo || 0), 0),
    [accounts]
  );

  const now = new Date();
  const mesAtual = now.getMonth();
  const anoAtual = now.getFullYear();

  const txDoMes = useMemo(() =>
    transactions.filter((t) => {
      if (!t.data) return false;
      const d = new Date(t.data + 'T00:00:00');
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    }),
    [transactions, mesAtual, anoAtual]
  );

  const gastoMes = useMemo(
    () => txDoMes.filter(t => t.tipo === 'debito').reduce((s, t) => s + Number(t.valor || 0), 0),
    [txDoMes]
  );

  const topCategory = useMemo(() => {
    const map = {};
    txDoMes.filter(t => t.tipo === 'debito').forEach(t => {
      const cat = t.categoria || 'Outros';
      map[cat] = (map[cat] || 0) + Number(t.valor || 0);
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? '-';
  }, [txDoMes]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach((t) => {
      const key = t.data || 'Sem data';
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => (b > a ? 1 : -1))
      .slice(0, 10);
  }, [transactions]);

  const heatmapData = useMemo(() => {
    const map = {};
    txDoMes.filter(t => t.tipo === 'debito').forEach(t => {
      const day = new Date(t.data + 'T00:00:00').getDate();
      map[day] = (map[day] || 0) + Number(t.valor || 0);
    });
    return map;
  }, [txDoMes]);

  const heatmapMax = useMemo(
    () => Math.max(...Object.values(heatmapData), 1),
    [heatmapData]
  );

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const mediaDiaria = txDoMes.length > 0 ? gastoMes / diasNoMes : 0;
  const picoDia = Object.entries(heatmapData).sort((a, b) => b[1] - a[1])[0];

  const categoriesRanking = useMemo(() => {
    const map = {};
    txDoMes.filter(t => t.tipo === 'debito').forEach(t => {
      const cat = t.categoria || 'Outros';
      if (!map[cat]) map[cat] = { current: 0, previous: 0 };
      map[cat].current += Number(t.valor || 0);
    });
    return Object.entries(map)
      .map(([name, vals]) => ({ name, ...vals }))
      .sort((a, b) => b.current - a.current)
      .slice(0, 8);
  }, [txDoMes]);

  const subscriptions = useMemo(
    () => transactions.filter(t => t.is_recurring || t.origem === 'recorrente'),
    [transactions]
  );

  const totalSubscriptions = useMemo(
    () => subscriptions.reduce((s, t) => s + Number(t.valor || 0), 0),
    [subscriptions]
  );

  const installments = useMemo(
    () => transactions.filter(t => t.is_installment),
    [transactions]
  );

  const insight = useMemo(() => {
    if (gastoMes === 0) {
      return {
        title: `Ola, ${userName}! Seus dados estao sendo carregados.`,
        desc: 'Conecte seu banco para começar a acompanhar suas finanças em tempo real.',
      };
    }
    if (topCategory !== '-') {
      return {
        title: `${userName}, sua maior despesa este mes e em ${topCategory}.`,
        desc: `Você já gastou ${formatBRL(gastoMes)} em ${new Date().toLocaleDateString('pt-BR', { month: 'long' })}. Fique de olho nos seus padrões de consumo.`,
      };
    }
    return {
      title: `Tudo certo, ${userName}! Continue acompanhando suas finanças.`,
      desc: `Saldo consolidado de ${formatBRL(totalBalance)} em ${accounts.length} conta${accounts.length !== 1 ? 's' : ''} conectada${accounts.length !== 1 ? 's' : ''}.`,
    };
  }, [userName, gastoMes, topCategory, totalBalance, accounts]);

  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /* ── Render por tab ───────────────────────────────────────────── */
  const renderOverview = () => (
    <>
      <InsightHero>
        <InsightIcon><Icon name="trend" size={28} /></InsightIcon>
        <InsightText>
          <InsightTitle>{insight.title}</InsightTitle>
          <InsightDescription>{insight.desc}</InsightDescription>
          <InsightMeta>
            Atualizado em {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </InsightMeta>
        </InsightText>
      </InsightHero>

      <KpiGrid>
        <KpiCard>
          <KpiLabel>Gasto em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</KpiLabel>
          <KpiValue>{formatBRL(gastoMes)}</KpiValue>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Maior categoria</KpiLabel>
          <KpiValue style={{ fontSize: 'var(--text-lg, 1.25rem)' }}>
            {getCategoryIcon(topCategory, 18)} {topCategory}
          </KpiValue>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Saldo total consolidado</KpiLabel>
          <KpiValue>{formatBRL(totalBalance)}</KpiValue>
          {accounts.length > 0 && (
            <KpiVariation positive>
              {accounts.length} conta{accounts.length !== 1 ? 's' : ''} conectada{accounts.length !== 1 ? 's' : ''}
            </KpiVariation>
          )}
        </KpiCard>
      </KpiGrid>

      <ContentGrid>
        <Card>
          <CardHeader>
            <CardTitle>Contas conectadas</CardTitle>
            <CardAction onClick={() => setActiveTab('transactions')}>ver transações</CardAction>
          </CardHeader>
          {loadingAccounts ? (
            <SkeletonCard rows={2} />
          ) : accounts.length === 0 ? (
            <EmptyState>
              <EmptyIcon><Icon name="bank" size={36} /></EmptyIcon>
              <EmptyTitle>Nenhuma conta conectada</EmptyTitle>
              <EmptyDesc>Conecte seu banco via Open Finance para ver seus saldos aqui.</EmptyDesc>
            </EmptyState>
          ) : (
            <>
              <TotalBalance>
                <TotalLabel>Saldo total</TotalLabel>
                <TotalValue>{formatBRL(totalBalance)}</TotalValue>
              </TotalBalance>
              <AccountList>
                {accounts.map((acc) => (
                  <AccountItem key={acc.id}>
                    <AccountLeft>
                      <InstitutionLogo
                        Component={AccountLogo}
                        logoUrl={acc.institution?.logo_url}
                        name={acc.institution?.nome ?? acc.nome_conta}
                      />
                      <div>
                        <AccountName>{acc.institution?.nome ?? acc.nome_conta}</AccountName>
                        <AccountType>{getAccountTypeLabel(acc.tipo)}</AccountType>
                      </div>
                    </AccountLeft>
                    <AccountBalance>{formatBRL(acc.saldo)}</AccountBalance>
                  </AccountItem>
                ))}
              </AccountList>
            </>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mapa de calor</CardTitle>
            <CardAction onClick={() => setActiveTab('transactions')}>ver mais</CardAction>
          </CardHeader>
          <HeatmapSummary>
            <HeatmapStat>
              <HeatmapStatLabel>Total do mês</HeatmapStatLabel>
              <HeatmapStatValue>{formatBRL(gastoMes)}</HeatmapStatValue>
            </HeatmapStat>
            <HeatmapStat>
              <HeatmapStatLabel>Média diária</HeatmapStatLabel>
              <HeatmapStatValue>{formatBRL(mediaDiaria)}</HeatmapStatValue>
            </HeatmapStat>
            {picoDia && (
              <HeatmapStat>
                <HeatmapStatLabel>Maior pico</HeatmapStatLabel>
                <HeatmapStatValue>{formatBRL(picoDia[1])} — dia {picoDia[0]}</HeatmapStatValue>
              </HeatmapStat>
            )}
          </HeatmapSummary>
          <HeatmapGrid>
            {WEEKDAYS.map((d) => (
              <HeatmapDayLabel key={d}>{d}</HeatmapDayLabel>
            ))}
            {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: diasNoMes }).map((_, i) => {
              const day = i + 1;
              const val = heatmapData[day] || 0;
              const intensity = val ? val / heatmapMax : 0;
              return (
                <HeatmapCell
                  key={day}
                  intensity={intensity}
                  hasData={val > 0}
                  title={val > 0 ? `Dia ${day}: ${formatBRL(val)}` : `Dia ${day}`}
                  onClick={() => { if (val > 0) setActiveTab('transactions'); }}
                >
                  {val > 0 && <Tooltip>{formatBRL(val)}</Tooltip>}
                </HeatmapCell>
              );
            })}
          </HeatmapGrid>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transações recentes</CardTitle>
            <CardAction onClick={() => setActiveTab('transactions')}>ver todas</CardAction>
          </CardHeader>
          {loadingTransactions ? (
            <SkeletonCard rows={4} />
          ) : groupedTransactions.length === 0 ? (
            <EmptyState>
              <EmptyIcon><Icon name="categories" size={36} /></EmptyIcon>
              <EmptyTitle>Nenhuma transação encontrada</EmptyTitle>
              <EmptyDesc>Sincronize sua conta para importar as movimentações.</EmptyDesc>
            </EmptyState>
          ) : (
            groupedTransactions.slice(0, 3).map(([date, txs]) => (
              <TransactionGroup key={date}>
                <TransactionDate>{formatDateGroupLabel(date)}</TransactionDate>
                <TransactionList>
                  {txs.slice(0, 4).map((t) => (
                    <TransactionItem key={t.id}>
                      <TransactionLeft>
                        <TransactionIcon type={t.tipo}>
                          {getCategoryIcon(t.categoria)}
                        </TransactionIcon>
                        <div style={{ minWidth: 0 }}>
                          <TransactionDesc>{t.descricao}</TransactionDesc>
                          <TransactionCategory>{t.categoria || 'Outros'}</TransactionCategory>
                        </div>
                      </TransactionLeft>
                      <TransactionValue type={t.tipo}>
                        {t.tipo === 'credito' ? '+' : '-'} {formatBRL(t.valor)}
                      </TransactionValue>
                    </TransactionItem>
                  ))}
                </TransactionList>
              </TransactionGroup>
            ))
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assinaturas</CardTitle>
            <CardAction onClick={() => setActiveTab('subscriptions')}>ver todas</CardAction>
          </CardHeader>
          {subscriptions.length > 0 && (
            <SubscriptionTotal>
              <SubscriptionTotalLabel>Total mensal</SubscriptionTotalLabel>
              <SubscriptionTotalValue>{formatBRL(totalSubscriptions)}/mês</SubscriptionTotalValue>
            </SubscriptionTotal>
          )}
          {subscriptions.length === 0 ? (
            <EmptyState>
              <EmptyIcon><Icon name="event" size={36} /></EmptyIcon>
              <EmptyTitle>Nenhuma assinatura detectada</EmptyTitle>
              <EmptyDesc>Assinaturas recorrentes aparecerão aqui automaticamente.</EmptyDesc>
            </EmptyState>
          ) : (
            <SubscriptionList>
              {subscriptions.slice(0, 4).map((s) => (
                <SubscriptionItem key={s.id}>
                  <SubscriptionLeft>
                    <SubscriptionIcon><Icon name="event" size={18} /></SubscriptionIcon>
                    <div>
                      <SubscriptionName>{s.descricao}</SubscriptionName>
                      <SubscriptionDue>Próximo: {formatDateBR(s.data)}</SubscriptionDue>
                    </div>
                  </SubscriptionLeft>
                  <SubscriptionAmount>{formatBRL(s.valor)}</SubscriptionAmount>
                </SubscriptionItem>
              ))}
            </SubscriptionList>
          )}
        </Card>
      </ContentGrid>
    </>
  );

  const renderTransactions = () => (
    <FullWidthCard as="div" style={{ background: 'none', border: 'none', padding: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle>Extrato completo</CardTitle>
          <SecondaryBtn onClick={handleSync} disabled={syncing}>
            {syncing ? <SpinnerIcon /> : <Icon name="openFinance" size={16} />} Sincronizar
          </SecondaryBtn>
        </CardHeader>
        <FiltersRow>
          <FilterSelect
            value={txFilters.tipo}
            onChange={(e) => setTxFilters((p) => ({ ...p, tipo: e.target.value }))}
          >
            <option value="">Todos os tipos</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
          </FilterSelect>
          <FilterInput
            type="text"
            placeholder="Categoria"
            value={txFilters.categoria}
            onChange={(e) => setTxFilters((p) => ({ ...p, categoria: e.target.value }))}
          />
          <FilterInput
            type="date"
            value={txFilters.data_inicio}
            onChange={(e) => setTxFilters((p) => ({ ...p, data_inicio: e.target.value }))}
          />
          <FilterInput
            type="date"
            value={txFilters.data_fim}
            onChange={(e) => setTxFilters((p) => ({ ...p, data_fim: e.target.value }))}
          />
          <PrimaryBtn onClick={handleApplyFilters} disabled={loadingTransactions}>
            {loadingTransactions ? <SpinnerIcon /> : 'Filtrar'}
          </PrimaryBtn>
        </FiltersRow>

        {loadingTransactions ? (
          <SkeletonCard rows={6} />
        ) : groupedTransactions.length === 0 ? (
          <EmptyState>
            <EmptyIcon><Icon name="categories" size={36} /></EmptyIcon>
            <EmptyTitle>Nenhuma transação encontrada</EmptyTitle>
            <EmptyDesc>Ajuste os filtros ou sincronize sua conta para importar movimentações.</EmptyDesc>
          </EmptyState>
        ) : (
          groupedTransactions.map(([date, txs]) => (
            <TransactionGroup key={date}>
              <TransactionDate>{formatDateGroupLabel(date)}</TransactionDate>
              <TransactionList>
                {txs.map((t) => (
                  <TransactionItem key={t.id}>
                    <TransactionLeft>
                      <TransactionIcon type={t.tipo}>
                        {getCategoryIcon(t.categoria)}
                      </TransactionIcon>
                      <div style={{ minWidth: 0 }}>
                        <TransactionDesc>{t.descricao}</TransactionDesc>
                        <TransactionCategory>{t.categoria || 'Outros'}</TransactionCategory>
                      </div>
                    </TransactionLeft>
                    <TransactionValue type={t.tipo}>
                      {t.tipo === 'credito' ? '+' : '-'} {formatBRL(t.valor)}
                    </TransactionValue>
                  </TransactionItem>
                ))}
              </TransactionList>
            </TransactionGroup>
          ))
        )}
      </Card>
    </FullWidthCard>
  );

  const renderInstallments = () => (
    <Card>
      <CardHeader>
        <CardTitle>Parcelamentos ativos</CardTitle>
      </CardHeader>
      {installments.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Icon name="card" size={36} /></EmptyIcon>
          <EmptyTitle>Nenhum parcelamento ativo</EmptyTitle>
          <EmptyDesc>Compras parceladas identificadas pelo Open Finance aparecerão aqui.</EmptyDesc>
        </EmptyState>
      ) : (
        <InstallmentList>
          {installments.map((item) => {
            const total = Number(item.total_parcelas || 1);
            const pagas = Number(item.parcelas_pagas || 1);
            const pct = Math.min((pagas / total) * 100, 100);
            return (
              <InstallmentItem key={item.id}>
                <InstallmentInfo>
                  <InstallmentName>{item.descricao}</InstallmentName>
                  <InstallmentProgress>{pagas}/{total} parcelas pagas</InstallmentProgress>
                  <InstallmentProgressBar pct={pct} />
                </InstallmentInfo>
                <InstallmentAmount>{formatBRL(item.valor)}/mês</InstallmentAmount>
              </InstallmentItem>
            );
          })}
        </InstallmentList>
      )}
    </Card>
  );

  const renderSubscriptions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recorrências detectadas</CardTitle>
      </CardHeader>
      {subscriptions.length > 0 && (
        <SubscriptionTotal>
          <SubscriptionTotalLabel>Total mensal</SubscriptionTotalLabel>
          <SubscriptionTotalValue>{formatBRL(totalSubscriptions)}/mês</SubscriptionTotalValue>
        </SubscriptionTotal>
      )}
      {subscriptions.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Icon name="event" size={36} /></EmptyIcon>
          <EmptyTitle>Nenhuma assinatura detectada</EmptyTitle>
          <EmptyDesc>Pagamentos recorrentes identificados automaticamente aparecerão aqui.</EmptyDesc>
        </EmptyState>
      ) : (
        <SubscriptionList>
          {subscriptions.map((s) => (
            <SubscriptionItem key={s.id}>
              <SubscriptionLeft>
                <SubscriptionIcon><Icon name="event" size={18} /></SubscriptionIcon>
                <div>
                  <SubscriptionName>{s.descricao}</SubscriptionName>
                  <SubscriptionDue>Próximo: {formatDateBR(s.data)}</SubscriptionDue>
                </div>
              </SubscriptionLeft>
              <SubscriptionAmount>{formatBRL(s.valor)}</SubscriptionAmount>
            </SubscriptionItem>
          ))}
        </SubscriptionList>
      )}
    </Card>
  );

  const renderCategories = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          Principais categorias — {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </CardTitle>
      </CardHeader>
      {categoriesRanking.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Icon name="chart" size={36} /></EmptyIcon>
          <EmptyTitle>Nenhuma categoria encontrada</EmptyTitle>
          <EmptyDesc>Sincronize seu banco para ver a distribuição de gastos por categoria.</EmptyDesc>
        </EmptyState>
      ) : (
        <CategoryTable>
          <CategoryRowHeader>
            <CategoryColLabel>Categoria</CategoryColLabel>
            <CategoryColLabel align="right">Atual</CategoryColLabel>
            <CategoryColLabel align="right">Variação</CategoryColLabel>
            <CategoryColLabel align="right">Anterior</CategoryColLabel>
          </CategoryRowHeader>
          {categoriesRanking.map((cat) => {
            const variation = cat.previous > 0
              ? ((cat.current - cat.previous) / cat.previous) * 100
              : null;
            return (
              <CategoryRow key={cat.name} onClick={() => setActiveTab('transactions')}>
                <CategoryName>
                  <CategoryEmoji>{getCategoryIcon(cat.name)}</CategoryEmoji>
                  {cat.name}
                </CategoryName>
                <CategoryAmount>{formatBRL(cat.current)}</CategoryAmount>
                <CategoryVariation up={variation > 0}>
                  {variation !== null
                    ? `${variation > 0 ? '+' : ''}${variation.toFixed(0)}%`
                    : '—'}
                </CategoryVariation>
                <CategoryPrev>
                  {cat.previous > 0 ? formatBRL(cat.previous) : '—'}
                </CategoryPrev>
              </CategoryRow>
            );
          })}
        </CategoryTable>
      )}
    </Card>
  );

  const renderCards = () => (
    <Card>
      <CardHeader>
        <CardTitle>Cartões de crédito</CardTitle>
      </CardHeader>
      <CardsEmptyState>
        <CardsEmptyIcon><Icon name="card" size={42} /></CardsEmptyIcon>
        <EmptyTitle>Nenhum cartão conectado</EmptyTitle>
        <EmptyDesc>
          Conecte um cartão de crédito via Open Finance para acompanhar sua fatura, limite e gastos.
        </EmptyDesc>
        <PrimaryBtn onClick={handleStartBankConnection}>+ Conectar cartão</PrimaryBtn>
      </CardsEmptyState>
    </Card>
  );

  const renderBanksSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Instituições disponíveis</CardTitle>
        <SecondaryBtn onClick={handleSync} disabled={syncing}>
          {syncing ? <SpinnerIcon /> : <Icon name="openFinance" size={16} />} Sincronizar contas
        </SecondaryBtn>
      </CardHeader>

      {consents.length > 0 && (
        <>
          <CardTitle style={{ marginBottom: 12 }}>Conexões ativas</CardTitle>
          <ConsentList style={{ marginBottom: 24 }}>
            {consents.map((c) => (
              <ConsentItem key={c.id}>
                <InstitutionLogo
                  Component={AccountLogo}
                  logoUrl={c.institution?.logo_url}
                  name={c.institution?.nome}
                />
                <ConsentInfo>
                  <ConsentBank>{c.institution?.nome ?? `Banco #${c.id}`}</ConsentBank>
                  <ConsentExpiry>Expira em: {formatDateBR(c.expires_at?.split('T')[0])}</ConsentExpiry>
                </ConsentInfo>
                <ConsentActions>
                  <StatusBadge status={c.status}>{c.status}</StatusBadge>
                  <DangerBtn
                    onClick={() => setConfirmRevoke(c)}
                    disabled={revokingId === c.id}
                  >
                    {revokingId === c.id ? <SpinnerIcon /> : 'Revogar'}
                  </DangerBtn>
                </ConsentActions>
              </ConsentItem>
            ))}
          </ConsentList>
        </>
      )}

      {loadingBanks ? (
        <BanksGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} h="130px" />
          ))}
        </BanksGrid>
      ) : banks.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Icon name="bank" size={36} /></EmptyIcon>
          <EmptyTitle>Nenhuma instituição retornada pela API</EmptyTitle>
          <EmptyDesc>O endpoint de Open Finance não retornou bancos disponíveis para conexão.</EmptyDesc>
        </EmptyState>
      ) : (
        <BanksGrid>
          {banks.map((bank) => {
            const isConnected = connectedBankIds.has(bank.id);
            const isConnecting = connectingId === bank.id;
            return (
              <BankCard key={bank.id}>
                <InstitutionLogo
                  Component={BankLogo}
                  logoUrl={bank.logo_url}
                  name={bank.nome}
                />
                <BankName>{bank.nome}</BankName>
                <BankStatus connected={isConnected}>
                  {isConnected ? 'Conectado' : 'Disponível'}
                </BankStatus>
                {!isConnected && (
                  <SecondaryBtn
                    onClick={() => handleConnect(bank)}
                    disabled={isConnecting}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isConnecting ? <SpinnerIcon /> : 'Conectar'}
                  </SecondaryBtn>
                )}
              </BankCard>
            );
          })}
        </BanksGrid>
      )}
    </Card>
  );

  /* ── Render principal ─────────────────────────────────────────── */
  return (
    <PageWrapper>
      <PageHeader>
        <HeaderInfo>
          <PageTitle>Open Finance</PageTitle>
          <PageSubtitle>
            Conecte seus bancos e acompanhe todas as suas finanças em um só lugar.
          </PageSubtitle>
        </HeaderInfo>
        <HeaderActions>
          <PrimaryBtn onClick={handleStartBankConnection}>
            <Icon name="bank" size={16} /> Conectar banco
          </PrimaryBtn>
        </HeaderActions>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

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

      {activeTab === 'overview' && (
        <>
          {renderOverview()}
          {renderBanksSection()}
        </>
      )}
      {activeTab === 'transactions'  && renderTransactions()}
      {activeTab === 'installments'  && renderInstallments()}
      {activeTab === 'subscriptions' && renderSubscriptions()}
      {activeTab === 'categories'    && renderCategories()}
      {activeTab === 'cards'         && renderCards()}

      <ChatFab title="Conversar com IA" onClick={() => {}}><Icon name="user" size={22} /></ChatFab>

      {showConnectModal && (
        <ModalOverlay onClick={() => setShowConnectModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()} style={{ maxWidth: 760 }}>
            <ModalTitle>Conectar novo banco</ModalTitle>
            <ModalText>
              Escolha uma instituição para iniciar a autorização do Open Finance.
            </ModalText>

            {loadingBanks ? (
              <BanksGrid>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} h="130px" />
                ))}
              </BanksGrid>
            ) : availableBanks.length === 0 ? (
              <EmptyState style={{ padding: '1rem 0 0' }}>
                <EmptyIcon><Icon name="bank" size={36} /></EmptyIcon>
                <EmptyTitle>
                  {banks.length === 0
                    ? 'Nenhuma instituição retornada pela API'
                    : 'Nenhum novo banco disponível'}
                </EmptyTitle>
                <EmptyDesc>
                  {banks.length === 0
                    ? 'O endpoint de Open Finance não retornou instituições com identificador válido para conexão.'
                    : 'Todos os bancos listados já estão conectados no momento.'}
                </EmptyDesc>
              </EmptyState>
            ) : (
              <BanksGrid>
                {availableBanks.map((bank) => {
                  const isConnecting = connectingId === bank.id;
                  return (
                    <BankCard key={`modal-${bank.id}`}>
                      <InstitutionLogo
                        Component={BankLogo}
                        logoUrl={bank.logo_url}
                        name={bank.nome}
                      />
                      <BankName>{bank.nome}</BankName>
                      <BankStatus>Disponível</BankStatus>
                      <PrimaryBtn
                        onClick={() => handleConnect(bank)}
                        disabled={isConnecting}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {isConnecting ? <SpinnerIcon /> : 'Conectar'}
                      </PrimaryBtn>
                    </BankCard>
                  );
                })}
              </BanksGrid>
            )}

            <ModalActions style={{ marginTop: 24 }}>
              <SecondaryBtn onClick={() => setShowConnectModal(false)}>Fechar</SecondaryBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {confirmRevoke && (
        <ModalOverlay onClick={() => setConfirmRevoke(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Revogar acesso?</ModalTitle>
            <ModalText>
              Isso vai desconectar <strong>{confirmRevoke.institution?.nome ?? 'este banco'}</strong> e
              remover o consentimento. Você pode conectar novamente a qualquer momento.
            </ModalText>
            <ModalActions>
              <SecondaryBtn onClick={() => setConfirmRevoke(null)}>Cancelar</SecondaryBtn>
              <DangerBtn onClick={handleRevoke} disabled={!!revokingId}>
                {revokingId ? <SpinnerIcon /> : 'Revogar acesso'}
              </DangerBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}
