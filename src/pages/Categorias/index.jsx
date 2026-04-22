import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../../services/categorias';

import { normalizeCategoriasResponse } from '../../utils/categorias';

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
  Th,
  Thead,
  TotalBar,
  TotalItem,
  TotalLabel,
  TotalValue,
  Tr,
  ColorPreview,
} from './styles';

const schema = yup.object({
  nome: yup.string().required('Nome obrigatório'),
  tipo: yup
    .string()
    .oneOf(['gasto', 'ganho', 'ambos'], 'Tipo inválido')
    .required('Tipo obrigatório'),
  cor: yup
    .string()
    .matches(/^#([0-9A-Fa-f]{6})$/, 'Cor inválida')
    .required('Cor obrigatória'),
});

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

function getStatusCategoria(item) {
  if (typeof item.ativa === 'boolean') return item.ativa;
  if (typeof item.ativo === 'boolean') return item.ativo;
  if (typeof item.status === 'string') return item.status.toLowerCase() === 'ativa';
  return true;
}

export default function Categorias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
      nome: '',
      tipo: 'gasto',
      cor: '#F2A73C',
    },
  });

  const corAtual = watch('cor');

  const loadCategorias = async () => {
  try {
    setLoading(true);
    setApiError('');
    const res = await getCategorias();
    const data = normalizeCategoriasResponse(res.data);
    setItems(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    const detail = error.response?.data;
    const mensagem =
      typeof detail === 'object' && detail !== null
        ? Object.values(detail).flat().join(' ')
        : 'Erro ao carregar categorias.';
    setApiError(mensagem);
    setItems([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCategorias();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setApiError('');
    reset({
      nome: '',
      tipo: 'gasto',
      cor: '#F2A73C',
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setApiError('');
    reset({
      nome: item.nome ?? '',
      tipo: item.tipo ?? 'gasto',
      cor: item.cor ?? '#F2A73C',
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

    const payload = {
      nome: data.nome.trim(),
      tipo: data.tipo,
      cor: data.cor,
    };

    try {
      if (editing) {
        await updateCategoria(editing.id, payload);
      } else {
        await createCategoria(payload);
      }

      closeModal();
      await loadCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      const detail = error.response?.data;
      const mensagem =
        typeof detail === 'object' && detail !== null
          ? Object.values(detail).flat().join(' ')
          : 'Erro ao salvar categoria.';
      setApiError(mensagem);
    }
  };

  const confirmDelete = async () => {
  if (!deleteTarget) return;

  try {
    setApiError('');
    await deleteCategoria(deleteTarget.id);
    setDeleteTarget(null);
    await loadCategorias();
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    const detail = error.response?.data;
    const mensagem =
      typeof detail === 'object' && detail !== null
        ? Object.values(detail).flat().join(' ')
        : 'Erro ao excluir categoria.';
    setApiError(mensagem);
  }
};

  const totalAtivas = useMemo(
    () => items.filter((item) => getStatusCategoria(item)).length,
    [items]
  );

  return (
    <>
      <PageHeader>
        <HeaderRow>
          <div>
            <PageTitle>Categorias</PageTitle>
            <PageSubtitle>
              Cadastre categorias para usar nos gastos, ganhos e lançamentos eventuais.
            </PageSubtitle>
          </div>

          <AddButton onClick={openCreate}>
            Nova categoria
          </AddButton>
        </HeaderRow>
      </PageHeader>

      <TotalBar>
        <TotalItem
          as={motion.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TotalLabel>Total de categorias</TotalLabel>
          <TotalValue>{items.length}</TotalValue>
        </TotalItem>

        <TotalItem
          as={motion.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TotalLabel>Categorias ativas</TotalLabel>
          <TotalValue>{totalAtivas}</TotalValue>
        </TotalItem>
      </TotalBar>

      {apiError && (
        <ErrorMessage $banner>
          {apiError}
        </ErrorMessage>
      )}

      <Table>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Tipo</Th>
            <Th>Cor</Th>
            <Th>Status</Th>
            <Th>Criado em</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>

        <Tbody>
          {loading ? (
            <>
              <Tr><Td colSpan="6"><SkeletonRow /></Td></Tr>
              <Tr><Td colSpan="6"><SkeletonRow /></Td></Tr>
              <Tr><Td colSpan="6"><SkeletonRow /></Td></Tr>
            </>
          ) : items.length === 0 ? (
            <Tr>
              <Td colSpan="6">
                <EmptyState>
                  Nenhuma categoria cadastrada até o momento.
                </EmptyState>
              </Td>
            </Tr>
          ) : (
            items.map((item) => (
              <Tr key={item.id}>
                <Td>{item.nome}</Td>
                <Td>
                  <Badge>
                    {item.tipo === 'gasto'
                      ? 'Gasto'
                      : item.tipo === 'ganho'
                      ? 'Ganho'
                      : 'Ambos'}
                  </Badge>
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ColorPreview style={{ backgroundColor: item.cor }} />
                    <span>{item.cor}</span>
                  </div>
                </Td>
                <Td>{getStatusCategoria(item) ? 'Ativa' : 'Inativa'}</Td>
                <Td>{formatDateTimeBR(item.createdat ?? item.created_at)}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <ActionBtn onClick={() => openEdit(item)}>
                      ✎
                    </ActionBtn>
                    <ActionBtn $danger onClick={() => setDeleteTarget(item)}>
                      🗑
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
                  {editing ? 'Editar categoria' : 'Nova categoria'}
                </ModalTitle>
                <CloseBtn onClick={closeModal}>&times;</CloseBtn>
              </ModalHeader>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGrid>
                  <FormGroup $full>
                    <Label>Nome</Label>
                    <Input
                      type="text"
                      placeholder="Ex.: Moradia"
                      $hasError={!!errors.nome}
                      {...register('nome')}
                    />
                    {errors.nome && (
                      <ErrorMessage>{errors.nome.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Tipo</Label>
                    <Select $hasError={!!errors.tipo} {...register('tipo')}>
                      <option value="gasto">Gasto</option>
                      <option value="ganho">Ganho</option>
                      <option value="ambos">Ambos</option>
                    </Select>
                    {errors.tipo && (
                      <ErrorMessage>{errors.tipo.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Cor</Label>
                    <Input
                      type="color"
                      $hasError={!!errors.cor}
                      {...register('cor')}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ColorPreview style={{ backgroundColor: corAtual }} />
                      <span style={{ fontSize: '0.875rem' }}>{corAtual}</span>
                    </div>
                    {errors.cor && (
                      <ErrorMessage>{errors.cor.message}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormGrid>

                <FormActions>
                  <CancelBtn type="button" onClick={closeModal}>
                    Cancelar
                  </CancelBtn>

                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Spinner />
                    ) : editing ? (
                      'Salvar alterações'
                    ) : (
                      'Criar categoria'
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
                <ModalTitle>Excluir categoria</ModalTitle>
                <ConfirmText>
                  Tem certeza que deseja excluir <strong>{deleteTarget.nome}</strong>?
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