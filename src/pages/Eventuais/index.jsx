import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';

import Icon from '../../components/Icon';
import {
  getEventuais,
  createEventual,
  updateEventual,
  deleteEventual,
} from '../../services/eventuais';

import { getCategorias } from '../../services/categorias';
import {
  normalizeCategoriasResponse,
  getCategoriasByTipo,
  mapCategoriasToOptions,
  getCategoriaById,
} from '../../utils/categorias';

import {
  PageHeader, PageTitle, PageSubtitle, HeaderRow,
  TopActions, AddButton, FiltersBar, FilterGroup, FilterLabel, FilterInput, FilterSelect,
  SummaryGrid, SummaryCard, SummaryLabel, SummaryValue,
  Table, Thead, Tbody, Tr, Th, Td,
  Badge, TypeBadge, ActionBtn, EmptyState, SkeletonRow,
  Modal, ModalOverlay, ModalBox, ModalHeader,
  ModalTitle, CloseBtn, Form, FormGrid,
  FormGroup, Label, Input, Select, Textarea,
  FormActions, CancelBtn, SubmitButton, Spinner,
  ErrorMessage, DeleteConfirm, ConfirmText,
  ConfirmActions, DangerBtn,
} from './styles';

const schema = yup.object({
  descricao: yup.string().trim().required('Descrição obrigatória'),
  tipo: yup.string().oneOf(['gasto', 'ganho']).required('Tipo obrigatório'),
  categoriaid: yup.string().required('Categoria obrigatória'),
  valor: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || typeof originalValue === 'undefined') return NaN;
      return Number(originalValue);
    })
    .typeError('Valor inválido')
    .positive('Deve ser positivo')
    .required('Valor obrigatório'),
  data: yup.string().required('Data obrigatória'),
  observacao: yup.string().nullable(),
});

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function formatDecimalString(value) {
  return Number(value).toFixed(2);
}

