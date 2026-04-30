import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCalendario } from '../../services/calendario';
import {
  Wrapper, TopBar, ViewTabs, ViewTab, NavGroup, NavButton, PeriodLabel,
  FilterBar, FilterChip,
  CalendarGrid, DayHeader, DayCell, DayNumber, DayEmpty,
  EventChip, OverflowChip,
  WeekGrid, WeekDayCol, WeekDayHeader, WeekDayNumber, WeekDayName, WeekEventBlock,
  DayView, DayViewDate, TimelineItem, TimelineDot, TimelineInfo, TimelineDesc,
  TimelineMeta, TimelineValue,
  YearGrid, YearMonthCard, YearMonthTitle, YearMiniGrid, YearMiniDay,
  DetailPanel, DetailDate, DetailList, DetailItem, DetailItemInfo,
  DetailItemDesc, DetailItemMeta, DetailItemValue,
  EmptyState, SkeletonCell, ErrorBanner,
  Legend, LegendItem, LegendDot,
  PageTitle,
} from './styles.jsx';

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MESES_CURTOS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const DIAS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function fmt(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(Number(value || 0));
}

function getTipoColor(tipo) {
  if (!tipo) return 'neutral';
  if (tipo.includes('gasto')) return 'expense';
  if (tipo.includes('ganho')) return 'income';
  return 'neutral';
}

function getTipoLabel(tipo) {
  const labels = {
    gastofixo: 'Gasto fixo', ganhofixo: 'Ganho fixo',
    gastoeventual: 'Gasto eventual', ganhoeventual: 'Ganho eventual',
    gasto_fixo: 'Gasto fixo', ganho_fixo: 'Ganho fixo',
    gasto_eventual: 'Gasto eventual', ganho_eventual: 'Ganho eventual',
  };
  return labels[tipo] ?? tipo;
}

