import styled from 'styled-components';
export {
    ActionBtn,
    AddButton,
    Badge,
    CancelBtn,
    CloseBtn,
    ConfirmActions,
    ConfirmText,
    DangerBtn,
    DeleteConfirm,
    EmptyState,
    ErrorMessage,
    Form,
    FormActions,
    FormGrid,
    FormGroup,
    HeaderRow,
    Input,
    Label,
    Modal,
    ModalBox,
    ModalHeader,
    ModalOverlay,
    ModalTitle,
    PageHeader,
    PageSubtitle,
    PageTitle,
    Select,
    SkeletonRow,
    Spinner,
    SubmitButton,
    Table,
    Tbody,
    Td,
    Textarea,
    Th,
    Thead,
    TotalBar,
    TotalItem,
    TotalLabel,
    TotalValue,
    Tr,
} from '../GastosFixos/styles';


export const ColorPreview = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  margin-right: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;
`;