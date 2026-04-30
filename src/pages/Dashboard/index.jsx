import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { getDashboard } from '../../services/dashboard';
import {
  PageHeader, PageTitle, PageSubtitle,
  KpiGrid, KpiCard, KpiLabel, KpiValue, KpiIcon,
  ChartsGrid, ChartCard, ChartTitle,
  AgendaCard, AgendaTitle, AgendaList, AgendaItem,
  AgendaInfo, AgendaDesc, AgendaDate, AgendaValue,
  EmptyState, SkeletonCard, SkeletonText,
  ErrorBanner,
} from './styles';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

function fmt(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}
function num(v) {
  const n = Number(v); return Number.isFinite(n) ? n : 0;
}
function arr(v) { return Array.isArray(v) ? v : []; }
function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }

function getKpis(data) {
  const k = obj(data?.kpis);
  const gastosFixos    = num(k.total_gastos_fixos    ?? k.totalgastosfixos);
  const ganhosFixos    = num(k.total_ganhos_fixos    ?? k.totalganhosfixos);
  const gastosEventuais = num(k.total_gastos_eventuais ?? k.totalgastoseventuais);
  const ganhosEventuais = num(k.total_ganhos_eventuais ?? k.totalganhoseventuais);
  const taxaComprometimento = num(k.taxa_comprometimento ?? k.taxacomprometimento);
  const totalGastos  = gastosFixos + gastosEventuais;
  const totalGanhos  = ganhosFixos + ganhosEventuais;
  const saldoMes     = totalGanhos - totalGastos;
  return {
    gastosFixos, ganhosFixos, gastosEventuais, ganhosEventuais,
    taxaComprometimento, totalGastos, totalGanhos, saldoMes,
  };
}