function dateKey(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

const MAX_CHIPS = 3;

export default function Calendario() {
  const today   = new Date();
  const [view, setView]         = useState('month'); // day | week | month | year
  const [mes, setMes]           = useState(today.getMonth() + 1);
  const [ano, setAno]           = useState(today.getFullYear());
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(today); d.setDate(today.getDate() - today.getDay()); return d;
  });
  const [dayDate, setDayDate]   = useState(today);
  const [eventosMap, setEventosMap] = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [filter, setFilter]     = useState('all'); // all | income | expense

  const load = useCallback(async (m, a) => {
    try {
      setLoading(true); setError('');
      const res = await getCalendario(m, a);
      setEventosMap((prev) => ({ ...prev, [`${a}-${m}`]: res.data }));
    } catch (err) {
      const detail = err.response?.data;
      setError(
        typeof detail === 'object' && detail !== null
          ? Object.values(detail).flat().join(' ')
          : 'Erro ao carregar o calendário.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar mês atual
  useEffect(() => { load(mes, ano); }, [load, mes, ano]);

  // Carregar meses adjacentes na visão ano
  useEffect(() => {
    if (view === 'year') {
      for (let m = 1; m <= 12; m++) {
        if (m !== mes) load(m, ano);
      }
    }
  }, [view, ano, load, mes]);

  const getEventsForDate = useCallback((y, m, d) => {
    const key = dateKey(y, m, d);
    const mapKey = `${y}-${m}`;
    const map = eventosMap[mapKey] || {};
    const events = map[key] || [];
    if (filter === 'all') return events;
    return events.filter((e) => getTipoColor(e.tipo) === (filter === 'income' ? 'income' : 'expense'));
  }, [eventosMap, filter]);

  const todayStr = dateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // ── Navegação ──────────────────────────────────────────────────────────────

  function navigate(dir) {
    if (view === 'month' || view === 'year') {
      if (dir === -1) {
        if (mes === 1) { setMes(12); setAno((a) => a - 1); }
        else setMes((m) => m - 1);
      } else {
        if (mes === 12) { setMes(1); setAno((a) => a + 1); }
        else setMes((m) => m + 1);
      }
    } else if (view === 'week') {
      setWeekStart((d) => {
        const nd = new Date(d); nd.setDate(nd.getDate() + dir * 7); return nd;
      });
    } else if (view === 'day') {
      setDayDate((d) => {
        const nd = new Date(d); nd.setDate(nd.getDate() + dir); return nd;
      });
    }
    setSelectedDay(null);
  }

  function goToday() {
    const t = new Date();
    setMes(t.getMonth() + 1); setAno(t.getFullYear());
    setDayDate(t);
    const ws = new Date(t); ws.setDate(t.getDate() - t.getDay());
    setWeekStart(ws);
    setSelectedDay(null);
  }

  // ── Label do período ──────────────────────────────────────────────────────

  function periodLabel() {
    if (view === 'month') return `${MESES[mes - 1]} ${ano}`;
    if (view === 'year') return `${ano}`;
    if (view === 'week') {
      const end = new Date(weekStart); end.setDate(weekStart.getDate() + 6);
      return `${weekStart.getDate()} ${MESES_CURTOS[weekStart.getMonth()]} – ${end.getDate()} ${MESES_CURTOS[end.getMonth()]} ${end.getFullYear()}`;
    }
    if (view === 'day') {
      return `${DIAS[dayDate.getDay()]}, ${dayDate.getDate()} de ${MESES[dayDate.getMonth()]} ${dayDate.getFullYear()}`;
    }
  }

  // ── Visão Mês ─────────────────────────────────────────────────────────────

  const firstDay    = new Date(ano, mes - 1, 1).getDay();
  const daysInMonth = new Date(ano, mes, 0).getDate();

  const monthCells = useMemo(() => {
    const list = [];
    for (let i = 0; i < firstDay; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) list.push(d);
    return list;
  }, [firstDay, daysInMonth]);

  // ── Visão Semana ──────────────────────────────────────────────────────────

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // ── Visão Ano ─────────────────────────────────────────────────────────────

  function miniCells(m) {
    const fd = new Date(ano, m - 1, 1).getDay();
    const dim = new Date(ano, m, 0).getDate();
    const cells = [];
    for (let i = 0; i < fd; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(d);
    return cells;
  }

  // ── Eventos do dia selecionado ────────────────────────────────────────────

  const selectedEvents = useMemo(() => {
    if (!selectedDay) return [];
    const [sy, sm, sd] = selectedDay.split('-').map(Number);
    return getEventsForDate(sy, sm, sd);
  }, [selectedDay, getEventsForDate]);

  return (
    <Wrapper>
      {/* Top Bar */}
      <TopBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PageTitle>Calendário</PageTitle>
        </div>
        <ViewTabs>
          {['day','week','month','year'].map((v) => (
            <ViewTab key={v} $active={view === v} onClick={() => { setView(v); setSelectedDay(null); }}>
              {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : v === 'month' ? 'Mês' : 'Ano'}
            </ViewTab>
          ))}
        </ViewTabs>
      </TopBar>

      {/* Navegação + Filtro */}
      <FilterBar>
        <NavGroup>
          <NavButton onClick={() => navigate(-1)} aria-label="Anterior">&#8592;</NavButton>
          <NavButton onClick={goToday} $today>Hoje</NavButton>
          <NavButton onClick={() => navigate(1)} aria-label="Próximo">&#8594;</NavButton>
          <PeriodLabel>{periodLabel()}</PeriodLabel>
        </NavGroup>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Legend>
            <LegendItem><LegendDot $color="income" />Ganho</LegendItem>
            <LegendItem><LegendDot $color="expense" />Gasto</LegendItem>
          </Legend>
          <FilterChip $active={filter === 'all'} onClick={() => setFilter('all')}>Todos</FilterChip>
          <FilterChip $active={filter === 'income'} $color="income" onClick={() => setFilter('income')}>Ganhos</FilterChip>
          <FilterChip $active={filter === 'expense'} $color="expense" onClick={() => setFilter('expense')}>Gastos</FilterChip>
        </div>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {/* ── VISÃO MÊS ── */}
      {view === 'month' && (
        <>
          <CalendarGrid $header>
            {DIAS.map((d) => <DayHeader key={d}>{d}</DayHeader>)}
          </CalendarGrid>
          <CalendarGrid>
            {loading
              ? [...Array(35)].map((_, i) => <SkeletonCell key={i} />)
              : monthCells.map((day, i) => {
                  if (!day) return <DayEmpty key={`e-${i}`} />;
                  const key  = dateKey(ano, mes, day);
                  const events = getEventsForDate(ano, mes, day);
                  const isToday    = key === todayStr;
                  const isSelected = selectedDay === key;
                  const visible    = events.slice(0, MAX_CHIPS);
                  const overflow   = events.length - MAX_CHIPS;

                  return (
                    <DayCell
                      key={key}
                      $today={isToday}
                      $selected={isSelected}
                      $hasEvents={events.length > 0}
                      onClick={() => setSelectedDay(isSelected ? null : key)}
                      as={motion.div}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <DayNumber $today={isToday}>{day}</DayNumber>
                      {visible.map((ev, idx) => (
                        <EventChip key={idx} $color={getTipoColor(ev.tipo)}
                          title={`${ev.descricao} — ${fmt(ev.valor)}`}>
                          {ev.descricao}
                        </EventChip>
                      ))}
                      {overflow > 0 && <OverflowChip>+{overflow} mais</OverflowChip>}
                    </DayCell>
                  );
                })}
          </CalendarGrid>
        </>
      )}

      {/* ── VISÃO SEMANA ── */}
      {view === 'week' && (
        <WeekGrid>
          {weekDays.map((d) => {
            const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
            const key     = dateKey(y, m, day);
            const events  = getEventsForDate(y, m, day);
            const isToday = key === todayStr;
            const isSelected = selectedDay === key;

            return (
              <WeekDayCol key={key} $today={isToday} $selected={isSelected}
                onClick={() => setSelectedDay(isSelected ? null : key)}>
                <WeekDayHeader $today={isToday}>
                  <WeekDayName>{DIAS[d.getDay()]}</WeekDayName>
                  <WeekDayNumber $today={isToday}>{day}</WeekDayNumber>
                </WeekDayHeader>
                {loading
                  ? <SkeletonCell style={{ height: 60, margin: '0.5rem' }} />
                  : events.length === 0
                    ? <EmptyState style={{ minHeight: 80, fontSize: '0.7rem' }}>—</EmptyState>
                    : events.map((ev, i) => (
                        <WeekEventBlock key={i} $color={getTipoColor(ev.tipo)}
                          title={`${ev.descricao} — ${fmt(ev.valor)}`}>
                          <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ev.descricao}
                          </span>
                          <span style={{ opacity: 0.85, fontSize: '0.68rem' }}>{fmt(ev.valor)}</span>
                        </WeekEventBlock>
                      ))}
              </WeekDayCol>
            );
          })}
        </WeekGrid>
      )}

      {/* ── VISÃO DIA ── */}
      {view === 'day' && (
        <DayView>
          <DayViewDate>
            {DIAS[dayDate.getDay()]}, {dayDate.getDate()} de {MESES[dayDate.getMonth()]} {dayDate.getFullYear()}
          </DayViewDate>
          {loading ? (
            <SkeletonCell style={{ height: 80 }} />
          ) : (() => {
            const y = dayDate.getFullYear(), m = dayDate.getMonth() + 1, d = dayDate.getDate();
            const events = getEventsForDate(y, m, d);
            return events.length === 0
              ? <EmptyState>Nenhum lançamento para este dia.</EmptyState>
              : events.map((ev, i) => (
                  <TimelineItem key={i} as={motion.div}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <TimelineDot $color={getTipoColor(ev.tipo)} />
                    <TimelineInfo>
                      <TimelineDesc>{ev.descricao}</TimelineDesc>
                      <TimelineMeta>
                        {getTipoLabel(ev.tipo)}
                        {ev.categoria ? ` • ${ev.categoria}` : ''}
                      </TimelineMeta>
                    </TimelineInfo>
                    <TimelineValue $color={getTipoColor(ev.tipo)}>{fmt(ev.valor)}</TimelineValue>
                  </TimelineItem>
                ));
          })()}
        </DayView>
      )}

      {/* ── VISÃO ANO ── */}
      {view === 'year' && (
        <YearGrid>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
            const cells = miniCells(m);
            const map   = eventosMap[`${ano}-${m}`] || {};
            return (
              <YearMonthCard key={m} onClick={() => { setMes(m); setView('month'); }}>
                <YearMonthTitle>{MESES_CURTOS[m - 1]}</YearMonthTitle>
                <YearMiniGrid>
                  {DIAS.map((d) => (
                    <YearMiniDay key={d} $header>{d[0]}</YearMiniDay>
                  ))}
                  {cells.map((day, i) => {
                    if (!day) return <YearMiniDay key={`e-${i}`} />;
                    const key    = dateKey(ano, m, day);
                    const events = (map[key] || []).filter((e) =>
                      filter === 'all' || getTipoColor(e.tipo) === (filter === 'income' ? 'income' : 'expense')
                    );
                    const isToday = key === todayStr;
                    const hasIncome  = events.some((e) => getTipoColor(e.tipo) === 'income');
                    const hasExpense = events.some((e) => getTipoColor(e.tipo) === 'expense');
                    return (
                      <YearMiniDay key={key} $today={isToday}
                        $hasIncome={hasIncome} $hasExpense={hasExpense}>
                        {day}
                      </YearMiniDay>
                    );
                  })}
                </YearMiniGrid>
              </YearMonthCard>
            );
          })}
        </YearGrid>
      )}

      {/* Painel de detalhes do dia selecionado */}
      <AnimatePresence>
        {selectedDay && (view === 'month' || view === 'week') && (
          <DetailPanel
            as={motion.div}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <DetailDate>
              {(() => {
                const [y, m, d] = selectedDay.split('-').map(Number);
                return `${DIAS[new Date(y,m-1,d).getDay()]}, ${d} de ${MESES[m-1]} de ${y}`;
              })()}
            </DetailDate>

            {selectedEvents.length === 0
              ? <EmptyState>Nenhum lançamento para este dia.</EmptyState>
              : (
                <DetailList>
                  {selectedEvents.map((ev, i) => (
                    <DetailItem key={i} $color={getTipoColor(ev.tipo)}
                      as={motion.div}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}>
                      <DetailItemInfo>
                        <DetailItemDesc>{ev.descricao}</DetailItemDesc>
                        <DetailItemMeta>
                          {getTipoLabel(ev.tipo)}
                          {ev.categoria ? ` • ${ev.categoria}` : ''}
                          {ev.proximidade ? ` • ${ev.proximidade}` : ''}
                        </DetailItemMeta>
                      </DetailItemInfo>
                      <DetailItemValue $color={getTipoColor(ev.tipo)}>
                        {getTipoColor(ev.tipo) === 'income' ? '+' : '−'} {fmt(ev.valor)}
                      </DetailItemValue>
                    </DetailItem>
                  ))}
                </DetailList>
              )}
          </DetailPanel>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
