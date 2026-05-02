export const PAYMENT_CHECKLIST_STORAGE_KEY = 'finance-app:pagamentos-pagos';

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getPaymentChecklistMarks = () => {
  try {
    const saved = localStorage.getItem(PAYMENT_CHECKLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const savePaymentChecklistMarks = (marks) => {
  try {
    localStorage.setItem(PAYMENT_CHECKLIST_STORAGE_KEY, JSON.stringify(marks));
  } catch {
    // Local storage can be unavailable in private or restricted browser contexts.
  }
};

export const isPaymentEvent = (item) => {
  const tipo = normalizeText(item?.tipo);
  const subtipo = normalizeText(item?.subtipo);
  return tipo.includes('gasto') || subtipo.includes('gasto');
};

export const getPaymentChecklistKey = (item) => {
  const tipo = normalizeText(item?.tipo);
  const subtipo = normalizeText(item?.subtipo);
  const origem = normalizeText(item?.origem);
  const id = item?.id ?? item?.lancamento_id ?? item?.pagamento_id;
  const isGasto = tipo.includes('gasto') || subtipo.includes('gasto');
  const recorrencia = tipo.includes('fixo') || subtipo.includes('fixo') || origem.includes('fixo')
    ? 'fixo'
    : tipo.includes('eventual') || subtipo.includes('eventual') || origem.includes('eventual')
      ? 'eventual'
      : 'avulso';
  const kind = `${isGasto ? 'gasto' : 'ganho'}-${recorrencia}`;

  if (id !== undefined && id !== null) return `payment:${kind}:${id}`;

  return [
    'payment',
    kind,
    normalizeText(item?.data),
    normalizeText(item?.descricao),
    normalizeText(item?.valor),
  ].join(':');
};
