import React from 'react';
import Icon from '../../components/Icon';
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  SecurityGrid,
  SecurityCard,
  SecurityIcon,
  SecurityCardTitle,
  SecurityCardText,
  StatusPill,
} from './styles';

const securityItems = [
  {
    icon: 'shield',
    title: 'Senha',
    text: 'Em breve voce podera alterar sua senha por aqui com confirmacao da senha atual.',
    status: 'Planejado',
  },
  {
    icon: 'alert',
    title: 'Autenticacao em duas etapas',
    text: 'A proxima etapa vai preparar verificacao extra para proteger acessos sensiveis.',
    status: 'Proximo',
  },
  {
    icon: 'settings',
    title: 'Sessoes e dispositivos',
    text: 'Este espaco vai centralizar atividade recente, dispositivos conectados e controles de sessao.',
    status: 'Base criada',
  },
];

export default function Seguranca() {
  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Seguranca</PageTitle>
          <PageSubtitle>
            Area inicial para proteger sua conta, gerenciar senha e preparar autenticacao em duas etapas.
          </PageSubtitle>
        </div>
      </PageHeader>

      <SecurityGrid>
        {securityItems.map((item) => (
          <SecurityCard key={item.title}>
            <SecurityIcon>
              <Icon name={item.icon} size={22} />
            </SecurityIcon>
            <div>
              <SecurityCardTitle>{item.title}</SecurityCardTitle>
              <SecurityCardText>{item.text}</SecurityCardText>
              <StatusPill>{item.status}</StatusPill>
            </div>
          </SecurityCard>
        ))}
      </SecurityGrid>
    </PageWrapper>
  );
}
