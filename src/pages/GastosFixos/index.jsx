import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Icon from '../../components/Icon';
import {
  getGastosFixos,
  createGastoFixo,
  updateGastoFixo,
  deleteGastoFixo,
} from '../../services/gastosFixos';
import { getCategorias } from '../../services/categorias';
import {
  normalizeCategoriasResponse,
  getCategoriasByTipo,
  mapCategoriasToOptions,
} from '../../utils/categorias';

import {
  ActionBtn,
  AddButton,
  Badge,
  CancelBtn,
  CloseBtn,
  ConfirmActions,
  ConfirmText,
  DangerBtn,
  DeleteConfirm,
  EmptyState,
  ErrorMessage,
  Form,
  FormActions,
  FormGrid,
  FormGroup,
  HeaderRow,
  Input,
  Label,
  Modal,
  ModalBox,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  PageHeader,
  PageSubtitle,
  PageTitle,
  Select,
  SkeletonRow,
  Spinner,
  SubmitButton,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  TotalBar,
  TotalItem,
  TotalLabel,
  TotalValue,
  Tr,
} from './styles';

const schema = yup.object({
  descricao: yup.string().required('Descrição obrigatória'),
  categoriaid: yup.string().required('Categoria obrigatória'),
  valor: yup
    .number()
    .typeError('Valor inválido')
    .positive('O valor deve ser positivo')
    .required('Valor obrigatório'),
  tipodia: yup
    .string()
    .oneOf(['corrido', 'util'], 'Tipo de dia inválido')
    .required('Tipo de dia obrigatório'),
  numerodia: yup
    .number()
    .typeError('Dia inválido')
    .integer('Informe um número inteiro')
    .when('tipodia', {
      is: 'util',
      then: (schemaAtual) =>
        schemaAtual.min(1, 'Mínimo 1').max(25, 'Máximo 25').required('Dia obrigatório'),
      otherwise: (schemaAtual) =>
        schemaAtual.min(1, 'Mínimo 1').max(31, 'Máximo 31').required('Dia obrigatório'),
    }),
  observacao: yup.string().nullable(),
});

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function formatDateTimeBR(value) {
  if (!value) return '-';

  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function GastosFixos() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [apiError, setApiError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      descricao: '',
      categoriaid: '',
      valor: '',
      tipodia: 'corrido',
      numerodia: '',
      observacao: '',
    },
  });

  const tipodiaValue = useWatch({
    control,
    name: 'tipodia',
  });

  const categoriaOptions = useMemo(() => {
    const categoriasFiltradas = getCategoriasByTipo(categorias, 'gasto');
    return mapCategoriasToOptions(categoriasFiltradas);
  }, [categorias]);

  const loadCategorias = async () => {
    try {
      setCategoriasLoading(true);
      const res = await getCategorias();
      const lista = normalizeCategoriasResponse(res.data);
      setCategorias(lista);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setApiError('Erro ao carregar categorias. Verifique sua sessão e tente novamente.');
    } finally {
      setCategoriasLoading(false);
    }
  };

  const loadGastos = async () => {
    try {
      setLoading(true);
      const res = await getGastosFixos();
      const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar gastos fixos:', error);
      setApiError('Erro ao carregar gastos fixos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
    loadGastos();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setApiError('');
    reset({
      descricao: '',
      categoriaid: '',
      valor: '',
      tipodia: 'corrido',
      numerodia: '',
      observacao: '',
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    const categoriaEncontrada =
      categorias.find((cat) => String(cat.id) === String(item.categoriaid)) ||
      categorias.find((cat) => cat.nome === item.categoria);

    setEditing(item);
    setApiError('');
    reset({
      descricao: item.descricao ?? '',
      categoriaid: categoriaEncontrada ? String(categoriaEncontrada.id) : '',
      valor: item.valor ?? '',
      tipodia: item.tipodia ?? item.tipo_dia ?? 'corrido',
      numerodia: item.numerodia ?? item.numero_dia ?? '',
      observacao: item.observacao ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setApiError('');
  };

  const onSubmit = async (data) => {
    setApiError('');

    if (categoriaOptions.length === 0) {
      setApiError('Cadastre ao menos uma categoria do tipo gasto antes de criar um gasto fixo.');
      return;
    }

    const payload = {
      descricao: data.descricao.trim(),
      categoriaid: Number(data.categoriaid),
      valor: Number(data.valor).toFixed(2),
      tipodia: data.tipodia,
      numerodia: Number(data.numerodia),
      observacao: data.observacao?.trim() || '',
    };

    try {
      if (editing) {
        await updateGastoFixo(editing.id, payload);
      } else {
        await createGastoFixo(payload);
      }

      closeModal();
      await loadGastos();
    } catch (error) {
      console.error('Erro ao salvar gasto fixo:', error);

      const detail = error.response?.data;
      const mensagem =
        typeof detail === 'object' && detail !== null
          ? Object.values(detail).flat().join(' ')
          : 'Erro ao salvar gasto fixo.';

      setApiError(mensagem);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteGastoFixo(deleteTarget.id);
      setDeleteTarget(null);
      await loadGastos();
    } catch (error) {
      console.error('Erro ao excluir gasto fixo:', error);
      setApiError('Erro ao excluir gasto fixo.');
    }
  };

  const totalMensal = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [items]);

  return (
    <>
      <PageHeader>
        <HeaderRow>
          <div>
            <PageTitle>Gastos Fixos</PageTitle>
            <PageSubtitle>
              Cadastre despesas recorrentes mensais vinculadas às suas categorias.
            </PageSubtitle>
          </div>

          <AddButton
            onClick={openCreate}
            disabled={categoriasLoading || categoriaOptions.length === 0}
          >
            <Icon name="plus" size={16} /> Novo gasto fixo
          </AddButton>
        </HeaderRow>
      </PageHeader>

      <TotalBar>
        <TotalItem
          as={motion.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TotalLabel>Total mensal</TotalLabel>
          <TotalValue>{formatCurrency(totalMensal)}</TotalValue>
        </TotalItem>

        <TotalItem
          as={motion.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TotalLabel>Total de registros</TotalLabel>
          <TotalValue>{items.length}</TotalValue>
        </TotalItem>
      </TotalBar>

      {!categoriasLoading && categoriaOptions.length === 0 && (
        <ErrorMessage style={{ marginBottom: '1rem' }}>
          Nenhuma categoria do tipo gasto foi encontrada. Cadastre uma categoria antes de criar gastos fixos.
        </ErrorMessage>
      )}

      {apiError && (
        <ErrorMessage style={{ marginBottom: '1rem' }}>
          {apiError}
        </ErrorMessage>
      )}

      <Table>
        <Thead>
          <Tr>
            <Th>Descrição</Th>
            <Th>Categoria</Th>
            <Th>Valor</Th>
            <Th>Tipo de dia</Th>
            <Th>Dia</Th>
            <Th>Criado em</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>

        <Tbody>
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : items.length === 0 ? (
            <Tr>
              <Td colSpan="7">
                <EmptyState>
                  Nenhum gasto fixo cadastrado até o momento.
                </EmptyState>
              </Td>
            </Tr>
          ) : (
            items.map((item) => (
              <Tr key={item.id}>
                <Td>{item.descricao}</Td>
                <Td>
                  <Badge>{item.categoria}</Badge>
                </Td>
                <Td>{formatCurrency(item.valor)}</Td>
                <Td>{(item.tipodia ?? item.tipo_dia) === 'util' ? 'Dia útil' : 'Dia corrido'}</Td>
                <Td>{item.numerodia ?? item.numero_dia}</Td>
                <Td>{formatDateTimeBR(item.createdat ?? item.created_at)}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <ActionBtn onClick={() => openEdit(item)} aria-label={`Editar ${item.descricao}`}>
                      <Icon name="edit" size={16} />
                    </ActionBtn>
                    <ActionBtn $danger onClick={() => setDeleteTarget(item)} aria-label={`Excluir ${item.descricao}`}>
                      <Icon name="trash" size={16} />
                    </ActionBtn>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <AnimatePresence>
        {modalOpen && (
          <Modal>
            <ModalOverlay onClick={closeModal} />
            <ModalBox
              as={motion.div}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ModalHeader>
                <ModalTitle>
                  {editing ? 'Editar gasto fixo' : 'Novo gasto fixo'}
                </ModalTitle>
                <CloseBtn onClick={closeModal}><Icon name="close" size={16} /></CloseBtn>
              </ModalHeader>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGrid>
                  <FormGroup>
                    <Label>Descrição</Label>
                    <Input
                      type="text"
                      placeholder="Ex.: Aluguel"
                      {...register('descricao')}
                    />
                    {errors.descricao && (
                      <ErrorMessage>{errors.descricao.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Categoria</Label>
                    <Select {...register('categoriaid')}>
                      <option value="">
                        {categoriasLoading ? 'Carregando categorias...' : 'Selecione'}
                      </option>
                      {categoriaOptions.map((categoria) => (
                        <option key={categoria.value} value={categoria.value}>
                          {categoria.label}
                        </option>
                      ))}
                    </Select>
                    {errors.categoriaid && (
                      <ErrorMessage>{errors.categoriaid.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      {...register('valor')}
                    />
                    {errors.valor && (
                      <ErrorMessage>{errors.valor.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Tipo de dia</Label>
                    <Select {...register('tipodia')}>
                      <option value="corrido">Dia corrido</option>
                      <option value="util">Dia útil</option>
                    </Select>
                    {errors.tipodia && (
                      <ErrorMessage>{errors.tipodia.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      Número do dia {tipodiaValue === 'util' ? '(1 a 25)' : '(1 a 31)'}
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max={tipodiaValue === 'util' ? '25' : '31'}
                      placeholder="Ex.: 5"
                      {...register('numerodia')}
                    />
                    {errors.numerodia && (
                      <ErrorMessage>{errors.numerodia.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <Label>Observação</Label>
                    <Textarea
                      rows="4"
                      placeholder="Opcional"
                      {...register('observacao')}
                    />
                    {errors.observacao && (
                      <ErrorMessage>{errors.observacao.message}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormGrid>

                <FormActions>
                  <CancelBtn type="button" onClick={closeModal}>
                    Cancelar
                  </CancelBtn>

                  <SubmitButton
                    type="submit"
                    disabled={isSubmitting || categoriasLoading || categoriaOptions.length === 0}
                  >
                    {isSubmitting ? (
                      <Spinner />
                    ) : editing ? (
                      'Salvar alterações'
                    ) : (
                      'Criar gasto fixo'
                    )}
                  </SubmitButton>
                </FormActions>
              </Form>
            </ModalBox>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <Modal>
            <ModalOverlay onClick={() => setDeleteTarget(null)} />
            <ModalBox
              as={motion.div}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <DeleteConfirm>
                <ModalTitle>Excluir gasto fixo</ModalTitle>
                <ConfirmText>
                  Tem certeza que deseja excluir <strong>{deleteTarget.descricao}</strong>?
                </ConfirmText>

                <ConfirmActions>
                  <CancelBtn type="button" onClick={() => setDeleteTarget(null)}>
                    Cancelar
                  </CancelBtn>
                  <DangerBtn type="button" onClick={confirmDelete}>
                    Excluir
                  </DangerBtn>
                </ConfirmActions>
              </DeleteConfirm>
            </ModalBox>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
