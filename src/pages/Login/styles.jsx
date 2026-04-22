import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.bg};
`;

export const LeftPanel = styled.div`
  flex: 1;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 3rem;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 2rem 1.5rem;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textInverse};
  padding: 3rem;

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
  color: ${({ theme }) => theme.colors.textInverse};
`;

export const Title = styled.h1`
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 700;
  color: ${({ theme, $inverse }) =>
    $inverse ? theme.colors.textInverse : theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme, $inverse }) =>
    $inverse
      ? `rgba(242, 242, 235, 0.75)`
      : theme.colors.textMuted};
  line-height: 1.6;
  max-width: 36ch;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  margin-top: 0.5rem;
  padding: 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: ${({ theme }) => theme.transition};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(242, 242, 235, 0.3);
  border-top-color: #F2F2EB;
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