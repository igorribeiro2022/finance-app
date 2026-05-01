import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccounts, getConsents } from '../../services/openfinance';
import Icon from '../../components/Icon';
import { deleteAvatar, getMe, patchMe, uploadAvatar } from '../../services/user';
import { updateUser } from '../../store/authSlice';
import { setThemeMode, setThemePalette } from '../../store/uiSlice';
import { themeModeOptions, themePaletteOptions } from '../../styles/theme';
import {
  Actions,
  AvatarActions,
  AvatarPanel,
  AvatarPreview,
  BankGrid,
  BankMetric,
  Banner,
  Card,
  CardTitle,
  ElevatedCard,
  FormGrid,
  FormGroup,
  FormInput,
  FormSelect,
  MetricLabel,
  MetricValue,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PrimaryButton,
  ProfileEmail,
  ProfileGrid,
  ProfileName,
  SecondaryLink,
  SecondaryButton,
  SectionStack,
  HiddenFileInput,
  ToggleGrid,
  ToggleInput,
  ToggleRow,
} from './styles';

const DEFAULT_NOTIFICACOES = {
  email: true,
  resumo_semanal: true,
  alertas_bancarios: true,
  casa: true,
};

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const getApiError = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.detail) return data.detail;
  if (data && typeof data === 'object') {
    const first = Object.values(data).flat().find(Boolean);
    if (first) return String(first);
  }
  return fallback;
};

