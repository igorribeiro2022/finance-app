function isCategoriaAtiva(categoria) {
  if (typeof categoria?.ativa === 'boolean') return categoria.ativa;
  if (typeof categoria?.ativo === 'boolean') return categoria.ativo;
  if (typeof categoria?.status === 'string') {
    return categoria.status.toLowerCase() === 'ativa';
  }
  return true;
}

export function normalizeCategoriasResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function getCategoriasAtivas(categorias = []) {
  return categorias.filter((categoria) => isCategoriaAtiva(categoria));
}

export function getCategoriasByTipo(categorias = [], tipo) {
  const categoriasAtivas = getCategoriasAtivas(categorias);

  if (!tipo) {
    return categoriasAtivas;
  }

  return categoriasAtivas.filter((categoria) => {
    return categoria.tipo === tipo || categoria.tipo === 'ambos';
  });
}

export function getCategoriaById(categorias = [], id) {
  return categorias.find((categoria) => String(categoria.id) === String(id)) || null;
}

export function mapCategoriasToOptions(categorias = []) {
  return categorias.map((categoria) => ({
    value: String(categoria.id),
    label: categoria.nome,
    cor: categoria.cor,
    tipo: categoria.tipo,
    ativa: isCategoriaAtiva(categoria),
  }));
}