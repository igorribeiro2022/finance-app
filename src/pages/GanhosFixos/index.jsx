import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';

import Icon from '../../components/Icon';
import {
  getGanhosFixos,
  createGanhoFixo,
  updateGanhoFixo,
  deleteGanhoFixo,
} from '../../services/ganhosFixos';

import { getCategorias } from '../../services/categorias';
import {
  normalizeCategoriasResponse,
  getCategoriasByTipo,
  mapCategoriasToOptions,
  getCategoriaById,
} from '../../utils/categorias';

import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  HeaderRow,
  AddButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  ActionBtn,
  EmptyState,
  SkeletonRow,
  Modal,
  ModalOverlay,
  ModalBox,
  ModalHeader,
  ModalTitle,
  CloseBtn,
  Form,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
  FormActions,
  CancelBtn,
  SubmitButton,
  Spinner,
  ErrorMessage,
  DeleteConfirm,
  ConfirmText,
  ConfirmActions,
  DangerBtn,
  TotalBar,
  TotalItem,
  TotalLabel,
  TotalValue,
} from './styles';

const schema = yup.object({
  descricao: yup.string().trim().required('Descrição obrigatória'),
  categoriaid: yup.string().required('Categoria obrigatória'),
  valor: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || typeof originalValue === 'undefined') {
        return NaN;
      }
      return Number(originalValue);
    })
    .typeError('Valor inválido')
    .positive('Deve ser positivo')
    .required('Valor obrigatório'),
  tipodia: yup.string().oneOf(['corrido', 'util']).required('Tipo de dia obrigatório'),
  numerodia: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || typeof originalValue === 'undefined') {
        return NaN;
      }
      return Number(originalValue);
    })
    .typeError('Dia inválido')
    .required('Dia obrigatório')
    .when('tipodia', {
      is: 'corrido',
      then: (s) => s.min(1, 'Informe um dia entre 1 e 31').max(31, 'Informe um dia entre 1 e 31'),
      otherwise: (s) => s.min(1, 'Informe um dia útil entre 1 e 25').max(25, 'Informe um dia útil entre 1 e 25'),
    }),
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

function getItemTipoDia(item) {
  return item.tipodia ?? item.tipo_dia ?? 'corrido';
}

function getItemNumeroDia(item) {
  return item.numerodia ?? item.numero_dia ?? '';
}

