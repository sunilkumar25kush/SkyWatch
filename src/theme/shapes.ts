/**
 * SkyWatch Shapes & Border Radius Design System
 */
export const Shapes = {
  // Border radius scale
  radiusSm: 16,        // radius-sm: 16px
  radiusMd: 32,        // radius-md: 32px
  radiusLg: 42,        // radius-lg: 42px
  radiusFull: 999,     // radius-full: 999px
  radiusPercentFull: '50%' as const, // radius-full: 50%

  // Direct token dictionary
  tokens: {
    'radius-sm': 16,
    'radius-md': 32,
    'radius-lg': 42,
    'radius-full': 999,
  },
} as const;
