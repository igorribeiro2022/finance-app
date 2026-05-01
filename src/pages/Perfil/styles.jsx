import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { glassPanel, glassPanelElevated, gradientPrimaryButton } from '../../styles/mixins';

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 2rem 3rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(1.35rem, 2.5vw, 2rem);
  font-weight: 800;
  margin-bottom: 0.25rem;
`;

export const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(320px, 1.2fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfileLayout = styled.div`
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfileNav = styled.nav`
  ${glassPanelElevated}
  position: sticky;
  top: 76px;
  display: grid;
  gap: 0.35rem;
  border-radius: 18px;
  padding: 0.65rem;

  @media (max-width: 900px) {
    position: static;
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const ProfileNavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  border: 0;
  border-radius: 12px;
  padding: 0.75rem;
  background: ${({ theme, $active }) => $active ? theme.colors.primaryHighlight : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textMuted};
  font-size: 0.88rem;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
    color: ${({ theme }) => theme.colors.text};
  }

  @media (max-width: 900px) {
    width: auto;
    white-space: nowrap;
    flex-shrink: 0;
  }
`;

export const ProfileContent = styled.div`
  min-width: 0;
`;

export const Card = styled.section`
  ${glassPanel}
  border-radius: 16px;
  padding: 1.25rem;
`;

export const ElevatedCard = styled(Card)`
  ${glassPanelElevated}
`;

export const CardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 0.85rem;
`;

export const AvatarPanel = styled(ElevatedCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;

export const AvatarActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const AvatarPreview = styled.div`
  width: 112px;
  height: 112px;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primaryHighlight};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  font-size: 2rem;
  font-weight: 900;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileName = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  font-weight: 800;
`;

export const ProfileEmail = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.78rem;
  font-weight: 700;
`;

export const FormInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.65rem 0.75rem;
  outline: none;
  font-size: 0.9rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.65rem 0.75rem;
  outline: none;
  font-size: 0.9rem;
`;

export const SectionStack = styled.div`
  display: grid;
  gap: 1rem;
`;

export const ToggleGrid = styled.div`
  display: grid;
  gap: 0.65rem;
`;

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  font-weight: 700;

  span {
    display: block;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.74rem;
    font-weight: 500;
    margin-top: 0.12rem;
  }
`;

export const ToggleInput = styled.input`
  width: 42px;
  height: 24px;
  appearance: none;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  position: relative;
  flex-shrink: 0;
  cursor: pointer;

  &::after {
    content: '';
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.textMuted};
    position: absolute;
    top: 2px;
    left: 2px;
    transition: ${({ theme }) => theme.transition};
  }

  &:checked {
    background: ${({ theme }) => theme.colors.primaryHighlight};
    border-color: ${({ theme }) => theme.colors.primaryBorder};
  }

  &:checked::after {
    left: 20px;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const BankGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const BankMetric = styled.div`
  padding: 0.8rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
`;

export const MetricLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const MetricValue = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.35rem;
  font-weight: 900;
  margin-top: 0.2rem;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  ${gradientPrimaryButton}
  border-radius: 10px;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  border: none;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const SecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0.55rem 0.9rem;
  background: ${({ theme }) => theme.colors.surfaceOffset};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
`;

export const Banner = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: ${({ theme, $type }) => $type === 'error' ? `${theme.colors.error}16` : `${theme.colors.success}16`};
  border: 1px solid ${({ theme, $type }) => $type === 'error' ? `${theme.colors.error}36` : `${theme.colors.success}36`};
  color: ${({ theme, $type }) => $type === 'error' ? theme.colors.error : theme.colors.success};
  font-size: 0.86rem;
  font-weight: 700;
`;
