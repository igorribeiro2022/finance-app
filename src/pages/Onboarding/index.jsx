import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import {
  Actions,
  Card,
  CardTitle,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PrimaryButton,
  SectionStack,
  SecondaryLink,
} from '../Perfil/styles';

export default function Onboarding() {
  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Vamos preparar seu Petrus</PageTitle>
          <PageSubtitle>
            Esta etapa inicial ajuda voce a configurar categorias, casa e conexoes bancarias no seu ritmo.
          </PageSubtitle>
        </div>
      </PageHeader>

      <SectionStack>
        <Card>
          <CardTitle><Icon name="categories" size={18} /> Categorias iniciais</CardTitle>
          <PageSubtitle>
            Criamos categorias padrao para voce comecar. Voce pode ajustar tudo depois em Preferencias.
          </PageSubtitle>
          <Actions>
            <SecondaryLink to="/perfil?secao=categorias">Revisar categorias</SecondaryLink>
          </Actions>
        </Card>

        <Card>
          <CardTitle><Icon name="home" size={18} /> Casa e familia</CardTitle>
          <PageSubtitle>
            Se quiser organizar financas com outras pessoas, crie uma Casa e convide membros.
          </PageSubtitle>
          <Actions>
            <SecondaryLink to="/casa">Configurar Casa</SecondaryLink>
          </Actions>
        </Card>

        <Card>
          <CardTitle><Icon name="bank" size={18} /> Bancos e Open Finance</CardTitle>
          <PageSubtitle>
            Conecte suas contas bancarias quando estiver pronto para visualizar saldos e movimentacoes.
          </PageSubtitle>
          <Actions>
            <SecondaryLink to="/open-finance">Conectar bancos</SecondaryLink>
            <PrimaryButton as={Link} to="/">Ir para o Dashboard</PrimaryButton>
          </Actions>
        </Card>
      </SectionStack>
    </PageWrapper>
  );
}
