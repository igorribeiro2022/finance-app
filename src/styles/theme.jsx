export const lightTheme = {
  colors: {
    // Paleta principal
    bg:             '#F2F2EB',
    surface:        '#FFFFFF',
    surface2:       '#F7F7F2',
    surfaceOffset:  '#EEEEE6',
    border:         'rgba(38, 28, 20, 0.12)',
    divider:        'rgba(38, 28, 20, 0.08)',

    // Texto
    text:           '#261C14',
    textMuted:      '#593D2D',
    textFaint:      '#A6806A',
    textInverse:    '#F2F2EB',

    // Marca
    primary:        '#593D2D',
    primaryHover:   '#261C14',
    primaryActive:  '#1a110c',
    primaryHighlight: '#D9B29C',

    accent:         '#A6806A',
    accentHover:    '#593D2D',

    // Positivo / Negativo
    success:        '#28BF11',
    successAlt:     '#4FBF30',
    error:          '#D90707',
    errorAlt:       '#F22929',

    // Sombras
    shadow:         'rgba(38, 28, 20, 0.08)',
    shadowMd:       'rgba(38, 28, 20, 0.12)',
    shadowLg:       'rgba(38, 28, 20, 0.18)',
  },
  radius: {
    sm:   '0.375rem',
    md:   '0.5rem',
    lg:   '0.75rem',
    xl:   '1rem',
    full: '9999px',
  },
  transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
};

export const darkTheme = {
  colors: {
    // Paleta principal (invertida)
    bg:             '#1a110c',
    surface:        '#221610',
    surface2:       '#2a1d15',
    surfaceOffset:  '#33221a',
    border:         'rgba(242, 242, 235, 0.10)',
    divider:        'rgba(242, 242, 235, 0.06)',

    // Texto
    text:           '#F2F2EB',
    textMuted:      '#D9B29C',
    textFaint:      '#A6806A',
    textInverse:    '#261C14',

    // Marca
    primary:        '#D9B29C',
    primaryHover:   '#F2F2EB',
    primaryActive:  '#FFFFFF',
    primaryHighlight: 'rgba(217, 178, 156, 0.15)',

    accent:         '#A6806A',
    accentHover:    '#D9B29C',

    // Positivo / Negativo
    success:        '#4FBF30',
    successAlt:     '#28BF11',
    error:          '#F22929',
    errorAlt:       '#D90707',

    // Sombras
    shadow:         'rgba(0, 0, 0, 0.25)',
    shadowMd:       'rgba(0, 0, 0, 0.35)',
    shadowLg:       'rgba(0, 0, 0, 0.50)',
  },
  radius: {
    sm:   '0.375rem',
    md:   '0.5rem',
    lg:   '0.75rem',
    xl:   '1rem',
    full: '9999px',
  },
  transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
};