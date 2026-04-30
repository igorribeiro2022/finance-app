import styled, { keyframes } from 'styled-components';
import { glassPanel, glassPanelElevated, gradientPrimaryButton } from '../../styles/mixins';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const PageHeader = styled.div`margin-bottom: 1.5rem;`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.2rem;
`;

export const TotalBar = styled.div`
  ${glassPanelElevated}
  display: flex;
  gap: 2rem;
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const TotalItem = styled.div`display: flex; flex-direction: column; gap: 0.2rem;`;
export const TotalLabel = styled.span`font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${({ theme }) => theme.colors.textMuted};`;
export const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $type }) => $type === 'expense' ? theme.colors.error : theme.colors.text};
`;

export const AddButton = styled.button`
  ${gradientPrimaryButton}
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

export const Table = styled.table`
  ${glassPanel}
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;

  @media (max-width: 760px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

export const Thead = styled.thead`background: ${({ theme }) => theme.colors.surfaceOffset};`;
export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  &:last-child { border-bottom: none; }
  &:hover td { background: ${({ theme }) => theme.colors.surface2}; }
`;

export const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Td = styled.td`
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme, $expense }) => $expense ? theme.colors.error : theme.colors.text};
  font-weight: ${({ $expense }) => $expense ? '600' : '400'};
  font-variant-numeric: tabular-nums;
  transition: ${({ theme }) => theme.transition};
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primaryHighlight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 600;
`;

export const ActionBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  color: ${({ theme, $danger }) => $danger ? theme.colors.error : theme.colors.textMuted};
  transition: ${({ theme }) => theme.transition};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ theme, $danger }) => $danger ? 'rgba(217,7,7,0.08)' : theme.colors.surfaceOffset};
    color: ${({ theme, $danger }) => $danger ? theme.colors.error : theme.colors.text};
  }
`;

export const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 0.875rem;
`;

export const SkeletonRow = styled.div`
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.surfaceOffset} 25%, ${({ theme }) => theme.colors.surface2} 50%, ${({ theme }) => theme.colors.surfaceOffset} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(10px);
`;

export const ModalBox = styled.div`
  ${glassPanelElevated}
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 560px;
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 0 20px 60px ${({ theme }) => theme.colors.shadowLg};
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

export const ModalTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  transition: ${({ theme }) => theme.transition};
  &:hover { background: ${({ theme }) => theme.colors.surfaceOffset}; }
`;

export const Form = styled.form`padding: 1.5rem;`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  grid-column: ${({ $full }) => $full ? '1 / -1' : 'auto'};
`;

export const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Input = styled.input`
  padding: 0.625rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  transition: ${({ theme }) => theme.transition};
  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
  &:focus {
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => $hasError ? 'rgba(217,7,7,0.1)' : theme.colors.primaryHighlight};
  }
`;

export const Select = styled.select`
  padding: 0.625rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  transition: ${({ theme }) => theme.transition};
  cursor: pointer;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const Textarea = styled.textarea`
  padding: 0.625rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition};
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const CancelBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  font-weight: 600;
  transition: ${({ theme }) => theme.transition};
  &:hover { background: ${({ theme }) => theme.colors.surfaceOffset}; }
`;

export const SubmitButton = styled.button`
  ${gradientPrimaryButton}
  padding: 0.625rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 130px;
  justify-content: center;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.error};
  font-weight: 500;
  ${({ $banner }) => $banner && `
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background: rgba(217,7,7,0.08);
    border: 1px solid rgba(217,7,7,0.2);
    margin-bottom: 1rem;
  `}
`;

export const DeleteConfirm = styled.div`
  ${glassPanelElevated}
  position: relative;
  z-index: 1;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px ${({ theme }) => theme.colors.shadowLg};
`;

export const ConfirmText = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 1.6;
  small { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const ConfirmActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

export const DangerBtn = styled.button`
  padding: 0.625rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.textOnError};
  font-size: 0.875rem;
  font-weight: 700;
  transition: ${({ theme }) => theme.transition};
  &:hover { background: ${({ theme }) => theme.colors.errorAlt}; }
`;
