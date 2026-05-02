import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../../store/authSlice';
import api from '../../services/api';
import { postAceitarConviteComAccess } from '../../services/casa';
import { clearCasaInviteToken, getPendingCasaInviteToken } from '../../utils/casaInvite';
import {
  BrandMark,
  Container,
  ErrorMessage,
  LeftPanel,
  Spinner,
  Subtitle,
  Title,
} from '../Login/styles';

export default function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const finishOAuthLogin = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const queryParams = new URLSearchParams(window.location.search);
      const params = hashParams.toString() ? hashParams : queryParams;

      const providerError = params.get('error');
      if (providerError) {
        setError(providerError);
        return;
      }

      const access = params.get('access');
      const refresh = params.get('refresh');
      const isNewUser = params.get('is_new_user') === '1';

      if (!access || !refresh) {
        setError('Nao recebemos os tokens de autenticacao. Tente entrar novamente.');
        return;
      }

      try {
        const profile = await api.get('/auth/me/', {
          headers: { Authorization: `Bearer ${access}` },
        });

        const credentials = { access, refresh, user: profile.data };
        const inviteToken = getPendingCasaInviteToken();

        if (inviteToken) {
          try {
            await postAceitarConviteComAccess(inviteToken, access);
            clearCasaInviteToken();
            dispatch(setCredentials(credentials));
            navigate('/casa', { replace: true });
            return;
          } catch {
            clearCasaInviteToken();
          }
        }

        dispatch(setCredentials(credentials));
        navigate(isNewUser ? '/onboarding' : '/', { replace: true });
      } catch {
        setError('Nao foi possivel concluir a autenticacao. Tente novamente.');
      }
    };

    finishOAuthLogin();
  }, [dispatch, navigate]);

  return (
    <Container>
      <LeftPanel>
        <BrandMark>
          <span>Finance</span>
        </BrandMark>
        <div>
          <Title>Concluindo acesso</Title>
          <Subtitle>Estamos validando sua sessao com seguranca.</Subtitle>
        </div>
        {error ? (
          <>
            <ErrorMessage $center>{error}</ErrorMessage>
            <Link to="/login">Voltar para o login</Link>
          </>
        ) : (
          <Spinner />
        )}
      </LeftPanel>
    </Container>
  );
}
