import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../../services/auth';
import {
  BrandMark,
  Container,
  ErrorMessage,
  Form,
  FormGroup,
  Input,
  Label,
  LeftPanel,
  PasswordWrapper,
  Spinner,
  SubmitButton,
  Subtitle,
  SuccessMessage,
  Title,
  TogglePassword,
} from '../Cadastro/styles';

const schema = yup.object({
  password: yup.string().min(8, 'Minimo 8 caracteres').required('Senha obrigatoria'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas nao coincidem')
    .required('Confirmacao obrigatoria'),
});

export default function RedefinirSenha() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setApiError('');
    setSuccess('');

    try {
      await resetPassword({ uid, token, ...data });
      setSuccess('Senha redefinida com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/login?modo=email'), 1200);
    } catch (err) {
      const detail = err.response?.data?.token?.[0]
        || err.response?.data?.password?.[0]
        || err.response?.data?.detail
        || 'Nao foi possivel redefinir sua senha.';
      setApiError(detail);
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
        <BrandMark><span>Petrus</span></BrandMark>
        <div>
          <Title>Definir nova senha</Title>
          <Subtitle>Crie uma senha segura para recuperar o acesso a sua conta.</Subtitle>
        </div>

        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nova senha</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Minimo 8 caracteres"
                $hasError={!!errors.password}
                {...register('password')}
              />
              <TogglePassword type="button" onClick={() => setShowPassword((value) => !value)}>
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
                autoComplete="new-password"
                placeholder="Repita sua senha"
                $hasError={!!errors.password2}
                {...register('password2')}
              />
              <TogglePassword type="button" onClick={() => setShowPassword2((value) => !value)}>
                {showPassword2 ? 'Ocultar' : 'Mostrar'}
              </TogglePassword>
            </PasswordWrapper>
            {errors.password2 && <ErrorMessage>{errors.password2.message}</ErrorMessage>}
          </FormGroup>

          {apiError && <ErrorMessage $center>{apiError}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : 'Salvar nova senha'}
          </SubmitButton>
        </Form>

        <Link to="/login?modo=email">Voltar para entrar</Link>
      </LeftPanel>
    </Container>
  );
}