export default function GanhosFixos() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const tipoDia = watch('tipodia');

  const categoriasValidas = useMemo(
    () => getCategoriasByTipo(categorias, 'ganho'),
    [categorias]
  );

  const categoriaOptions = useMemo(
    () => mapCategoriasToOptions(categoriasValidas),
    [categoriasValidas]
  );

  const load = async () => {
    try {
      setLoading(true);
      setApiError('');
      const res = await getGanhosFixos();
      const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      setItems(data);
    } catch (err) {
      console.error('Erro ao carregar ganhos fixos:', err);
      setApiError('Erro ao carregar ganhos fixos.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
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
  };

  useEffect(() => {
    load();
    loadCategorias();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const openCreate = () => {
    setApiError('');

    if (categoriaOptions.length === 0) {
      setApiError('Cadastre ao menos uma categoria do tipo ganho ou ambos antes de criar um ganho fixo.');
      return;
    }

    setEditing(null);
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
    setApiError('');
    setEditing(item);

    const categoriaAtual =
      item.categoriaid ??
      item.categoria_id ??
      getCategoriaById(categoriasValidas, item.categoria)?.id ??
      '';

    reset({
      descricao: item.descricao ?? '',
      categoriaid: categoriaAtual ? String(categoriaAtual) : '',
      valor: item.valor ?? '',
      tipodia: getItemTipoDia(item),
      numerodia: getItemNumeroDia(item),
      observacao: item.observacao ?? '',
    });

    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setApiError('');

    const payload = {
      descricao: data.descricao.trim(),
      categoriaid: String(data.categoriaid),
      valor: formatDecimalString(data.valor),
      tipodia: data.tipodia,
      numerodia: parseInt(data.numerodia, 10),
      observacao: data.observacao?.trim() || '',
    };

    try {
      if (editing) {
        await updateGanhoFixo(editing.id, payload);
      } else {
        await createGanhoFixo(payload);
      }

      closeModal();
      await load();
    } catch (err) {
      console.error('Erro ao salvar ganho fixo:', err);
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
      await deleteGanhoFixo(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error('Erro ao excluir ganho fixo:', err);
      setApiError('Erro ao excluir.');
    }
  };

  const total = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.valor || 0), 0),
    [items]
  );

  const getCategoriaLabel = (item) => {
    if (item.categoria) return item.categoria;

    const categoriaId = item.categoriaid ?? item.categoria_id;
    const categoria = getCategoriaById(categorias, categoriaId);

    return categoria?.nome ?? '-';
  };

  return (
    <>
      <PageHeader>
        <HeaderRow>
          <div>
            <PageTitle>Ganhos Fixos</PageTitle>
            <PageSubtitle>Receitas recorrentes mensais.</PageSubtitle>
          </div>
          <AddButton onClick={openCreate}><Icon name="plus" size={16} /> Novo ganho</AddButton>
        </HeaderRow>

        <TotalBar>
          <TotalItem>
            <TotalLabel>Total mensal</TotalLabel>
            <TotalValue $type="income">{formatCurrency(total)}</TotalValue>
          </TotalItem>
          <TotalItem>
            <TotalLabel>Lançamentos</TotalLabel>
            <TotalValue>{items.length}</TotalValue>
          </TotalItem>
        </TotalBar>
      </PageHeader>

      {apiError && <ErrorMessage $banner>{apiError}</ErrorMessage>}

      <Table>
        <Thead>
          <Tr>
            <Th>Descrição</Th>
            <Th>Categoria</Th>
            <Th>Recebimento</Th>
            <Th>Valor</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading &&
            [...Array(4)].map((_, i) => (
              <Tr key={i}>
                <Td colSpan={5}>
                  <SkeletonRow />
                </Td>
              </Tr>
            ))}

          {!loading && items.length === 0 && (
            <Tr>
              <Td colSpan={5}>
                <EmptyState>
                  Nenhum ganho fixo cadastrado. Clique em "+ Novo ganho" para começar.
                </EmptyState>
              </Td>
            </Tr>
          )}

          {!loading &&
            items.map((item, i) => (
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
                  <Badge>{getCategoriaLabel(item)}</Badge>
                </Td>
                <Td>
                  {getItemTipoDia(item) === 'util'
                    ? `${getItemNumeroDia(item)}º dia útil`
                    : `Dia ${getItemNumeroDia(item)}`}
                </Td>
                <Td $income>{formatCurrency(item.valor)}</Td>
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
                <ModalTitle>{editing ? 'Editar ganho fixo' : 'Novo ganho fixo'}</ModalTitle>
                <CloseBtn onClick={closeModal}><Icon name="close" size={16} /></CloseBtn>
              </ModalHeader>

              {loadingCategorias ? (
                <SkeletonRow />
              ) : categoriaOptions.length === 0 ? (
                <EmptyState>
                  Cadastre ao menos uma categoria do tipo ganho ou ambos para continuar.
                </EmptyState>
              ) : (
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <FormGrid>
                    <FormGroup $full>
                      <Label>Descrição</Label>
                      <Input
                        placeholder="Ex: Salário, Freelance..."
                        $hasError={!!errors.descricao}
                        {...register('descricao')}
                      />
                      {errors.descricao && <ErrorMessage>{errors.descricao.message}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Categoria</Label>
                      <Select $hasError={!!errors.categoriaid} {...register('categoriaid')}>
                        <option value="">Selecione...</option>
                        {categoriaOptions.map((categoria) => (
                          <option key={categoria.value} value={categoria.value}>
                            {categoria.label}
                          </option>
                        ))}
                      </Select>
                      {errors.categoriaid && <ErrorMessage>{errors.categoriaid.message}</ErrorMessage>}
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
                      <Label>Tipo de dia</Label>
                      <Select {...register('tipodia')}>
                        <option value="corrido">Dia corrido</option>
                        <option value="util">Dia útil</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>{tipoDia === 'util' ? 'Nº dia útil (1–25)' : 'Dia do mês (1–31)'}</Label>
                      <Input
                        type="number"
                        placeholder={tipoDia === 'util' ? '1 a 25' : '1 a 31'}
                        $hasError={!!errors.numerodia}
                        {...register('numerodia')}
                      />
                      {errors.numerodia && <ErrorMessage>{errors.numerodia.message}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup $full>
                      <Label>Observação (opcional)</Label>
                      <Textarea placeholder="Anotações livres..." {...register('observacao')} />
                    </FormGroup>
                  </FormGrid>

                  {apiError && <ErrorMessage $banner>{apiError}</ErrorMessage>}

                  <FormActions>
                    <CancelBtn type="button" onClick={closeModal}>
                      Cancelar
                    </CancelBtn>
                    <SubmitButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner /> : editing ? 'Salvar alterações' : 'Criar ganho'}
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
                <CancelBtn onClick={() => setDeleteTarget(null)}>Cancelar</CancelBtn>
                <DangerBtn onClick={confirmDelete}>Excluir</DangerBtn>
              </ConfirmActions>
            </DeleteConfirm>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
