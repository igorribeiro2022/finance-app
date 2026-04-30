const themePalettes = {
  emerald: {
    label: 'Emerald',
    primary: '#00D084',
    hover: '#00B872',
    secondary: '#00FFB2',
  },
  violet: {
    label: 'Violet',
    primary: '#7C5CFC',
    hover: '#6A48F0',
    secondary: '#A78BFA',
  },
  sapphire: {
    label: 'Sapphire',
    primary: '#3B82F6',
    hover: '#2563EB',
    secondary: '#93C5FD',
  },
  amber: {
    label: 'Amber Gold',
    primary: '#F59E0B',
    hover: '#D97706',
    secondary: '#FCD34D',
  },
  rose: {
    label: 'Rose Quartz',
    primary: '#F43F8A',
    hover: '#DB2777',
    secondary: '#FB7EB5',
  },
};

const themeFoundations = {
  dark: {
    bg: '#0C0C0F',
    bgAlt: '#090A0E',
    surface: 'rgba(20, 20, 24, 0.72)',
    surface2: 'rgba(28, 28, 34, 0.82)',
    surfaceOffset: 'rgba(34, 34, 42, 0.88)',
    surfaceSolid: '#141418',
    surfaceSolid2: '#1C1C22',
    border: 'rgba(255, 255, 255, 0.08)',
    divider: 'rgba(255, 255, 255, 0.08)',
    text: '#F0F0F5',
    textMuted: '#A1A1B4',
    textFaint: '#68687A',
    overlay: 'rgba(4, 7, 16, 0.56)',
    glassBg: 'rgba(20, 20, 24, 0.72)',
    glassBgElevated: 'rgba(28, 28, 34, 0.82)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassHighlight: 'rgba(255, 255, 255, 0.06)',
    glassShadow: '0 10px 32px rgba(0, 0, 0, 0.28)',
    glassBackdrop: 'blur(18px) saturate(150%)',
    shadow: 'rgba(0, 0, 0, 0.24)',
    shadowMd: 'rgba(0, 0, 0, 0.34)',
    shadowLg: 'rgba(0, 0, 0, 0.48)',
    success: '#34C47C',
    successAlt: '#2FB06F',
    error: '#E05A5A',
    errorAlt: '#C94E4E',
    warning: '#E8A940',
    neutral: '#A0A0B0',
  },
  light: {
    bg: '#F4F7FB',
    bgAlt: '#ECF2F8',
    surface: 'rgba(255, 255, 255, 0.68)',
    surface2: 'rgba(255, 255, 255, 0.86)',
    surfaceOffset: 'rgba(248, 250, 255, 0.94)',
    surfaceSolid: '#FFFFFF',
    surfaceSolid2: '#F8FAFC',
    border: 'rgba(15, 23, 42, 0.10)',
    divider: 'rgba(15, 23, 42, 0.08)',
    text: '#0F172A',
    textMuted: '#475569',
    textFaint: '#64748B',
    overlay: 'rgba(148, 163, 184, 0.28)',
    glassBg: 'rgba(255, 255, 255, 0.68)',
    glassBgElevated: 'rgba(255, 255, 255, 0.84)',
    glassBorder: 'rgba(255, 255, 255, 0.62)',
    glassHighlight: 'rgba(255, 255, 255, 0.86)',
    glassShadow: '0 10px 28px rgba(15, 23, 42, 0.10)',
    glassBackdrop: 'blur(18px) saturate(140%)',
    shadow: 'rgba(15, 23, 42, 0.08)',
    shadowMd: 'rgba(15, 23, 42, 0.12)',
    shadowLg: 'rgba(15, 23, 42, 0.18)',
    success: '#2E9D61',
    successAlt: '#24834F',
    error: '#D94A4A',
    errorAlt: '#B73C3C',
    warning: '#CF8A15',
    neutral: '#64748B',
  },
};

const sharedTheme = {
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
};

