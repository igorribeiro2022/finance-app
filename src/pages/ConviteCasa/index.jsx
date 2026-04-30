import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { postAceitarConvite } from '../../services/casa';
import { clearCasaInviteToken, saveCasaInviteToken } from '../../utils/casaInvite';
import { InviteButton, InviteCard, InvitePage, InviteText, InviteTitle } from './styles';

const getErrorMessage = (error) =>
  error?.response?.data?.detail
  || error?.response?.data?.email_convidado?.[0]
  || 'Não foi possível aceitar o convite.';

export default function ConviteCasa() {
  const { token } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth || {});
  const isAuthenticated = !!auth.isAuthenticated || !!auth.accessToken || !!auth.user;
  const [message, setMessage] = useState('Validando seu convite...');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) {
      setFailed(true);
      setMessage('Convite inválido.');
      return;
    }

    saveCasaInviteToken(token);

    if (!isAuthenticated) {
      navigate(`/cadastro?convite=${encodeURIComponent(token)}`, { replace: true });
      return;
    }

    let active = true;

    async function acceptInvite() {
      try {
        await postAceitarConvite(token);
        clearCasaInviteToken();
        if (!active) return;
        setMessage('Convite aceito. Redirecionando para sua Casa...');
        setTimeout(() => navigate('/casa', { replace: true }), 900);
      } catch (error) {
        if (!active) return;
        setFailed(true);
        setMessage(getErrorMessage(error));
      }
    }

    acceptInvite();

    return () => {
      active = false;
    };
  }, [isAuthenticated, navigate, token]);

  return (
    <InvitePage>
      <InviteCard>
        <InviteTitle>{failed ? 'Convite não aceito' : 'Convite para Casa'}</InviteTitle>
        <InviteText>{message}</InviteText>
        {failed && (
          <InviteButton type="button" onClick={() => navigate('/casa')}>
            Ir para Casa
          </InviteButton>
        )}
      </InviteCard>
    </InvitePage>
  );
}
