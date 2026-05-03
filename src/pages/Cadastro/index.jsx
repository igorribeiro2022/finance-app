import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCredentials } from '../../store/authSlice';
import { getOAuthLoginUrl, registerWithEmail } from '../../services/auth';
import { postAceitarConviteComAccess } from '../../services/casa';
import {
  clearCasaInviteToken,
  getCasaInviteToken,
  saveCasaInviteToken,
} from '../../utils/casaInvite';
import { Divider, SocialButton } from '../Login/styles';
import {
  BrandMark,
  Container,
  ErrorMessage,
  FooterText,
  Form,
  FormGroup,
  Input,
  Label,
  LeftPanel,
  Logo,
  PasswordWrapper,
  RightPanel,
  Spinner,
  SubmitButton,
  Subtitle,
  SuccessMessage,
  Title,
  TogglePassword,
} from './styles';

const schema = yup.object({
  nome: yup.string().min(2, 'Nome muito curto').required('Nome obrigatorio'),
  email: yup.string().email('E-mail invalido').required('E-mail obrigatorio'),
  password: yup.string().min(8, 'Minimo 8 caracteres').required('Senha obrigatoria'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas nao coincidem')
    .required('Confirmacao obrigatoria'),
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

  const startOAuth = (provider) => {
    window.location.href = getOAuthLoginUrl(provider);
  };

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const registerResponse = await registerWithEmail(data);

      if (conviteToken) {
        try {
          await postAceitarConviteComAccess(conviteToken, registerResponse.data.access);
        } catch (inviteErr) {
          const msg = inviteErr.response?.data?.detail || 'Convite invalido ou expirado.';
          setApiError(`Conta criada, mas nao foi possivel aceitar o convite: ${msg}`);
          setTimeout(() => navigate(`/login?convite=${encodeURIComponent(conviteToken)}`), 3000);
          return;
        }

        clearCasaInviteToken();
        dispatch(setCredentials(registerResponse.data));
        setSuccessMessage('Conta criada e convite aceito! Redirecionando para sua Casa...');
        setSuccess(true);
        setTimeout(() => navigate('/casa'), 1000);
        return;
      }

      dispatch(setCredentials(registerResponse.data));
      setSuccessMessage('Conta criada com sucesso! Preparando seu onboarding...');
      setSuccess(true);
      setTimeout(() => navigate('/onboarding'), 1000);
    } catch (err) {
      const msg = err.response?.data?.email?.[0]
        || err.response?.data?.email_convidado?.[0]
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
          <span>Petrus</span>
        </BrandMark>

        <div>
          <Title>Criar conta com e-mail</Title>
          <Subtitle>Comece agora a organizar sua casa financeira sobre a Rocha.</Subtitle>
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
          <>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <SocialButton type="button" onClick={() => startOAuth('google')}>
                Continuar com Google
              </SocialButton>
              <SocialButton type="button" onClick={() => startOAuth('apple')}>
                Continuar com Apple
              </SocialButton>
              <Divider>ou cadastre com e-mail</Divider>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label>Nome completo</Label>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  autoComplete="name"
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
                    placeholder="Minimo 8 caracteres"
                    autoComplete="new-password"
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

              <FormGroup>
                <Label>Confirmar senha</Label>
                <PasswordWrapper>
                  <Input
                    type={showPassword2 ? 'text' : 'password'}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    $hasError={!!errors.password2}
                    {...register('password2')}
                  />
                  <TogglePassword
                    type="button"
                    onClick={() => setShowPassword2((value) => !value)}
                    aria-label={showPassword2 ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword2 ? 'Ocultar' : 'Mostrar'}
                  </TogglePassword>
                </PasswordWrapper>
                {errors.password2 && <ErrorMessage>{errors.password2.message}</ErrorMessage>}
              </FormGroup>

              {apiError && <ErrorMessage $center>{apiError}</ErrorMessage>}

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Criar conta'}
              </SubmitButton>
            </Form>
          </>
        )}

        <FooterText>
          Ja tem uma conta?{' '}
          <Link to={conviteToken ? `/login?modo=email&convite=${encodeURIComponent(conviteToken)}` : '/login?modo=email'}>
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
          <Title $inverse>Petrus</Title>
          <Subtitle $inverse>Sua casa sobre a Rocha.</Subtitle>
        </Logo>
      </RightPanel>
    </Container>
  );
}
