import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../../services/auth';
import {
  BrandMark,
  Container,
  ErrorMessage,
  Form,
  FormGroup,
  Input,
  Label,
  LeftPanel,
  Spinner,
  SubmitButton,
  Subtitle,
  SuccessMessage,
  Title,
} from '../Cadastro/styles';

const schema = yup.object({
  email: yup.string().email('E-mail invalido').required('E-mail obrigatorio'),
});

export default function RecuperarSenha() {
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setApiError('');
    setSuccess('');
    setDevResetUrl('');

    try {
      const response = await forgotPassword(data);
      setSuccess(response.data?.detail || 'Se o e-mail existir, enviaremos as instrucoes.');
      setDevResetUrl(response.data?.reset_url || '');
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Nao foi possivel solicitar redefinicao.');
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
        <BrandMark><span>Finance</span></BrandMark>
        <div>
          <Title>Recuperar senha</Title>
          <Subtitle>Informe seu e-mail para receber um link seguro de redefinicao.</Subtitle>
        </div>

        {success && (
          <SuccessMessage>
            {success}
            {devResetUrl && (
              <div style={{ marginTop: 8 }}>
                <Link to={new URL(devResetUrl).pathname}>Abrir link de desenvolvimento</Link>
              </div>
            )}
          </SuccessMessage>
        )}

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

          {apiError && <ErrorMessage $center>{apiError}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : 'Enviar link de redefinicao'}
          </SubmitButton>
        </Form>

        <Link to="/login?modo=email">Voltar para entrar</Link>
      </LeftPanel>
    </Container>
  );
}
