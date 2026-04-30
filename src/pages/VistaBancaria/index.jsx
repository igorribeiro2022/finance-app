import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getConsolidado, getTransacoes } from '../../services/vistaBancaria';
import {
  PageWrapper, PageHeader, HeaderInfo, PageTitle, PageSubtitle, HeaderActions,
  TabBar, Tab, Card, CardHeader, CardTitle, CardAction,
  ContentGrid, FullWidthCard,
  SaldoHero, SaldoInfo, SaldoLabel, SaldoTotal, SaldoMeta, SaldoActions,
  KpiRow, KpiCard, KpiLabel, KpiValue, KpiVariation,
  InstList, InstItem, InstLogo, InstInfo, InstNome, InstContas, InstSaldo,
  ContaList, ContaItem, ContaDesc, ContaTipo, ContaSaldo,
  FiltersRow, FilterSelect, FilterInput,
  TxGroup, TxDate, TxList, TxItem, TxIcon, TxBody, TxDesc, TxMeta,
  TxCategoria, TxOrigem, TxValue,
  CatTable, CatRow, CatLabel, CatBar, CatValue,
  EmptyState, EmptyIcon, EmptyTitle, EmptyDesc,
  ErrorBanner, PrimaryBtn, SecondaryBtn, SpinnerIcon, SkeletonBlock,
} from './styles';

/* ── helpers ─────────────────────────────────────────────────────── */
const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0);

const formatDateLabel = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
};

const CATEGORY_EMOJI = {
  'Transporte': '🚌', 'Alimentação': '🛒', 'Restaurantes': '🍔',
  'Supermercado': '🛒', 'Eletrônicos': '💻', 'Empréstimos': '💸',
  'Transferências': '↔️', 'Saúde': '🏥', 'Educação': '📚',
  'Lazer': '🎬', 'Moradia': '🏠', 'Assinaturas': '🔁',
  'Estorno': '↩️', 'Outros': '📌',
};

const getCatEmoji = (cat) => {
  if (!cat) return '📌';
  for (const k of Object.keys(CATEGORY_EMOJI)) {
    if (cat.toLowerCase().includes(k.toLowerCase())) return CATEGORY_EMOJI[k];
  }
  return '📌';
};

const TIPO_LABEL = { corrente: 'Corrente', poupanca: 'Poupança', poupança: 'Poupança', investimento: 'Investimento' };
const getTipoLabel = (t) => TIPO_LABEL[t] || t || 'Conta';

/* ── skeleton helper ─────────────────────────────────────────────── */
const SkeletonCard = ({ rows = 3 }) => (
  <Card>
    <CardHeader><SkeletonBlock h="14px" w="120px" /></CardHeader>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonBlock key={i} h="44px" style={{ marginBottom: 8 }} />
    ))}
  </Card>
);