function formatDateBR(value) {
  if (!value) return '-';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export default function Eventuais() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [apiError, setApiError] = useState('');

  const [filters, setFilters] = useState({
    tipo: '',
    categoria: '',
    data_inicio: '',
    data_fim: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({
    tipo: '',
    categoria: '',
    data_inicio: '',
    data_fim: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'gasto',
      descricao: '',
      categoriaid: '',
      valor: '',
      data: '',
      observacao: '',
    },
  });

  const watchedTipo = watch('tipo');

  const categoriasGasto = useMemo(
    () => getCategoriasByTipo(categorias, 'gasto'),
    [categorias]
  );

  const categoriasGanho = useMemo(
    () => getCategoriasByTipo(categorias, 'ganho'),
    [categorias]
  );

  const categoriasTodasAtivas = useMemo(
    () => getCategoriasByTipo(categorias, null),
    [categorias]
  );

  const categoriasDoFormulario = useMemo(
    () => (watchedTipo === 'ganho' ? categoriasGanho : categoriasGasto),
    [watchedTipo, categoriasGasto, categoriasGanho]
  );

  const categoriaOptionsFormulario = useMemo(
    () => mapCategoriasToOptions(categoriasDoFormulario),
    [categoriasDoFormulario]
  );

  const categoriasDoFiltro = useMemo(() => {
    if (filters.tipo === 'ganho') return mapCategoriasToOptions(categoriasGanho);
    if (filters.tipo === 'gasto') return mapCategoriasToOptions(categoriasGasto);
    return mapCategoriasToOptions(categoriasTodasAtivas);
  }, [filters.tipo, categoriasGasto, categoriasGanho, categoriasTodasAtivas]);

  useEffect(() => {
    const categoriaAtual = watch('categoriaid');
    const idsValidos = categoriaOptionsFormulario.map((c) => c.value);

    if (categoriaAtual && !idsValidos.includes(String(categoriaAtual))) {
      setValue('categoriaid', '');
    }
  }, [watchedTipo, categoriaOptionsFormulario, setValue, watch]);

  const loadCategorias = useCallback(async () => {
    try {
      setLoadingCategorias(true);
      const res = await getCategorias();
      const data = normalizeCategoriasResponse(res.data);
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setApiError('Erro ao carregar categorias.');
    } finally {
      setLoadingCategorias(false);
    }
  }, []);

  const load = useCallback(async (customFilters) => {
    const activeFilters = customFilters ?? appliedFilters;

    try {
      setLoading(true);
      setApiError('');

      const params = {};
      if (activeFilters.tipo) params.tipo = activeFilters.tipo;
      if (activeFilters.categoria) params.categoria = activeFilters.categoria;
      if (activeFilters.data_inicio) params.data_inicio = activeFilters.data_inicio;
      if (activeFilters.data_fim) params.data_fim = activeFilters.data_fim;

      const res = await getEventuais(params);
      const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      setItems(data);
    } catch (err) {
      console.error('Erro ao carregar eventuais:', err);
      setApiError('Erro ao carregar lançamentos eventuais.');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadCategorias();
    load();
  }, [loadCategorias, load]);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const openCreate = () => {
    setApiError('');

    if (categoriaOptionsFormulario.length === 0 && !loadingCategorias) {
      setApiError('Cadastre ao menos uma categoria antes de criar um lançamento.');
      return;
    }

    setEditing(null);
    reset({
      tipo: 'gasto',
      descricao: '',
      categoriaid: '',
      valor: '',
      data: '',
      observacao: '',
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setApiError('');
    setEditing(item);

    const categoriaId =
      item.categoriaid ??
      item.categoria_id ??
      getCategoriaById(categorias, item.categoria)?.id ??
      '';

    reset({
      tipo: item.tipo ?? 'gasto',
      descricao: item.descricao ?? '',
      categoriaid: categoriaId ? String(categoriaId) : '',
      valor: item.valor ?? '',
      data: item.data ?? '',
      observacao: item.observacao ?? '',
    });

    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setApiError('');

    const payload = {
      descricao: data.descricao.trim(),
      tipo: data.tipo,
      categoriaid: String(data.categoriaid),
      valor: formatDecimalString(data.valor),
      data: data.data,
      observacao: data.observacao?.trim() || '',
    };

    try {
      if (editing) {
        await updateEventual(editing.id, payload);
      } else {
        await createEventual(payload);
      }

      closeModal();
      await load(appliedFilters);
    } catch (err) {
      console.error('Erro ao salvar eventual:', err);
      const detail = err.response?.data;
      const msg =
        typeof detail === 'object' && detail !== null
          ? Object.values(detail).flat().join(' ')
          : 'Erro ao salvar. Verifique os dados e tente novamente.';
      setApiError(msg);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteEventual(deleteTarget.id);
      setDeleteTarget(null);
      await load(appliedFilters);
    } catch (err) {
      console.error('Erro ao excluir eventual:', err);
      setApiError('Erro ao excluir.');
    }
  };

  const filtrosAtivos = useMemo(
    () => Object.values(appliedFilters).some(Boolean),
    [appliedFilters]
  );

  const resumoFiltros = useMemo(() => {
    const partes = [];

    if (appliedFilters.tipo) {
      partes.push(`Tipo: ${appliedFilters.tipo === 'ganho' ? 'Ganhos' : 'Gastos'}`);
    }

    if (appliedFilters.categoria) {
      const cat = getCategoriaById(categorias, appliedFilters.categoria);
      partes.push(`Categoria: ${cat?.nome ?? appliedFilters.categoria}`);
    }

    if (appliedFilters.data_inicio) {
      partes.push(`De: ${formatDateBR(appliedFilters.data_inicio)}`);
    }

    if (appliedFilters.data_fim) {
      partes.push(`Até: ${formatDateBR(appliedFilters.data_fim)}`);
    }

    return partes.join(' • ');
  }, [appliedFilters, categorias]);

  const handleFilterTipoChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      tipo: value,
      categoria: '',
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    load(filters);
  };

  const clearFilters = () => {
    const cleared = {
      tipo: '',
      categoria: '',
      data_inicio: '',
      data_fim: '',
    };

    setFilters(cleared);
    setAppliedFilters(cleared);
    load(cleared);
  };

  const totalGastos = useMemo(
    () => items
      .filter((i) => i.tipo === 'gasto')
      .reduce((acc, i) => acc + Number(i.valor || 0), 0),
    [items]
  );

  const totalGanhos = useMemo(
    () => items
      .filter((i) => i.tipo === 'ganho')
      .reduce((acc, i) => acc + Number(i.valor || 0), 0),
    [items]
  );

  const getCategoriaLabel = (item) => {
    if (item.categoria && typeof item.categoria === 'string' && isNaN(Number(item.categoria))) {
      return item.categoria;
    }

    const categoriaId = item.categoriaid ?? item.categoria_id ?? item.categoria;
    const found = getCategoriaById(categorias, categoriaId);
    return found?.nome ?? '-';
  };

  return (
    <>
      <PageHeader>
        <HeaderRow>
          <div>
            <PageTitle>Eventuais</PageTitle>
            <PageSubtitle>
              Ganhos e gastos não recorrentes com filtros por período e categoria.
            </PageSubtitle>
          </div>

          <TopActions>
            <AddButton onClick={openCreate}><Icon name="plus" size={16} /> Novo lancamento</AddButton>
          </TopActions>
        </HeaderRow>

        <FiltersBar>
          <FilterGroup>
            <FilterLabel>Tipo</FilterLabel>
            <FilterSelect
              value={filters.tipo}
              onChange={(e) => handleFilterTipoChange(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="gasto">Gastos</option>
              <option value="ganho">Ganhos</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Categoria</FilterLabel>
            <FilterSelect
              value={filters.categoria}
              onChange={(e) => setFilters((prev) => ({
                ...prev,
                categoria: e.target.value,
              }))}
            >
              <option value="">Todas</option>
              {categoriasDoFiltro.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data inicial</FilterLabel>
            <FilterInput
              type="date"
              value={filters.data_inicio}
              onChange={(e) => setFilters((prev) => ({
                ...prev,
                data_inicio: e.target.value,
              }))}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data final</FilterLabel>
            <FilterInput
              type="date"
              value={filters.data_fim}
              onChange={(e) => setFilters((prev) => ({
                ...prev,
                data_fim: e.target.value,
              }))}
            />
          </FilterGroup>

          <TopActions>
            <CancelBtn type="button" onClick={clearFilters}>
              Limpar
            </CancelBtn>
            <SubmitButton type="button" onClick={applyFilters}>
              Filtrar
            </SubmitButton>
          </TopActions>
        </FiltersBar>

        {filtrosAtivos && (
          <ErrorMessage
            as="div"
            $banner
            style={{
              color: '#8a5b00',
              background: 'rgba(209, 153, 0, 0.10)',
              border: '1px solid rgba(209, 153, 0, 0.25)',
              marginTop: '1rem',
            }}
          >
            <strong>Filtro ativo:</strong> {resumoFiltros}
          </ErrorMessage>
        )}

        <SummaryGrid>
          <SummaryCard>
            <SummaryLabel>Total de gastos</SummaryLabel>
            <SummaryValue $type="expense">
              {formatCurrency(totalGastos)}
            </SummaryValue>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Total de ganhos</SummaryLabel>
            <SummaryValue $type="income">
              {formatCurrency(totalGanhos)}
            </SummaryValue>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Saldo eventual</SummaryLabel>
            <SummaryValue $type={totalGanhos - totalGastos >= 0 ? 'income' : 'expense'}>
              {formatCurrency(totalGanhos - totalGastos)}
            </SummaryValue>
          </SummaryCard>

          <SummaryCard>
            <SummaryLabel>Lançamentos</SummaryLabel>
            <SummaryValue>{items.length}</SummaryValue>
          </SummaryCard>
        </SummaryGrid>
      </PageHeader>

      {apiError && <ErrorMessage $banner>{apiError}</ErrorMessage>}

      <Table>
        <Thead>
          <Tr>
            <Th>Descrição</Th>
            <Th>Tipo</Th>
            <Th>Categoria</Th>
            <Th>Data</Th>
            <Th>Valor</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>

        <Tbody>
          {loading && [...Array(4)].map((_, i) => (
            <Tr key={i}>
              <Td colSpan={6}>
                <SkeletonRow />
              </Td>
            </Tr>
          ))}

          {!loading && items.length === 0 && (
            <Tr>
              <Td colSpan={6}>
                <EmptyState>
                  {filtrosAtivos
                    ? 'Nenhum lançamento encontrado para os filtros aplicados.'
                    : 'Nenhum lançamento eventual encontrado.'}
                </EmptyState>
              </Td>
            </Tr>
          )}

          {!loading && items.map((item, i) => (
            <Tr
              key={item.id}
              as={motion.tr}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Td>
                <strong>{item.descricao}</strong>
                {item.observacao && (
                  <small style={{ display: 'block', opacity: 0.6, fontSize: '0.75rem' }}>
                    {item.observacao}
                  </small>
                )}
              </Td>

              <Td>
                <TypeBadge $type={item.tipo}>
                  {item.tipo === 'ganho' ? 'Ganho' : 'Gasto'}
                </TypeBadge>
              </Td>

              <Td>
                <Badge>{getCategoriaLabel(item)}</Badge>
              </Td>

              <Td>{formatDateBR(item.data)}</Td>

              <Td $income={item.tipo === 'ganho'} $expense={item.tipo === 'gasto'}>
                {formatCurrency(item.valor)}
              </Td>

              <Td>
                <ActionBtn onClick={() => openEdit(item)} title="Editar">
                  <Icon name="edit" size={16} />
                </ActionBtn>
                <ActionBtn $danger onClick={() => setDeleteTarget(item)} title="Excluir">
                  <Icon name="trash" size={16} />
                </ActionBtn>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AnimatePresence>
        {modalOpen && (
          <Modal>
            <ModalOverlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            <ModalBox
              as={motion.div}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <ModalHeader>
                <ModalTitle>
                  {editing ? 'Editar lançamento eventual' : 'Novo lançamento eventual'}
                </ModalTitle>
                <CloseBtn onClick={closeModal}><Icon name="close" size={16} /></CloseBtn>
              </ModalHeader>

              {loadingCategorias ? (
                <SkeletonRow />
              ) : (
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <FormGrid>
                    <FormGroup>
                      <Label>Tipo</Label>
                      <Select $hasError={!!errors.tipo} {...register('tipo')}>
                        <option value="gasto">Gasto</option>
                        <option value="ganho">Ganho</option>
                      </Select>
                      {errors.tipo && <ErrorMessage>{errors.tipo.message}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Categoria</Label>
                      {categoriaOptionsFormulario.length === 0 ? (
                        <ErrorMessage>
                          Nenhuma categoria disponível para {watchedTipo === 'ganho' ? 'ganhos' : 'gastos'}.
                          Cadastre uma categoria antes.
                        </ErrorMessage>
                      ) : (
                        <>
                          <Select $hasError={!!errors.categoriaid} {...register('categoriaid')}>
                            <option value="">Selecione...</option>
                            {categoriaOptionsFormulario.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </Select>
                          {errors.categoriaid && <ErrorMessage>{errors.categoriaid.message}</ErrorMessage>}
                        </>
                      )}
                    </FormGroup>

                    <FormGroup $full>
                      <Label>Descrição</Label>
                      <Input
                        placeholder={
                          watchedTipo === 'ganho'
                            ? 'Ex: Freelance extra...'
                            : 'Ex: Consulta, transporte, presente...'
                        }
                        $hasError={!!errors.descricao}
                        {...register('descricao')}
                      />
                      {errors.descricao && <ErrorMessage>{errors.descricao.message}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        $hasError={!!errors.valor}
                        {...register('valor')}
                      />
                      {errors.valor && <ErrorMessage>{errors.valor.message}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Data</Label>
                      <Input
                        type="date"
                        $hasError={!!errors.data}
                        {...register('data')}
                      />
                      {errors.data && <ErrorMessage>{errors.data.message}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup $full>
                      <Label>Observação (opcional)</Label>
                      <Textarea
                        placeholder="Anotações livres..."
                        {...register('observacao')}
                      />
                    </FormGroup>
                  </FormGrid>

                  {apiError && <ErrorMessage $banner>{apiError}</ErrorMessage>}

                  <FormActions>
                    <CancelBtn type="button" onClick={closeModal}>
                      Cancelar
                    </CancelBtn>
                    <SubmitButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner /> : editing ? 'Salvar alterações' : 'Criar lançamento'}
                    </SubmitButton>
                  </FormActions>
                </Form>
              )}
            </ModalBox>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <Modal>
            <ModalOverlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
            />

            <DeleteConfirm
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ConfirmText>
                Excluir <strong>{deleteTarget?.descricao}</strong>?<br />
                <small>Essa ação não pode ser desfeita.</small>
              </ConfirmText>

              <ConfirmActions>
                <CancelBtn onClick={() => setDeleteTarget(null)}>
                  Cancelar
                </CancelBtn>
                <DangerBtn onClick={confirmDelete}>
                  Excluir
                </DangerBtn>
              </ConfirmActions>
            </DeleteConfirm>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