function CustomTooltip({ active, payload, label, theme }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: theme.colors.glassBgElevated,
      border: `1px solid ${theme.colors.glassBorder}`,
      color: theme.colors.text,
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
      backdropFilter: theme.colors.glassBackdrop,
      WebkitBackdropFilter: theme.colors.glassBackdrop,
      boxShadow: theme.colors.glassShadow,
    }}>
      {label && <p style={{ marginBottom: 4, fontWeight: 600 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <>
      <KpiGrid>
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonText $w="60%" $h="12px" />
            <SkeletonText $w="80%" $h="28px" />
          </SkeletonCard>
        ))}
      </KpiGrid>
      <ChartsGrid>
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} $tall><SkeletonText $w="40%" $h="16px" /></SkeletonCard>
        ))}
      </ChartsGrid>
    </>
  );
}

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const { user }            = useSelector((s) => s.auth);
  const theme               = useTheme();
  const tickColor           = theme.colors.textMuted;
  const gridColor           = theme.colors.divider;
  const expenseColors       = useMemo(() => [
    theme.colors.primary,
    theme.colors.accent,
    theme.colors.link,
    theme.colors.primaryHover,
    theme.colors.neutral,
    theme.colors.textMuted,
  ], [theme]);
  const incomeColors        = useMemo(() => [
    theme.colors.success,
    theme.colors.successAlt,
    '#1F8A58',
    '#6ED59B',
    '#A7E6C0',
    '#DDF8E9',
  ], [theme]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError('');
        const res = await getDashboard();
        setData(res.data);
      } catch {
        setError('Não foi possível carregar o dashboard. Tente novamente.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis             = getKpis(data);
  const agendaItems      = arr(data?.agenda ?? data?.agenda_items);
  const gastosCategoria  = arr(data?.grafico_gastosporcategoria  ?? data?.grafico_gastos_por_categoria);
  const ganhosCategoria  = arr(data?.grafico_ganhosporcategoria  ?? data?.grafico_ganhos_por_categoria);
  const fixosVsEventuais = obj(data?.graficofixosvseventuais     ?? data?.grafico_fixos_vs_eventuais);
  const eventuaisPorMes  = arr(data?.graficoeventuaispormes      ?? data?.grafico_eventuais_por_mes);

  const fixosEventuaisData = useMemo(() => [
    { name: 'G. Fixos',     valor: num(fixosVsEventuais.gastos_fixos    ?? fixosVsEventuais.gastosfixos) },
    { name: 'G. Eventuais', valor: num(fixosVsEventuais.gastos_eventuais ?? fixosVsEventuais.gastoseventuais) },
    { name: 'R. Fixos',     valor: num(fixosVsEventuais.ganhos_fixos    ?? fixosVsEventuais.ganhosfixos) },
    { name: 'R. Eventuais', valor: num(fixosVsEventuais.ganhos_eventuais ?? fixosVsEventuais.ganhoseventuais) },
  ], [fixosVsEventuais]);

  const kpiCards = [
    { label: 'Saldo do Mês',       value: fmt(kpis.saldoMes),        icon: '◈', type: kpis.saldoMes >= 0 ? 'income' : 'expense', highlight: true },
    { label: 'Total de Ganhos',    value: fmt(kpis.totalGanhos),     icon: '↑', type: 'income' },
    { label: 'Total de Gastos',    value: fmt(kpis.totalGastos),     icon: '↓', type: 'expense' },
    { label: 'Comprometimento',    value: `${kpis.taxaComprometimento.toFixed(1)}%`, icon: '◎', type: kpis.taxaComprometimento > 80 ? 'expense' : kpis.taxaComprometimento > 50 ? 'neutral' : 'income' },
    { label: 'Ganhos Fixos',       value: fmt(kpis.ganhosFixos),     icon: '↑', type: 'income' },
    { label: 'Gastos Fixos',       value: fmt(kpis.gastosFixos),     icon: '↓', type: 'expense' },
    { label: 'Ganhos Eventuais',   value: fmt(kpis.ganhosEventuais), icon: '↑', type: 'income' },
    { label: 'Gastos Eventuais',   value: fmt(kpis.gastosEventuais), icon: '↓', type: 'expense' },
  ];

  return (
    <>
      <PageHeader>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <PageTitle>Olá, {user?.nome?.split(' ')[0] ?? 'bem-vindo'} 👋</PageTitle>
          <PageSubtitle>Aqui está o resumo financeiro do mês atual.</PageSubtitle>
        </motion.div>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {loading && <Skeleton />}

      {!loading && data && (
        <>
          {/* KPIs */}
          <KpiGrid>
            {kpiCards.map((kpi, i) => (
              <KpiCard
                key={kpi.label}
                as={motion.div}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                $type={kpi.type}
                $highlight={kpi.highlight}
              >
                <KpiIcon $type={kpi.type}>{kpi.icon}</KpiIcon>
                <KpiLabel>{kpi.label}</KpiLabel>
                <KpiValue $type={kpi.type}>{kpi.value}</KpiValue>
              </KpiCard>
            ))}
          </KpiGrid>

          {/* Gráficos */}
          <ChartsGrid>
            {/* Pizza — Gastos por Categoria */}
            <ChartCard as={motion.div} custom={8} initial="hidden" animate="visible" variants={fadeUp}>
              <ChartTitle>Gastos por Categoria</ChartTitle>
              {gastosCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={gastosCategoria} dataKey="valor" nameKey="categoria"
                      cx="50%" cy="50%" outerRadius={80} innerRadius={36}
                      label={({ categoria, percent }) =>
                        `${categoria} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {gastosCategoria.map((_, i) => (
                        <Cell key={i} fill={expenseColors[i % expenseColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyState>Nenhum gasto registrado</EmptyState>}
            </ChartCard>

            {/* Pizza — Ganhos por Categoria */}
            <ChartCard as={motion.div} custom={9} initial="hidden" animate="visible" variants={fadeUp}>
              <ChartTitle>Ganhos por Categoria</ChartTitle>
              {ganhosCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={ganhosCategoria} dataKey="valor" nameKey="categoria"
                      cx="50%" cy="50%" outerRadius={80} innerRadius={36}
                      label={({ categoria, percent }) =>
                        `${categoria} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {ganhosCategoria.map((_, i) => (
                        <Cell key={i} fill={incomeColors[i % incomeColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <EmptyState>Nenhum ganho registrado</EmptyState>}
            </ChartCard>

            {/* Barras — Fixos vs Eventuais */}
            <ChartCard as={motion.div} custom={10} initial="hidden" animate="visible" variants={fadeUp}>
              <ChartTitle>Fixos vs Eventuais</ChartTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={fixosEventuaisData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip theme={theme} />} />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {fixosEventuaisData.map((_, i) => (
                      <Cell key={i} fill={i < 2 ? '#D90707' : '#28BF11'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Linha — Eventuais por Mês */}
            <ChartCard as={motion.div} custom={11} initial="hidden" animate="visible" variants={fadeUp} $wide>
              <ChartTitle>Eventuais por Mês (últimos 6 meses)</ChartTitle>
              {eventuaisPorMes.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={eventuaisPorMes} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip theme={theme} />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="gastos" name="Gastos" stroke="#D90707" strokeWidth={2.5} dot={{ r: 4, fill: '#D90707' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="ganhos" name="Ganhos" stroke="#28BF11" strokeWidth={2.5} dot={{ r: 4, fill: '#28BF11' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <EmptyState>Nenhum eventual registrado</EmptyState>}
            </ChartCard>
          </ChartsGrid>

          {/* Agenda */}
          <AgendaCard as={motion.div} custom={12} initial="hidden" animate="visible" variants={fadeUp}>
            <AgendaTitle>Próximos Vencimentos e Recebimentos</AgendaTitle>
            {agendaItems.length > 0 ? (
              <AgendaList>
                {agendaItems.map((item, i) => (
                  <AgendaItem key={i} $type={(item.tipo || '').includes('gasto') ? 'expense' : 'income'}>
                    <AgendaInfo>
                      <AgendaDesc>{item.descricao}</AgendaDesc>
                      <AgendaDate $proximity={item.proximidade}>{item.proximidade}</AgendaDate>
                    </AgendaInfo>
                    <AgendaValue $type={(item.tipo || '').includes('gasto') ? 'expense' : 'income'}>
                      {(item.tipo || '').includes('gasto') ? '−' : '+'} {fmt(item.valor)}
                    </AgendaValue>
                  </AgendaItem>
                ))}
              </AgendaList>
            ) : <EmptyState>Nenhum lançamento fixo cadastrado</EmptyState>}
          </AgendaCard>
        </>
      )}
    </>
  );
}
