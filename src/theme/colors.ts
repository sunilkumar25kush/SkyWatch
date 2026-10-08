/**
 * SkyWatch Design System Colors
 * Custom Nature-Editorial & Warm Intelligence Palette
 */

export const color = {
  text: {
    primary: '#1C1C1C',
    secondary: '#7A7A7A',
    muted: '#A3A3A3',
    light: '#CCCCCC',
  },
  bg: {
    cream: '#F7F1E3',
  },
  surface: {
    base: '#ECEAC9',
    card: '#ECEAC9',
    translucent: 'rgba(236, 234, 201, 0.85)',
    elevated: '#E3E0B8',
  },
  border: {
    default: 'rgba(28, 28, 28, 0.12)',
    muted: '#A3A3A3',
    light: '#CCCCCC',
  },
  accent: {
    green700: '#3D8822',
    green600: '#54A534',
    green500: '#6DC04B',
    green400: '#88CC6A',
    green200: '#AADEA0',
    green100: '#ECEAC9',
    olive700: '#726C16',
    olive600: '#968F24',
    olive500: '#B1AA32',
    olive400: '#C7BE45',
    olive200: '#D2CB82',
    orange700: '#B85E10',
    orange600: '#D9721A',
    orange500: '#F0882C',
    orange400: '#F5A042',
  },
} as const;

export const Colors = {
  // Semantic hierarchy
  color,
  text: color.text,
  bg: color.bg,

  // Background & Surface
  bgCream: '#F7F1E3',
  colorBgCream: '#F7F1E3',
  surface: '#ECEAC9',
  surfaceCard: '#ECEAC9',
  surfaceCardTranslucent: 'rgba(236, 234, 201, 0.85)',
  surfaceElevated: '#E3E0B8',

  // Typography & Neutrals
  neutral900: '#1C1C1C',
  textPrimary: '#1C1C1C',
  neutral500: '#7A7A7A',
  textSecondary: '#7A7A7A',
  neutral400: '#A3A3A3',
  textMuted: '#A3A3A3',
  neutral300: '#CCCCCC',
  textLight: '#CCCCCC',

  // Borders & Dividers
  border: 'rgba(28, 28, 28, 0.12)',
  borderMuted: '#A3A3A3',
  borderLight: '#CCCCCC',

  // Green Accents
  green700: '#3D8822',
  green600: '#54A534',
  green500: '#6DC04B',
  green400: '#88CC6A',
  green200: '#AADEA0',
  green100: '#ECEAC9',

  // Olive Greens
  olive700: '#726C16',
  olive600: '#968F24',
  olive500: '#B1AA32',
  olive400: '#C7BE45',
  olive200: '#D2CB82',

  // Warm Orange Accents
  orange700: '#B85E10',
  orange600: '#D9721A',
  orange500: '#F0882C',
  orange400: '#F5A042',

  // Token Dictionary mapping to CSS Variable names
  tokens: {
    '--color-bg-cream': '#F7F1E3',
    '--color-green-100': '#ECEAC9',
    '--color-neutral-900': '#1C1C1C',
    '--color-neutral-500': '#7A7A7A',
    '--color-neutral-400': '#A3A3A3',
    '--color-green-700': '#3D8822',
    '--color-orange-700': '#B85E10',
    '--color-green-600': '#54A534',
    '--color-orange-600': '#D9721A',
    '--color-green-500': '#6DC04B',
    '--color-orange-500': '#F0882C',
    '--color-green-400': '#88CC6A',
    '--color-orange-400': '#F5A042',
    '--color-green-200': '#AADEA0',
    '--color-neutral-300': '#CCCCCC',
  },
} as const;
