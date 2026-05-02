import styled, { keyframes } from 'styled-components';
import { glassPanel, gradientPrimaryButton } from '../../styles/mixins';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.bg};
`;

export const LeftPanel = styled.div`
  ${glassPanel}
  flex: 1;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 3rem;
  margin: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.xl};

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.gradientAI};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textOnPrimary};
  padding: 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.glassHighlight} 0%, transparent 100%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const BrandMark = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 1.25rem;
`;

export const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

export const Title = styled.h1`
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 700;
  color: ${({ theme, $inverse }) =>
    $inverse ? theme.colors.textOnPrimary : theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme, $inverse }) =>
    $inverse
      ? `${theme.colors.textOnPrimary}CC`
      : theme.colors.textMuted};
  line-height: 1.6;
  max-width: 36ch;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ActionStack = styled.div`
  display: grid;
  gap: 0.75rem;
`;

export const SocialButton = styled.button`
  width: 100%;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  font-size: 0.92rem;
  font-weight: 750;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceOffset};
    border-color: ${({ theme }) => theme.colors.primaryBorder};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  background: ${({ theme }) => theme.colors.surfaceOffset};
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.92rem;
  font-weight: 750;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHighlight};
    border-color: ${({ theme }) => theme.colors.primaryBorder};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.glassBorder};
  }
`;

export const InlineActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  a,
  button {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.82rem;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover,
  button:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.error : theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  transition: ${({ theme }) => theme.transition};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) =>
      $hasError
        ? `rgba(217, 7, 7, 0.12)`
        : theme.colors.primaryHighlight};
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.error};
  font-weight: 500;
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};
`;

export const SubmitButton = styled.button`
  ${gradientPrimaryButton}
  margin-top: 0.5rem;
  padding: 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const FooterText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${Input} {
    padding-right: 2.75rem;
    width: 100%;
  }
`;

export const TogglePassword = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.textMuted ?? '#7a7974'};
  display: flex;
  align-items: center;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors?.text ?? '#28251d'};
  }
`;