function normalizeHex(hex) {
  const value = String(hex || '').replace('#', '').trim();
  if (value.length === 3) {
    return value.split('').map((char) => char + char).join('');
  }
  return value.slice(0, 6);
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function getContrastText(hex, light = '#F8FAFC', dark = '#081018') {
  return relativeLuminance(hex) > 0.42 ? dark : light;
}

export const themePaletteOptions = Object.entries(themePalettes).map(([value, palette]) => ({
  value,
  label: palette.label,
}));

export const themeModeOptions = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

export function getTheme(paletteKey = 'emerald', mode = 'dark') {
  const palette = themePalettes[paletteKey] || themePalettes.emerald;
  const foundation = themeFoundations[mode] || themeFoundations.dark;
  const textOnPrimary = getContrastText(palette.primary);
  const textOnSuccess = getContrastText(foundation.success);
  const textOnError = getContrastText(foundation.error);
  const primaryHighlight = withAlpha(palette.primary, mode === 'dark' ? 0.16 : 0.14);
  const primaryBorder = withAlpha(palette.primary, mode === 'dark' ? 0.35 : 0.24);
  const gradientCTA = `linear-gradient(135deg, ${palette.primary} 0%, ${palette.hover} 100%)`;
  const gradientAI = mode === 'dark'
    ? `linear-gradient(155deg, ${withAlpha(palette.secondary, 0.18)} 0%, ${withAlpha(palette.primary, 0.12)} 32%, ${foundation.surfaceSolid} 100%)`
    : `linear-gradient(155deg, ${withAlpha(palette.secondary, 0.20)} 0%, ${withAlpha(palette.primary, 0.10)} 34%, rgba(255, 255, 255, 0.92) 100%)`;
  const pageGradient = mode === 'dark'
    ? [
        `radial-gradient(circle at top right, ${withAlpha(palette.primary, 0.18)} 0%, transparent 28%)`,
        `radial-gradient(circle at bottom left, ${withAlpha(palette.secondary, 0.14)} 0%, transparent 24%)`,
        `linear-gradient(180deg, ${foundation.bgAlt} 0%, ${foundation.bg} 52%, #08090D 100%)`,
      ].join(', ')
    : [
        `radial-gradient(circle at top right, ${withAlpha(palette.primary, 0.16)} 0%, transparent 28%)`,
        `radial-gradient(circle at bottom left, ${withAlpha(palette.secondary, 0.12)} 0%, transparent 26%)`,
        `linear-gradient(180deg, #FCFDFF 0%, ${foundation.bg} 52%, ${foundation.bgAlt} 100%)`,
      ].join(', ');

  const colors = {
    ...foundation,
    primary: palette.primary,
    primaryHover: palette.hover,
    primaryActive: palette.hover,
    primaryHighlight,
    primaryBorder,
    accent: palette.secondary,
    accentHover: palette.secondary,
    link: mode === 'dark' ? palette.secondary : palette.hover,
    active: palette.primary,
    gradientCTA,
    gradientAI,
    pageGradient,
    textOnPrimary,
    textOnSuccess,
    textOnError,
    textOnInverse: mode === 'dark' ? '#F8FAFC' : '#0F172A',
  };

  return {
    ...sharedTheme,
    name: `${palette.label} ${mode === 'dark' ? 'Dark' : 'Light'}`,
    paletteKey,
    mode,
    isDark: mode === 'dark',
    colors,

    // Compatibility with older pages that still read top-level tokens.
    bg: colors.bg,
    background: colors.surfaceOffset,
    surface: colors.surface,
    surface2: colors.surface2,
    surfaceOffset: colors.surfaceOffset,
    border: colors.border,
    primary: colors.primary,
    text: colors.text,
    textMuted: colors.textMuted,
    textFaint: colors.textFaint,
    success: colors.success,
    error: colors.error,
  };
}

export const darkTheme = getTheme('emerald', 'dark');
export const lightTheme = getTheme('emerald', 'light');