/* ── tabs ────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'visao-geral', label: 'Visão Geral' },
  { key: 'transacoes',  label: 'Transações'  },
  { key: 'categorias',  label: 'Categorias'  },
];

/* ── componente principal ────────────────────────────────────────── */
export default function VistaBancaria() {
  const [activeTab, setActiveTab] = useState('visao-geral');

  /* dados */
  const [consolidado,  setConsolidado]  = useState(null);
  const [transacoes,   setTransacoes]   = useState([]);
  const [expandedInst, setExpandedInst] = useState(null);

  /* loading */
  const [loadingConsolidado, setLoadingConsolidado] = useState(true);
  const [loadingTx,          setLoadingTx]          = useState(true);
  const [syncing,            setSyncing]             = useState(false);

  /* filtros de transações */
  const [filters, setFilters] = useState({
    banco: '', tipo: '', datainicio: '', datafim: '', categoria: '',
  });

  /* feedback */
  const [error, setError] = useState('');

  /* ── carregamento ──────────────────────────────────────────────── */
  const loadConsolidado = useCallback(async (params = {}) => {
    try {
      setLoadingConsolidado(true);
      setError('');
      const res = await getConsolidado(params);
      setConsolidado(res.data);
    } catch {
      setError('Erro ao carregar dados bancários. Verifique se há contas conectadas no Open Finance.');
      setConsolidado(null);
    } finally {
      setLoadingConsolidado(false);
    }
  }, []);

  const loadTransacoes = useCallback(async (params = {}) => {
    try {
      setLoadingTx(true);
      setError('');
      const res  = await getTransacoes(params);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.transacoes ?? res.data?.results ?? [];
      setTransacoes(data);
    } catch {
      setTransacoes([]);
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    loadConsolidado();
    loadTransacoes();
  }, [loadConsolidado, loadTransacoes]);

  const handleSincronizar = async () => {
    setSyncing(true);
    await loadConsolidado();
    await loadTransacoes(activeFiltersClean());
    setSyncing(false);
  };

  const activeFiltersClean = () => {
    const p = {};
    if (filters.banco)     p.banco      = filters.banco;
    if (filters.tipo)      p.tipo       = filters.tipo;
    if (filters.datainicio)p.datainicio = filters.datainicio;
    if (filters.datafim)   p.datafim    = filters.datafim;
    if (filters.categoria) p.categoria  = filters.categoria;
    return p;
  };

  const handleFiltrar = () => loadTransacoes(activeFiltersClean());
  const handleLimpar  = () => {
    setFilters({ banco: '', tipo: '', datainicio: '', datafim: '', categoria: '' });
    loadTransacoes();
  };

  /* ── derivações ────────────────────────────────────────────────── */
  const saldoTotal     = consolidado?.saldo_total ?? 0;
  const porInstituicao = useMemo(
    () => Array.isArray(consolidado?.por_instituicao) ? consolidado.por_instituicao : [],
    [consolidado]
  );
  const totalContas    = useMemo(
    () => porInstituicao.reduce((s, i) => s + (i.accounts?.length ?? 0), 0),
    [porInstituicao]
  );

  /* tx do consolidado (overview) */
  const txRecentes = useMemo(() => {
    const list = consolidado?.transacoes ?? [];
    return [...list].sort((a, b) => (b.data ?? '') > (a.data ?? '') ? 1 : -1).slice(0, 20);
  }, [consolidado]);

  /* tx da aba transações */
  const txAgrupadas = useMemo(() => {
    const groups = {};
    transacoes.forEach((t) => {
      const key = t.data || 'Sem data';
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.entries(groups).sort(([a], [b]) => b > a ? 1 : -1);
  }, [transacoes]);

  /* resumo por categoria (débitos) */
  const categorias = useMemo(() => {
    const map = {};
    txRecentes
      .filter((t) => t.tipo === 'debito')
      .forEach((t) => {
        const cat = t.categoria || 'Outros';
        map[cat] = (map[cat] || 0) + Number(t.valor || 0);
      });
    return Object.entries(map)
      .map(([cat, total]) => ({ cat, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [txRecentes]);

  const totalDebitos  = useMemo(
    () => txRecentes.filter((t) => t.tipo === 'debito').reduce((s, t) => s + Number(t.valor || 0), 0),
    [txRecentes]
  );
  const totalCreditos = useMemo(
    () => txRecentes.filter((t) => t.tipo === 'credito').reduce((s, t) => s + Number(t.valor || 0), 0),
    [txRecentes]
  );
  const catMax = categorias[0]?.total || 1;

  /* nomes de bancos para o filtro */
  const bankOptions = useMemo(
    () => porInstituicao.map((i) => ({ id: i.institution?.id, nome: i.institution?.nome })),
    [porInstituicao]
  );

  /* ── render: visão geral ──────────────────────────────────────── */
  const renderVisaoGeral = () => (
    <>
      {/* Saldo total */}
      <SaldoHero>
        <SaldoInfo>
          <SaldoLabel>Saldo total consolidado</SaldoLabel>
          {loadingConsolidado
            ? <SkeletonBlock h="44px" w="220px" />
            : <SaldoTotal>{formatBRL(saldoTotal)}</SaldoTotal>}
          <SaldoMeta>
            {totalContas} conta{totalContas !== 1 ? 's' : ''} em {porInstituicao.length} instituição{porInstituicao.length !== 1 ? 's' : ''}
          </SaldoMeta>
        </SaldoInfo>
        <SaldoActions>
          <SecondaryBtn onClick={handleSincronizar} disabled={syncing}>
            {syncing ? <SpinnerIcon /> : '↻'} Atualizar
          </SecondaryBtn>
        </SaldoActions>
      </SaldoHero>

      {/* KPIs rápidos */}
      <KpiRow>
        <KpiCard>
          <KpiLabel>Débitos recentes</KpiLabel>
          <KpiValue>{formatBRL(totalDebitos)}</KpiValue>
          <KpiVariation>{txRecentes.filter((t) => t.tipo === 'debito').length} transações</KpiVariation>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Créditos recentes</KpiLabel>
          <KpiValue>{formatBRL(totalCreditos)}</KpiValue>
          <KpiVariation up>{txRecentes.filter((t) => t.tipo === 'credito').length} entradas</KpiVariation>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Saldo do período</KpiLabel>
          <KpiValue>{formatBRL(totalCreditos - totalDebitos)}</KpiValue>
          <KpiVariation up={totalCreditos - totalDebitos >= 0}>
            {totalCreditos - totalDebitos >= 0 ? '▲ positivo' : '▼ negativo'}
          </KpiVariation>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Instituições</KpiLabel>
          <KpiValue>{porInstituicao.length}</KpiValue>
          <KpiVariation>{totalContas} contas conectadas</KpiVariation>
        </KpiCard>
      </KpiRow>

      <ContentGrid>
        {/* Instituições */}
        <Card>
          <CardHeader>
            <CardTitle>Por instituição</CardTitle>
            <CardAction onClick={() => setActiveTab('transacoes')}>ver transações</CardAction>
          </CardHeader>
          {loadingConsolidado ? (
            <SkeletonCard rows={3} />
          ) : porInstituicao.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🏦</EmptyIcon>
              <EmptyTitle>Nenhuma conta conectada</EmptyTitle>
              <EmptyDesc>Conecte seus bancos em Open Finance para visualizar o saldo consolidado.</EmptyDesc>
            </EmptyState>
          ) : (
            <InstList>
              {porInstituicao.map((inst) => {
                const id    = inst.institution?.id ?? inst.id;
                const nome  = inst.institution?.nome ?? inst.nome ?? 'Banco';
                const logo  = inst.institution?.logourl;
                const contas= inst.accounts ?? [];
                const saldo = inst.saldo_total ?? contas.reduce((s, c) => s + Number(c.saldo || 0), 0);
                const open  = expandedInst === id;
                return (
                  <div key={id}>
                    <InstItem clickable onClick={() => setExpandedInst(open ? null : id)}>
                      <InstLogo>
                        {logo
                          ? <img src={logo} alt={nome} loading="lazy" />
                          : nome.slice(0, 2).toUpperCase()}
                      </InstLogo>
                      <InstInfo>
                        <InstNome>{nome}</InstNome>
                        <InstContas>
                          {contas.length} conta{contas.length !== 1 ? 's' : ''} · {open ? '▲ fechar' : '▼ expandir'}
                        </InstContas>
                      </InstInfo>
                      <InstSaldo>{formatBRL(saldo)}</InstSaldo>
                    </InstItem>
                    {open && contas.length > 0 && (
                      <ContaList>
                        {contas.map((c) => (
                          <ContaItem key={c.id}>
                            <ContaDesc>{c.nomeconta || `Conta #${c.id}`}</ContaDesc>
                            <ContaTipo>{getTipoLabel(c.tipo)}</ContaTipo>
                            <ContaSaldo>{formatBRL(c.saldo)}</ContaSaldo>
                          </ContaItem>
                        ))}
                      </ContaList>
                    )}
                  </div>
                );
              })}
            </InstList>
          )}
        </Card>

        {/* Transações recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Transações recentes</CardTitle>
            <CardAction onClick={() => setActiveTab('transacoes')}>ver todas</CardAction>
          </CardHeader>
          {loadingConsolidado ? (
            <SkeletonCard rows={5} />
          ) : txRecentes.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyTitle>Nenhuma transação</EmptyTitle>
              <EmptyDesc>As transações das contas conectadas aparecerão aqui.</EmptyDesc>
            </EmptyState>
          ) : (
            <TxList>
              {txRecentes.slice(0, 8).map((t, i) => (
                <TxItem key={t.id ?? i}>
                  <TxIcon type={t.tipo}>{getCatEmoji(t.categoria)}</TxIcon>
                  <TxBody>
                    <TxDesc>{t.descricao}</TxDesc>
                    <TxMeta>
                      <TxCategoria>{t.categoria || 'Outros'}</TxCategoria>
                      {t.origem && <TxOrigem>{t.origem}</TxOrigem>}
                    </TxMeta>
                  </TxBody>
                  <TxValue type={t.tipo}>
                    {t.tipo === 'credito' ? '+' : '−'} {formatBRL(t.valor)}
                  </TxValue>
                </TxItem>
              ))}
            </TxList>
          )}
        </Card>
      </ContentGrid>
    </>
  );

  /* ── render: transações ───────────────────────────────────────── */
  const renderTransacoes = () => (
    <FullWidthCard as="div">
      <Card>
        <CardHeader>
          <CardTitle>Extrato unificado</CardTitle>
          <SecondaryBtn onClick={handleSincronizar} disabled={syncing}>
            {syncing ? <SpinnerIcon /> : '↻'} Atualizar
          </SecondaryBtn>
        </CardHeader>

        <FiltersRow>
          <FilterSelect
            value={filters.banco}
            onChange={(e) => setFilters((p) => ({ ...p, banco: e.target.value }))}
          >
            <option value="">Todos os bancos</option>
            {bankOptions.map((b) => (
              <option key={b.id} value={b.id}>{b.nome}</option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={filters.tipo}
            onChange={(e) => setFilters((p) => ({ ...p, tipo: e.target.value }))}
          >
            <option value="">Todos os tipos</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
          </FilterSelect>

          <FilterInput
            type="text"
            placeholder="Categoria"
            value={filters.categoria}
            onChange={(e) => setFilters((p) => ({ ...p, categoria: e.target.value }))}
          />

          <FilterInput
            type="date"
            value={filters.datainicio}
            onChange={(e) => setFilters((p) => ({ ...p, datainicio: e.target.value }))}
          />

          <FilterInput
            type="date"
            value={filters.datafim}
            onChange={(e) => setFilters((p) => ({ ...p, datafim: e.target.value }))}
          />

          <PrimaryBtn onClick={handleFiltrar} disabled={loadingTx}>
            {loadingTx ? <SpinnerIcon /> : 'Filtrar'}
          </PrimaryBtn>

          <SecondaryBtn onClick={handleLimpar} disabled={loadingTx}>
            Limpar
          </SecondaryBtn>
        </FiltersRow>

        {loadingTx ? (
          <SkeletonCard rows={6} />
        ) : txAgrupadas.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyTitle>Nenhuma transação encontrada</EmptyTitle>
            <EmptyDesc>Ajuste os filtros ou conecte um banco para importar movimentações.</EmptyDesc>
          </EmptyState>
        ) : (
          txAgrupadas.map(([data, txs]) => (
            <TxGroup key={data}>
              <TxDate>{formatDateLabel(data)}</TxDate>
              <TxList>
                {txs.map((t, i) => (
                  <TxItem key={t.id ?? i}>
                    <TxIcon type={t.tipo}>{getCatEmoji(t.categoria)}</TxIcon>
                    <TxBody>
                      <TxDesc>{t.descricao}</TxDesc>
                      <TxMeta>
                        <TxCategoria>{t.categoria || 'Outros'}</TxCategoria>
                        {t.origem && <TxOrigem>{t.origem}</TxOrigem>}
                      </TxMeta>
                    </TxBody>
                    <TxValue type={t.tipo}>
                      {t.tipo === 'credito' ? '+' : '−'} {formatBRL(t.valor)}
                    </TxValue>
                  </TxItem>
                ))}
              </TxList>
            </TxGroup>
          ))
        )}
      </Card>
    </FullWidthCard>
  );

  /* ── render: categorias ───────────────────────────────────────── */
  const renderCategorias = () => (
    <FullWidthCard as="div">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por categoria</CardTitle>
          <span style={{ fontSize: '0.75rem', color: 'inherit', opacity: 0.5 }}>
            apenas débitos · baseado nas {txRecentes.length} transações mais recentes
          </span>
        </CardHeader>

        {loadingConsolidado ? (
          <SkeletonCard rows={5} />
        ) : categorias.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <EmptyTitle>Sem dados de categoria</EmptyTitle>
            <EmptyDesc>As categorias são calculadas a partir das transações das contas conectadas.</EmptyDesc>
          </EmptyState>
        ) : (
          <>
            <KpiRow style={{ marginBottom: '1.5rem' }}>
              <KpiCard>
                <KpiLabel>Total débitos</KpiLabel>
                <KpiValue>{formatBRL(totalDebitos)}</KpiValue>
              </KpiCard>
              <KpiCard>
                <KpiLabel>Total créditos</KpiLabel>
                <KpiValue>{formatBRL(totalCreditos)}</KpiValue>
                <KpiVariation up>entradas</KpiVariation>
              </KpiCard>
              <KpiCard>
                <KpiLabel>Maior categoria</KpiLabel>
                <KpiValue style={{ fontSize: '0.95rem' }}>
                  {getCatEmoji(categorias[0]?.cat)} {categorias[0]?.cat}
                </KpiValue>
                <KpiVariation>{formatBRL(categorias[0]?.total)}</KpiVariation>
              </KpiCard>
            </KpiRow>

            <CatTable>
              {categorias.map(({ cat, total }) => (
                <CatRow key={cat}>
                  <CatLabel>{getCatEmoji(cat)} {cat}</CatLabel>
                  <CatBar pct={(total / catMax) * 100} />
                  <CatValue>{formatBRL(total)}</CatValue>
                </CatRow>
              ))}
            </CatTable>
          </>
        )}
      </Card>
    </FullWidthCard>
  );

  /* ── render principal ──────────────────────────────────────────── */
  return (
    <PageWrapper>
      <PageHeader>
        <HeaderInfo>
          <PageTitle>Vista Bancária</PageTitle>
          <PageSubtitle>
            Saldo consolidado e transações de todas as contas conectadas via Open Finance.
          </PageSubtitle>
        </HeaderInfo>
        <HeaderActions>
          <SecondaryBtn onClick={handleSincronizar} disabled={syncing}>
            {syncing ? <SpinnerIcon /> : '↻'} Sincronizar
          </SecondaryBtn>
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

      {activeTab === 'visao-geral' && renderVisaoGeral()}
      {activeTab === 'transacoes'  && renderTransacoes()}
      {activeTab === 'categorias'  && renderCategorias()}
    </PageWrapper>
  );
}
