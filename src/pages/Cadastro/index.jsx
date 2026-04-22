import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import {
  Container, LeftPanel, RightPanel,
  BrandMark, Logo, Title, Subtitle,
  Form, FormGroup, Label, Input,
  ErrorMessage, SubmitButton, FooterText,
  Spinner, SuccessMessage,
} from './styles';

const schema = yup.object({
  nome: yup.string().min(2, 'Nome muito curto').required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .required('Senha obrigatória'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
    .required('Confirmação obrigatória'),
});

export default function Cadastro() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await api.post('/auth/register/', data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.email?.[0]
        || err.response?.data?.detail
        || 'Erro ao criar conta. Tente novamente.';
      setApiError(msg);
    }
  };

  return (
    <Container>
      <LeftPanel
        as={motion.div}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <BrandMark>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="currentColor" opacity="0.15" />
            <path d="M10 28 L20 12 L30 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M14 22 L26 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span>Finance</span>
        </BrandMark>

        <div>
          <Title>Criar conta</Title>
          <Subtitle>Comece agora a organizar suas finanças de forma inteligente.</Subtitle>
        </div>

        {success ? (
          <SuccessMessage
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✓ Conta criada com sucesso! Redirecionando para o login...
          </SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>Nome completo</Label>
              <Input
                type="text"
                placeholder="Seu nome"
                $hasError={!!errors.nome}
                {...register('nome')}
              />
              {errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>E-mail</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                $hasError={!!errors.email}
                {...register('email')}
              />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                $hasError={!!errors.password}
                {...register('password')}
              />
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Confirmar senha</Label>
              <Input
                type="password"
                placeholder="••••••••"
                $hasError={!!errors.password2}
                {...register('password2')}
              />
              {errors.password2 && <ErrorMessage>{errors.password2.message}</ErrorMessage>}
            </FormGroup>

            {apiError && <ErrorMessage $center>{apiError}</ErrorMessage>}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : 'Criar conta'}
            </SubmitButton>
          </Form>
        )}

        <FooterText>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </FooterText>
      </LeftPanel>

      <RightPanel
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Logo>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="60" fill="currentColor" opacity="0.08" />
            <circle cx="60" cy="60" r="40" fill="currentColor" opacity="0.08" />
            <path d="M30 85 L60 35 L90 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M42 65 L78 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <Title $inverse>Finance</Title>
          <Subtitle $inverse>Controle financeiro pessoal e familiar com inteligência.</Subtitle>
        </Logo>
      </RightPanel>
    </Container>
  );
}