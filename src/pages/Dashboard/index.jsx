import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

const COLORS_GASTOS = ['#593D2D', '#A6806A', '#D9B29C', '#261C14', '#8B6355', '#C9A08A'];
const COLORS_GANHOS = ['#28BF11', '#4FBF30', '#1a8f08', '#76D95F', '#0f6b00', '#9BE085'];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function getNumber(value) {
  if (value === null || typeof value === 'undefined') return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function getKpis(data) {
  const k = normalizeObject(data?.kpis);
  return {
    totalGastosFixos: getNumber(k.total_gastos_fixos ?? k.totalgastosfixos),
    totalGanhosFixos: getNumber(k.total_ganhos_fixos ?? k.totalganhosfixos),
    totalGastosEventuais: getNumber(k.total_gastos_eventuais ?? k.totalgastoseventuais),
    totalGanhosEventuais: getNumber(k.total_ganhos_eventuais ?? k.totalganhoseventuais),
    taxaComprometimento: getNumber(k.taxa_comprometimento ?? k.taxacomprometimento),
  };
}

function Skeleton() {
  return (
    <>
      <KpiGrid>
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonText $w="60%" $h="12px" />
            <SkeletonText $w="80%" $h="28px" />
          </SkeletonCard>
        ))}
      </KpiGrid>
      <ChartsGrid>
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} $tall>
            <SkeletonText $w="40%" $h="16px" />
          </SkeletonCard>
        ))}
      </ChartsGrid>
    </>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  const themeMode = useSelector((state) => state.ui?.themeMode);
  const textColor = themeMode === 'dark' ? '#D9B29C' : '#593D2D';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar o dashboard. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const kpis = getKpis(data);
  const agendaItems = normalizeArray(data?.agenda ?? data?.agenda_items);
  const gastosCategoria = normalizeArray(data?.grafico_gastosporcategoria ?? data?.grafico_gastos_por_categoria);
  const ganhosCategoria = normalizeArray(data?.grafico_ganhosporcategoria ?? data?.grafico_ganhos_por_categoria);
  const fixosVsEventuais = normalizeObject(data?.graficofixosvseventuais ?? data?.grafico_fixos_vs_eventuais);
  const eventuaisPorMes = normalizeArray(data?.graficoeventuaispormes ?? data?.grafico_eventuais_por_mes);

  const fixosEventuaisData = useMemo(
    () => [
      { name: 'Gastos Fixos', valor: getNumber(fixosVsEventuais.gastos_fixos ?? fixosVsEventuais.gastosfixos) },
      { name: 'Gastos Eventuais', valor: getNumber(fixosVsEventuais.gastos_eventuais ?? fixosVsEventuais.gastos_eventuais) },
      { name: 'Ganhos Fixos', valor: getNumber(fixosVsEventuais.ganhos_fixos ?? fixosVsEventuais.ganhosfixos) },
      { name: 'Ganhos Eventuais', valor: getNumber(fixosVsEventuais.ganhos_eventuais ?? fixosVsEventuais.ganhos_eventuais) },
    ],
    [fixosVsEventuais]
  );

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
          <KpiGrid>
            {[
              { label: 'Gastos Fixos', value: kpis.totalGastosFixos, icon: '↓', type: 'expense' },
              { label: 'Ganhos Fixos', value: kpis.totalGanhosFixos, icon: '↑', type: 'income' },
              { label: 'Gastos Eventuais', value: kpis.totalGastosEventuais, icon: '↓', type: 'expense' },
              { label: 'Ganhos Eventuais', value: kpis.totalGanhosEventuais, icon: '↑', type: 'income' },
              { label: 'Comprometimento', value: `${kpis.taxaComprometimento.toFixed(1)}%`, icon: '◎', type: 'neutral' },
            ].map((kpi, i) => (
              <KpiCard
                key={kpi.label}
                as={motion.div}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                $type={kpi.type}
              >
                <KpiIcon $type={kpi.type}>{kpi.icon}</KpiIcon>
                <KpiLabel>{kpi.label}</KpiLabel>
                <KpiValue $type={kpi.type}>{kpi.label === 'Comprometimento' ? kpi.value : formatCurrency(kpi.value)}</KpiValue>
              </KpiCard>
            ))}
          </KpiGrid>

          <ChartsGrid>
            <ChartCard as={motion.div} custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <ChartTitle>Gastos por Categoria</ChartTitle>
              {gastosCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={gastosCategoria}
                      dataKey="valor"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ categoria }) => categoria}
                    >
                      {gastosCategoria.map((_, i) => (
                        <Cell key={i} fill={COLORS_GASTOS[i % COLORS_GASTOS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState>Nenhum gasto registrado</EmptyState>
              )}
            </ChartCard>

            <ChartCard as={motion.div} custom={6} initial="hidden" animate="visible" variants={fadeUp}>
              <ChartTitle>Ganhos por Categoria</ChartTitle>
              {ganhosCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={ganhosCategoria}
                      dataKey="valor"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ categoria }) => categoria}
                    >
                      {ganhosCategoria.map((_, i) => (
                        <Cell key={i} fill={COLORS_GANHOS[i % COLORS_GANHOS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState>Nenhum ganho registrado</EmptyState>
              )}
            </ChartCard>

            <ChartCard as={motion.div} custom={7} initial="hidden" animate="visible" variants={fadeUp}>
              <ChartTitle>Fixos vs Eventuais</ChartTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={fixosEventuaisData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: textColor }} />
                  <YAxis tick={{ fontSize: 11, fill: textColor }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {fixosEventuaisData.map((entry, i) => (
                      <Cell key={i} fill={i < 2 ? '#D90707' : '#28BF11'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard as={motion.div} custom={8} initial="hidden" animate="visible" variants={fadeUp} $wide>
              <ChartTitle>Eventuais por Mês (últimos 6 meses)</ChartTitle>
              {eventuaisPorMes.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={eventuaisPorMes} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: textColor }} />
                    <YAxis tick={{ fontSize: 11, fill: textColor }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="gastos" name="Gastos" fill="#D90707" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ganhos" name="Ganhos" fill="#28BF11" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState>Nenhum eventual registrado</EmptyState>
              )}
            </ChartCard>
          </ChartsGrid>

          <AgendaCard as={motion.div} custom={9} initial="hidden" animate="visible" variants={fadeUp}>
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
                      {(item.tipo || '').includes('gasto') ? '−' : '+'} {formatCurrency(item.valor)}
                    </AgendaValue>
                  </AgendaItem>
                ))}
              </AgendaList>
            ) : (
              <EmptyState>Nenhum lançamento fixo cadastrado</EmptyState>
            )}
          </AgendaCard>
        </>
      )}
    </>
  );
}