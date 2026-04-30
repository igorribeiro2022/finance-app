import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCredentials } from '../../store/authSlice';
import api from '../../services/api';
import { postAceitarConviteComAccess } from '../../services/casa';
import {
  clearCasaInviteToken,
  getCasaInviteToken,
  saveCasaInviteToken,
} from '../../utils/casaInvite';
import {
  Container, LeftPanel, RightPanel,
  BrandMark, Logo, Title, Subtitle,
  Form, FormGroup, Label, Input,
  ErrorMessage, SubmitButton, FooterText,
  Spinner, SuccessMessage, PasswordWrapper, TogglePassword,
} from './styles';

const schema = yup.object({
  nome: yup.string().min(2, 'Nome muito curto').required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(8, 'Mínimo 8 caracteres').required('Senha obrigatória'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
    .required('Confirmação obrigatória'),
});

export default function Cadastro() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const conviteToken = useMemo(() => getCasaInviteToken(searchParams), [searchParams]);

  useEffect(() => {
    if (conviteToken) saveCasaInviteToken(conviteToken);
  }, [conviteToken]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await api.post('/auth/register/', data);
      if (conviteToken) {
        const loginResponse = await api.post('/auth/login/', {
          email: data.email,
          password: data.password,
        });

        try {
          await postAceitarConviteComAccess(conviteToken, loginResponse.data.access);
        } catch (inviteErr) {
          const msg = inviteErr.response?.data?.detail || 'Convite inválido ou expirado.';
          setApiError(`Conta criada, mas não foi possível aceitar o convite: ${msg}`);
          setTimeout(() => navigate(`/login?convite=${encodeURIComponent(conviteToken)}`), 3000);
          return;
        }

        clearCasaInviteToken();
        dispatch(setCredentials(loginResponse.data));
        setSuccessMessage('Conta criada e convite aceito! Redirecionando para sua Casa...');
        setSuccess(true);
        setTimeout(() => navigate('/casa'), 1000);
        return;
      }

      setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.email?.[0]
        || err.response?.data?.email_convidado?.[0]
        || err.response?.data?.detail
        || 'Erro ao criar conta. Tente novamente.';
      setApiError(msg);
    }
  };

  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

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
            {successMessage}
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
              <PasswordWrapper>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  $hasError={!!errors.password}
                  {...register('password')}
                />
                <TogglePassword
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </TogglePassword>
              </PasswordWrapper>
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Confirmar senha</Label>
              <PasswordWrapper>
                <Input
                  type={showPassword2 ? 'text' : 'password'}
                  placeholder="••••••••"
                  $hasError={!!errors.password2}
                  {...register('password2')}
                />
                <TogglePassword
                  type="button"
                  onClick={() => setShowPassword2((v) => !v)}
                  aria-label={showPassword2 ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword2 ? <EyeOffIcon /> : <EyeIcon />}
                </TogglePassword>
              </PasswordWrapper>
              {errors.password2 && <ErrorMessage>{errors.password2.message}</ErrorMessage>}
            </FormGroup>

            {apiError && <ErrorMessage $center>{apiError}</ErrorMessage>}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : 'Criar conta'}
            </SubmitButton>
          </Form>
        )}

        <FooterText>
          Já tem uma conta?{' '}
          <Link to={conviteToken ? `/login?convite=${encodeURIComponent(conviteToken)}` : '/login'}>
            Entrar
          </Link>
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