export default function Perfil() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const themeMode = useSelector((state) => state.ui?.themeMode === 'light' ? 'light' : 'dark');
  const themePalette = useSelector((state) => state.ui?.themePalette || 'emerald');

  const [form, setForm] = useState({
    nome: authUser?.nome || '',
    email: authUser?.email || '',
    telefone: authUser?.telefone || '',
    foto_perfil_url: authUser?.foto_perfil_url || '',
    preferencias: {
      tema: themeMode,
      paleta: themePalette,
      moeda: 'BRL',
      idioma: 'pt-BR',
    },
    notificacoes: DEFAULT_NOTIFICACOES,
  });
  const [consents, setConsents] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const profile = await getMe();
      const user = profile.data || {};
      const preferencias = {
        tema: themeMode,
        paleta: themePalette,
        moeda: 'BRL',
        idioma: 'pt-BR',
        ...(user.preferencias || {}),
      };

      setForm({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        foto_perfil_url: user.foto_perfil_url || '',
        preferencias,
        notificacoes: {
          ...DEFAULT_NOTIFICACOES,
          ...(user.notificacoes || {}),
        },
      });
      dispatch(updateUser(user));
    } catch {
      setError('Nao foi possivel carregar seu perfil.');
    } finally {
      setLoading(false);
    }
  }, [dispatch, themeMode, themePalette]);

  const loadBankConnections = useCallback(async () => {
    try {
      const [consentsRes, accountsRes] = await Promise.allSettled([
        getConsents(),
        getAccounts(),
      ]);

      if (consentsRes.status === 'fulfilled') {
        setConsents(normalizeList(consentsRes.value.data));
      }

      if (accountsRes.status === 'fulfilled') {
        setAccounts(normalizeList(accountsRes.value.data));
      }
    } catch {
      setConsents([]);
      setAccounts([]);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadBankConnections();
  }, [loadProfile, loadBankConnections]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => setSuccess(''), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const activeConsents = useMemo(
    () => consents.filter((consent) => !['revoked', 'rejected', 'expired'].includes(String(consent.status || '').toLowerCase())),
    [consents]
  );

  const handleField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handlePreference = (field, value) => {
    setForm((current) => ({
      ...current,
      preferencias: {
        ...current.preferencias,
        [field]: value,
      },
    }));
  };

  const handleNotification = (field) => {
    setForm((current) => ({
      ...current,
      notificacoes: {
        ...current.notificacoes,
        [field]: !current.notificacoes[field],
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        preferencias: form.preferencias,
        notificacoes: form.notificacoes,
      };
      const response = await patchMe(payload);
      const user = response.data;
      dispatch(updateUser(user));
      dispatch(setThemeMode(form.preferencias.tema));
      dispatch(setThemePalette(form.preferencias.paleta));
      setSuccess('Perfil salvo com sucesso.');
    } catch (err) {
      const detail = err?.response?.data?.detail
        || err?.response?.data?.email?.[0]
        || err?.response?.data?.nome?.[0]
        || 'Nao foi possivel salvar o perfil.';
      setError(detail);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no maximo 2MB.');
      return;
    }

    try {
      setError('');
      const response = await uploadAvatar(file);
      const user = response.data;
      dispatch(updateUser(user));
      setForm((current) => ({ ...current, foto_perfil_url: user.foto_perfil_url || '' }));
      setSuccess('Foto de perfil atualizada.');
    } catch (err) {
      setError(getApiError(err, 'Nao foi possivel enviar a foto.'));
    }
  };

  const handleAvatarDelete = async () => {
    try {
      setError('');
      const response = await deleteAvatar();
      const user = response.data;
      dispatch(updateUser(user));
      setForm((current) => ({ ...current, foto_perfil_url: '' }));
      setSuccess('Foto de perfil removida.');
    } catch {
      setError('Nao foi possivel remover a foto.');
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Perfil</PageTitle>
          <PageSubtitle>
            Gerencie seus dados, preferencias, notificacoes, tema e conexoes bancarias.
          </PageSubtitle>
        </div>
      </PageHeader>

      {error && <Banner $type="error">{error}</Banner>}
      {success && <Banner>{success}</Banner>}

      <ProfileGrid>
        <SectionStack>
          <AvatarPanel>
            <AvatarPreview>
              {form.foto_perfil_url ? (
                <img src={form.foto_perfil_url} alt="Foto de perfil" />
              ) : (
                <Icon name="user" size={42} />
              )}
            </AvatarPreview>
            <div>
              <ProfileName>{form.nome || 'Seu nome'}</ProfileName>
              <ProfileEmail>{form.email || 'email@exemplo.com'}</ProfileEmail>
            </div>
            <AvatarActions>
              <SecondaryButton as="label">
                Alterar foto
                <HiddenFileInput
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                />
              </SecondaryButton>
              {form.foto_perfil_url && (
                <SecondaryButton type="button" onClick={handleAvatarDelete}>
                  Remover
                </SecondaryButton>
              )}
            </AvatarActions>
          </AvatarPanel>

          <ElevatedCard>
            <CardTitle>Conexoes com bancos</CardTitle>
            <BankGrid>
              <BankMetric>
                <MetricLabel>Consentimentos</MetricLabel>
                <MetricValue>{activeConsents.length}</MetricValue>
              </BankMetric>
              <BankMetric>
                <MetricLabel>Contas</MetricLabel>
                <MetricValue>{accounts.length}</MetricValue>
              </BankMetric>
              <BankMetric>
                <MetricLabel>Status</MetricLabel>
                <MetricValue>{activeConsents.length > 0 ? 'OK' : '-'}</MetricValue>
              </BankMetric>
            </BankGrid>
            <Actions>
              <SecondaryLink to="/open-finance">Gerenciar Open Finance</SecondaryLink>
            </Actions>
          </ElevatedCard>
        </SectionStack>

        <SectionStack>
          <Card>
            <CardTitle>Dados pessoais</CardTitle>
            <FormGrid>
              <FormGroup>
                Nome
                <FormInput
                  value={form.nome}
                  onChange={(event) => handleField('nome', event.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                E-mail
                <FormInput
                  type="email"
                  value={form.email}
                  onChange={(event) => handleField('email', event.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                Telefone
                <FormInput
                  value={form.telefone}
                  placeholder="+55 11 99999-0000"
                  onChange={(event) => handleField('telefone', event.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </FormGrid>
          </Card>

          <Card>
            <CardTitle>Preferencias</CardTitle>
            <FormGrid>
              <FormGroup>
                Tema
                <FormSelect
                  value={form.preferencias.tema}
                  onChange={(event) => handlePreference('tema', event.target.value)}
                >
                  {themeModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                Paleta
                <FormSelect
                  value={form.preferencias.paleta}
                  onChange={(event) => handlePreference('paleta', event.target.value)}
                >
                  {themePaletteOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                Moeda
                <FormSelect
                  value={form.preferencias.moeda}
                  onChange={(event) => handlePreference('moeda', event.target.value)}
                >
                  <option value="BRL">BRL - Real brasileiro</option>
                  <option value="USD">USD - Dolar</option>
                  <option value="EUR">EUR - Euro</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                Idioma
                <FormSelect
                  value={form.preferencias.idioma}
                  onChange={(event) => handlePreference('idioma', event.target.value)}
                >
                  <option value="pt-BR">Portugues do Brasil</option>
                  <option value="en-US">English</option>
                </FormSelect>
              </FormGroup>
            </FormGrid>
          </Card>

          <Card>
            <CardTitle>Notificacoes</CardTitle>
            <ToggleGrid>
              <ToggleRow>
                <div>
                  E-mails importantes
                  <span>Receber avisos de seguranca, convites e mudancas relevantes.</span>
                </div>
                <ToggleInput
                  type="checkbox"
                  checked={!!form.notificacoes.email}
                  onChange={() => handleNotification('email')}
                />
              </ToggleRow>
              <ToggleRow>
                <div>
                  Resumo semanal
                  <span>Um panorama curto da sua semana financeira.</span>
                </div>
                <ToggleInput
                  type="checkbox"
                  checked={!!form.notificacoes.resumo_semanal}
                  onChange={() => handleNotification('resumo_semanal')}
                />
              </ToggleRow>
              <ToggleRow>
                <div>
                  Alertas bancarios
                  <span>Sincronizacoes, consentimentos e conexoes Open Finance.</span>
                </div>
                <ToggleInput
                  type="checkbox"
                  checked={!!form.notificacoes.alertas_bancarios}
                  onChange={() => handleNotification('alertas_bancarios')}
                />
              </ToggleRow>
              <ToggleRow>
                <div>
                  Casa e familia
                  <span>Convites, membros e movimentacoes compartilhadas.</span>
                </div>
                <ToggleInput
                  type="checkbox"
                  checked={!!form.notificacoes.casa}
                  onChange={() => handleNotification('casa')}
                />
              </ToggleRow>
            </ToggleGrid>
            <Actions>
              <PrimaryButton type="button" onClick={handleSave} disabled={saving || loading}>
                {saving ? 'Salvando...' : 'Salvar perfil'}
              </PrimaryButton>
            </Actions>
          </Card>
        </SectionStack>
      </ProfileGrid>
    </PageWrapper>
  );
}
