import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCredentials } from '../../store/authSlice';
import api from '../../services/api';
import {
  Container, LeftPanel, RightPanel,
  Logo, Title, Subtitle,
  Form, FormGroup, Label, Input,
  ErrorMessage, SubmitButton, FooterText,
  Spinner, BrandMark,
} from './styles';

const schema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const response = await api.post('/auth/login/', data);
      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (err) {
      setApiError('E-mail ou senha incorretos.');
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
          <Title>Bem-vindo de volta</Title>
          <Subtitle>Acesse sua conta para continuar gerenciando suas finanças.</Subtitle>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="••••••••"
              $hasError={!!errors.password}
              {...register('password')}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          {apiError && <ErrorMessage $center>{apiError}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : 'Entrar'}
          </SubmitButton>
        </Form>

        <FooterText>
          Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
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