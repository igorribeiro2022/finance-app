import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCredentials } from '../../store/authSlice';
import { getOAuthLoginUrl, loginWithEmail } from '../../services/auth';
import { postAceitarConviteComAccess } from '../../services/casa';
import {
  clearCasaInviteToken,
  getCasaInviteToken,
  saveCasaInviteToken,
} from '../../utils/casaInvite';
import {
  ActionStack,
  BrandMark,
  Container,
  Divider,
  ErrorMessage,
  FooterText,
  Form,
  FormGroup,
  InlineActions,
  Input,
  Label,
  LeftPanel,
  Logo,
  PasswordWrapper,
  RightPanel,
  SecondaryButton,
  SocialButton,
  Spinner,
  SubmitButton,
  Subtitle,
  Title,
  TogglePassword,
} from './styles';

const schema = yup.object({
  email: yup.string().email('E-mail invalido').required('E-mail obrigatorio'),
  password: yup.string().min(6, 'Minimo 6 caracteres').required('Senha obrigatoria'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const mode = searchParams.get('modo');
  const conviteToken = useMemo(() => getCasaInviteToken(searchParams), [searchParams]);

  useEffect(() => {
    if (conviteToken) saveCasaInviteToken(conviteToken);
  }, [conviteToken]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const openEmailLogin = () => {
    const params = { modo: 'email' };
    if (conviteToken) params.convite = conviteToken;
    setSearchParams(params);
  };

  const startOAuth = (provider) => {
    window.location.href = getOAuthLoginUrl(provider);
  };

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const response = await loginWithEmail(data);
      if (conviteToken) {
        try {
          await postAceitarConviteComAccess(conviteToken, response.data.access);
          clearCasaInviteToken();
        } catch {
          clearCasaInviteToken();
        }

        dispatch(setCredentials(response.data));
        navigate('/casa');
        return;
      }

      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setApiError('Nao foi possivel conectar ao servidor. Tente novamente em instantes.');
        return;
      }

      setApiError(err.response?.data?.detail || 'E-mail ou senha incorretos.');
    }
  };

  const renderWelcome = () => (
    <>
      <div>
        <Title>Bem-vindo ao Petrus</Title>
        <Subtitle>Sua casa sobre a Rocha para organizar a vida financeira.</Subtitle>
      </div>

      <ActionStack>
        <SocialButton type="button" onClick={() => startOAuth('google')}>
          Continuar com Google
        </SocialButton>
        <SocialButton type="button" onClick={() => startOAuth('apple')}>
          Continuar com Apple
        </SocialButton>

        <Divider>ou</Divider>

        <SubmitButton
          as={Link}
          to={conviteToken ? `/cadastro?convite=${encodeURIComponent(conviteToken)}` : '/cadastro'}
        >
          Criar conta com e-mail
        </SubmitButton>
        <SecondaryButton type="button" onClick={openEmailLogin}>
          Entrar na minha conta
        </SecondaryButton>
      </ActionStack>
    </>
  );

  const renderEmailLogin = () => (
    <>
      <div>
        <Title>Entrar na minha conta</Title>
        <Subtitle>Acesse com e-mail e senha para continuar no Petrus.</Subtitle>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>E-mail</Label>
          <Input
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
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
              placeholder="Digite sua senha"
              autoComplete="current-password"
              $hasError={!!errors.password}
              {...register('password')}
            />
            <TogglePassword
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </TogglePassword>
          </PasswordWrapper>
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </FormGroup>

        <InlineActions>
          <Link to="/recuperar-senha">Esqueci minha senha</Link>
          <button type="button" onClick={() => setSearchParams(conviteToken ? { convite: conviteToken } : {})}>
            Voltar
          </button>
        </InlineActions>

        {apiError && <ErrorMessage $center>{apiError}</ErrorMessage>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : 'Entrar'}
        </SubmitButton>
      </Form>

      <FooterText>
        Nao tem uma conta?{' '}
        <Link to={conviteToken ? `/cadastro?convite=${encodeURIComponent(conviteToken)}` : '/cadastro'}>
          Criar conta
        </Link>
      </FooterText>
    </>
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
          <span>Petrus</span>
        </BrandMark>

        {mode === 'email' ? renderEmailLogin() : renderWelcome()}
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
          <Title $inverse>Petrus</Title>
          <Subtitle $inverse>Sua casa sobre a Rocha.</Subtitle>
        </Logo>
      </RightPanel>
    </Container>
  );
}
