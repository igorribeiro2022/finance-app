import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCalendario } from '../../services/calendario';
import {
  PageHeader, PageTitle, PageSubtitle, HeaderRow,
  NavBar, NavButton, MonthLabel,
  CalendarGrid, DayCell, DayNumber, DayEmpty,
  EventList, EventItem, EventDot, EventDesc, EventValue,
  EmptyDay, SkeletonCell, ErrorBanner,
  Legend, LegendItem, LegendDot,
} from './styles';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function normalizeEventosResponse(data) {
  if (!data || typeof data !== 'object') return {};
  return data;
}

function getTipoColor(tipo) {
  if (tipo === 'gastofixo' || tipo === 'gasto_fixo') return 'expense';
  if (tipo === 'ganhofixo' || tipo === 'ganho_fixo') return 'income';
  if (tipo === 'gastoeventual' || tipo === 'gasto_eventual') return 'expense';
  if (tipo === 'ganhoeventual' || tipo === 'ganho_eventual') return 'income';
  return 'neutral';
}

function getTipoLabel(tipo) {
  const labels = {
    gastofixo: 'Gasto fixo',
    ganhofixo: 'Ganho fixo',
    gastoeventual: 'Gasto eventual',
    ganhoeventual: 'Ganho eventual',
    gasto_fixo: 'Gasto fixo',
    ganho_fixo: 'Ganho fixo',
    gasto_eventual: 'Gasto eventual',
    ganho_eventual: 'Ganho eventual',
  };
  return labels[tipo] ?? tipo;
}

export default function Calendario() {
  const today = new Date();
  const [mes, setMes] = useState(today.getMonth() + 1);
  const [ano, setAno] = useState(today.getFullYear());
  const [eventosMap, setEventosMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setSelectedDay(null);

      const res = await getCalendario(mes, ano);
      setEventosMap(normalizeEventosResponse(res.data));
    } catch (err) {
      const detail = err.response?.data;
      const msg =
        typeof detail === 'object' && detail !== null
          ? Object.values(detail).flat().join(' ')
          : 'Erro ao carregar o calendário. Tente novamente.';

      setError(msg || 'Erro ao carregar o calendário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [mes, ano]);

  useEffect(() => {
    load();
  }, [load]);

  const prevMonth = () => {
    if (mes === 1) {
      setMes(12);
      setAno((a) => a - 1);
    } else {
      setMes((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (mes === 12) {
      setMes(1);
      setAno((a) => a + 1);
    } else {
      setMes((m) => m + 1);
    }
  };

  const firstDay = new Date(ano, mes - 1, 1).getDay();
  const daysInMonth = new Date(ano, mes, 0).getDate();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells = useMemo(() => {
    const list = [];
    for (let i = 0; i < firstDay; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) list.push(d);
    return list;
  }, [firstDay, daysInMonth]);

  const getDateKey = (day) =>
    `${ano}-${String(mes).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const selectedEvents = selectedDay
    ? (eventosMap[getDateKey(selectedDay)] || [])
    : [];

  return (
    <>
      <PageHeader>
        <HeaderRow>
          <div>
            <PageTitle>Calendário</PageTitle>
            <PageSubtitle>Visualize seus lançamentos distribuídos ao longo do mês.</PageSubtitle>
          </div>
        </HeaderRow>

        <NavBar>
          <NavButton onClick={prevMonth} aria-label="Mês anterior">&#8592;</NavButton>
          <MonthLabel>{MESES[mes - 1]} {ano}</MonthLabel>
          <NavButton onClick={nextMonth} aria-label="Próximo mês">&#8594;</NavButton>
        </NavBar>

        <Legend>
          <LegendItem><LegendDot $color="income" />Ganho</LegendItem>
          <LegendItem><LegendDot $color="expense" />Gasto</LegendItem>
        </Legend>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <CalendarGrid $header>
        {DIAS_SEMANA.map((d) => (
          <DayCell key={d} $header>
            <DayNumber $header>{d}</DayNumber>
          </DayCell>
        ))}
      </CalendarGrid>

      <CalendarGrid>
        {loading
          ? [...Array(35)].map((_, i) => <SkeletonCell key={i} />)
          : cells.map((day, i) => {
              if (!day) return <DayEmpty key={`empty-${i}`} />;

              const key = getDateKey(day);
              const eventos = eventosMap[key] || [];
              const isToday = key === todayStr;
              const isSelected = selectedDay === day;

              const hasIncome = eventos.some((e) => getTipoColor(e.tipo) === 'income');
              const hasExpense = eventos.some((e) => getTipoColor(e.tipo) === 'expense');

              return (
                <DayCell
                  key={key}
                  $today={isToday}
                  $selected={isSelected}
                  $hasEvents={eventos.length > 0}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  as={motion.div}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <DayNumber $today={isToday}>{day}</DayNumber>

                  {eventos.length > 0 && (
                    <EventList>
                      {hasIncome && <EventDot $color="income" />}
                      {hasExpense && <EventDot $color="expense" />}
                      {eventos.length > 2 && (
                        <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>
                          +{eventos.length}
                        </span>
                      )}
                    </EventList>
                  )}

                  {eventos.length === 0 && <EmptyDay />}
                </DayCell>
              );
            })}
      </CalendarGrid>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            style={{ marginTop: '1.5rem' }}
          >
            <PageSubtitle style={{ marginBottom: '0.75rem', fontWeight: 600 }}>
              Lançamentos do dia {String(selectedDay).padStart(2, '0')}/{String(mes).padStart(2, '0')}/{ano}
            </PageSubtitle>

            {selectedEvents.length === 0 ? (
              <ErrorBanner $info>Nenhum lançamento para este dia.</ErrorBanner>
            ) : (
              selectedEvents.map((evento, i) => (
                <EventItem
                  key={i}
                  $color={getTipoColor(evento.tipo)}
                  as={motion.div}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div>
                    <EventDesc>{evento.descricao}</EventDesc>
                    <small style={{ opacity: 0.6, fontSize: '0.75rem' }}>
                      {getTipoLabel(evento.tipo)}
                      {evento.categoria ? ` • ${evento.categoria}` : ''}
                      {evento.proximidade ? ` • ${evento.proximidade}` : ''}
                    </small>
                  </div>
                  <EventValue $color={getTipoColor(evento.tipo)}>
                    {formatCurrency(evento.valor)}
                  </EventValue>
                </EventItem>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}