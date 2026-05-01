import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

import Icon from '../../components/Icon';
import { getDashboard } from '../../services/dashboard';
import {
  AgendaDate,
  AgendaDesc,
  AgendaIcon,
  AgendaInfo,
  AgendaItem,
  AgendaList,
  AgendaValue,
  BalanceCard,
  BalanceLabel,
  BalanceValue,
  ChartCard,
  ChartGrid,
  ChartHeader,
  ChartTitle,
  DashboardGrid,
  DashboardShell,
  EmptyState,
  ErrorBanner,
  Gauge,
  GaugeValue,
  HeroPanel,
  KpiCard,
  KpiGrid,
  KpiIcon,
  KpiLabel,
  KpiValue,
  MainColumn,
  Muted,
  PageHeader,
  PageSubtitle,
  PageTitle,
  QuickActions,
  QuickPill,
  SideCard,
  SideColumn,
  SkeletonCard,
} from './styles';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
  }),
};

function fmt(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function arr(v) {
  return Array.isArray(v) ? v : [];
}

function obj(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
}

function getKpis(data) {
  const k = obj(data?.kpis);
  const gastosFixos = num(k.total_gastos_fixos ?? k.totalgastosfixos);
  const ganhosFixos = num(k.total_ganhos_fixos ?? k.totalganhosfixos);
  const gastosEventuais = num(k.total_gastos_eventuais ?? k.totalgastoseventuais);
  const ganhosEventuais = num(k.total_ganhos_eventuais ?? k.totalganhoseventuais);
  const totalGastos = num(k.total_gastos) || gastosFixos + gastosEventuais;
  const totalGanhos = num(k.total_ganhos) || ganhosFixos + ganhosEventuais;
  const saldoMes = num(k.saldo) || totalGanhos - totalGastos;
  return {
    gastosFixos,
    ganhosFixos,
    gastosEventuais,
    ganhosEventuais,
    totalGastos,
    totalGanhos,
    saldoMes,
    taxaComprometimento: num(k.taxa_comprometimento ?? k.taxacomprometimento),
  };
}

function CustomTooltip({ active, payload, label, theme }) {
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
      {payload.map((p, index) => (
        <p key={`${p.dataKey || p.name}-${index}`} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <DashboardShell>
      <HeroPanel>
        <DashboardGrid>
          <MainColumn>
            <SkeletonCard $tall />
            <SkeletonCard $tall />
          </MainColumn>
          <SideColumn>
            <SkeletonCard />
            <SkeletonCard />
          </SideColumn>
        </DashboardGrid>
      </HeroPanel>
    </DashboardShell>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((s) => s.auth);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getDashboard();
        setData(res.data);
      } catch {
        setError('Nao foi possivel carregar o dashboard. Tente novamente.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = getKpis(data);
  const graficos = obj(data?.graficos);
  const agendaItems = arr(data?.agenda ?? data?.agenda_items).slice(0, 5);
  const gastosCategoria = arr(graficos.gastos_por_categoria ?? data?.grafico_gastos_por_categoria);
  const ganhosCategoria = arr(graficos.ganhos_por_categoria ?? data?.grafico_ganhos_por_categoria);
  const historico = arr(graficos.historico_6_meses ?? data?.grafico_eventuais_por_mes).map((item) => ({
    mes: item.mes,
    gastos: num(item.gastos ?? item.gastos_eventuais),
    ganhos: num(item.ganhos ?? item.ganhos_eventuais),
    saldo: num(item.saldo ?? (num(item.ganhos ?? item.ganhos_eventuais) - num(item.gastos ?? item.gastos_eventuais))),
  }));

  const spendingData = useMemo(() => {
    const dataSource = gastosCategoria.length > 0
      ? gastosCategoria.map((item) => ({ name: item.categoria, valor: num(item.total ?? item.valor) }))
      : [
          { name: 'Fixos', valor: kpis.gastosFixos },
          { name: 'Eventuais', valor: kpis.gastosEventuais },
        ];
    return dataSource.filter((item) => item.valor > 0);
  }, [gastosCategoria, kpis.gastosFixos, kpis.gastosEventuais]);

  const incomeCategoryData = useMemo(() => {
    const dataSource = ganhosCategoria.length > 0
      ? ganhosCategoria.map((item) => ({ name: item.categoria, valor: num(item.total ?? item.valor) }))
      : [
          { name: 'Fixos', valor: kpis.ganhosFixos },
          { name: 'Eventuais', valor: kpis.ganhosEventuais },
        ];
    return dataSource.filter((item) => item.valor > 0);
  }, [ganhosCategoria, kpis.ganhosFixos, kpis.ganhosEventuais]);

  const fixedVsEventualData = useMemo(() => [
    { name: 'Ganhos', Fixos: kpis.ganhosFixos, Eventuais: kpis.ganhosEventuais },
    { name: 'Gastos', Fixos: kpis.gastosFixos, Eventuais: kpis.gastosEventuais },
  ], [kpis.ganhosFixos, kpis.ganhosEventuais, kpis.gastosFixos, kpis.gastosEventuais]);
  const hasFixedVsEventualData = fixedVsEventualData.some((item) => item.Fixos > 0 || item.Eventuais > 0);
  const hasHistoricoData = historico.some((item) => item.gastos > 0 || item.ganhos > 0 || item.saldo !== 0);

  const kpiCards = [
    { label: 'Ganhos', value: fmt(kpis.totalGanhos), icon: 'income', type: 'income' },
    { label: 'Gastos', value: fmt(kpis.totalGastos), icon: 'expense', type: 'expense' },
    { label: 'Fixos', value: fmt(kpis.gastosFixos), icon: 'card', type: 'expense' },
    { label: 'Eventuais', value: fmt(kpis.gastosEventuais), icon: 'event', type: 'neutral' },
  ];

  if (loading) return <Skeleton />;

  const chartColors = [
    theme.colors.primary,
    theme.colors.accent,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.error,
    theme.colors.neutral,
  ];

  return (
    <DashboardShell>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {data && (
        <HeroPanel as={motion.section} initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <PageHeader>
            <div>
              <PageTitle>Bom dia, {user?.nome?.split(' ')[0] ?? 'Usuario'}</PageTitle>
              <PageSubtitle>Um resumo limpo do seu mes financeiro, sem ruido.</PageSubtitle>
            </div>
            <QuickPill><Icon name="calendar" size={16} /> Mes atual</QuickPill>
          </PageHeader>

          <DashboardGrid>
            <MainColumn>
              <BalanceCard>
                <BalanceLabel>Saldo estimado</BalanceLabel>
                <BalanceValue $negative={kpis.saldoMes < 0}>{fmt(kpis.saldoMes)}</BalanceValue>
                <QuickActions>
                  <QuickPill><Icon name="income" size={16} /> Receber {fmt(kpis.totalGanhos)}</QuickPill>
                  <QuickPill><Icon name="expense" size={16} /> Pagar {fmt(kpis.totalGastos)}</QuickPill>
                </QuickActions>
              </BalanceCard>

              <KpiGrid>
                {kpiCards.map((card, index) => (
                  <KpiCard key={card.label} as={motion.div} variants={fadeUp} custom={index + 1}>
                    <KpiIcon $type={card.type}><Icon name={card.icon} size={20} /></KpiIcon>
                    <KpiLabel>{card.label}</KpiLabel>
                    <KpiValue $type={card.type}>{card.value}</KpiValue>
                  </KpiCard>
                ))}
              </KpiGrid>

              <ChartCard>
                <ChartHeader>
                  <div>
                    <ChartTitle>Despesas por categoria</ChartTitle>
                    <Muted>Distribuicao principal do periodo</Muted>
                  </div>
                  <QuickPill><Icon name="arrowUpRight" size={15} /> Analise</QuickPill>
                </ChartHeader>
                {spendingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={spendingData} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: theme.colors.textMuted }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip theme={theme} />} />
                      <Bar dataKey="valor" radius={[12, 12, 12, 12]}>
                        {spendingData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? theme.colors.primary : i === 1 ? theme.colors.accent : theme.colors.success} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState>Nenhum gasto registrado ainda.</EmptyState>
                )}
              </ChartCard>

              <ChartGrid>
                <ChartCard>
                  <ChartHeader>
                    <div>
                      <ChartTitle>Ganhos por categoria</ChartTitle>
                      <Muted>De onde o dinheiro entrou</Muted>
                    </div>
                  </ChartHeader>
                  {incomeCategoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Tooltip content={<CustomTooltip theme={theme} />} />
                        <Pie
                          data={incomeCategoryData}
                          dataKey="valor"
                          nameKey="name"
                          innerRadius={52}
                          outerRadius={86}
                          paddingAngle={4}
                        >
                          {incomeCategoryData.map((_, i) => (
                            <Cell key={i} fill={chartColors[i % chartColors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState>Nenhum ganho categorizado ainda.</EmptyState>
                  )}
                </ChartCard>

                <ChartCard>
                  <ChartHeader>
                    <div>
                      <ChartTitle>Fixos x eventuais</ChartTitle>
                      <Muted>Separacao por recorrencia</Muted>
                    </div>
                  </ChartHeader>
                  {hasFixedVsEventualData ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={fixedVsEventualData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: theme.colors.textMuted }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip theme={theme} />} />
                        <Bar dataKey="Fixos" stackId="a" fill={theme.colors.primary} radius={[10, 10, 0, 0]} />
                        <Bar dataKey="Eventuais" stackId="a" fill={theme.colors.accent} radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState>Nenhum lancamento registrado ainda.</EmptyState>
                  )}
                </ChartCard>

                <ChartCard>
                  <ChartHeader>
                    <div>
                      <ChartTitle>Saldo mensal</ChartTitle>
                      <Muted>Tendencia do fluxo liquido</Muted>
                    </div>
                  </ChartHeader>
                  {hasHistoricoData ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={historico} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.36} />
                            <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} vertical={false} />
                        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: theme.colors.textMuted }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip theme={theme} />} />
                        <Area type="monotone" dataKey="saldo" name="Saldo" stroke={theme.colors.primary} strokeWidth={3} fill="url(#saldoGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState>Sem historico suficiente.</EmptyState>
                  )}
                </ChartCard>
              </ChartGrid>
            </MainColumn>

            <SideColumn>
              <SideCard>
                <ChartTitle>Comprometimento</ChartTitle>
                <Muted>Quanto da renda ja esta alocada</Muted>
                <Gauge $value={kpis.taxaComprometimento}>
                  <GaugeValue>{kpis.taxaComprometimento.toFixed(0)}%</GaugeValue>
                </Gauge>
              </SideCard>

              <SideCard>
                <ChartHeader>
                  <ChartTitle>Fluxo recente</ChartTitle>
                  <Muted>6 meses</Muted>
                </ChartHeader>
                {hasHistoricoData ? (
                  <ResponsiveContainer width="100%" height={190}>
                    <LineChart data={historico} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <XAxis dataKey="mes" hide />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip theme={theme} />} />
                      <Line type="monotone" dataKey="ganhos" name="Ganhos" stroke={theme.colors.success} strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="gastos" name="Gastos" stroke={theme.colors.error} strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState>Sem historico suficiente.</EmptyState>
                )}
              </SideCard>

              <SideCard>
                <ChartTitle>Proximos movimentos</ChartTitle>
                <AgendaList>
                  {agendaItems.length > 0 ? agendaItems.map((item, index) => {
                    const isIncome = String(item.tipo || '').includes('ganho');
                    return (
                      <AgendaItem key={`${item.descricao}-${index}`}>
                        <AgendaIcon $type={isIncome ? 'income' : 'expense'}>
                          <Icon name={isIncome ? 'income' : 'expense'} size={17} />
                        </AgendaIcon>
                        <AgendaInfo>
                          <AgendaDesc>{item.descricao}</AgendaDesc>
                          <AgendaDate>{item.label || item.proximidade || item.data}</AgendaDate>
                        </AgendaInfo>
                        <AgendaValue $type={isIncome ? 'income' : 'expense'}>
                          {isIncome ? '+' : '-'}{fmt(item.valor)}
                        </AgendaValue>
                      </AgendaItem>
                    );
                  }) : <EmptyState>Nenhum fixo cadastrado.</EmptyState>}
                </AgendaList>
              </SideCard>
            </SideColumn>
          </DashboardGrid>
        </HeroPanel>
      )}
    </DashboardShell>
  );
}
