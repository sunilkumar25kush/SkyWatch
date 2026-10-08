/**
 * SkyWatch Motion & Animation Design System
 * 
 * Tokens:
 * - duration-fast: 0.15s (150ms)
 * - duration-slow: 5s (5000ms)
 * - hoppy-bob: 5s ease-in-out infinite hoppy-bob
 */
export const Motion = {
  // Durations
  durationFast: '0.15s',
  durationFastMs: 150,
  durationSlow: '5s',
  durationSlowMs: 5000,

  // Transitions
  transitions: {
    all: 'all 0.15s',
    none: 'none',
    transform: 'transform 0.15s',
    color: 'color 0.15s',
    transformBackground: 'transform 0.15s, background 0.15s',
    transformBoxShadow: 'transform 0.15s, box-shadow 0.15s',
  },

  // Animations
  animations: {
    hoppyBob: '5s ease-in-out infinite hoppy-bob',
  },

  // Direct token dictionary
  tokens: {
    'duration-fast': '0.15s',
    'duration-slow': '5s ease-in-out infinite hoppy-bob',
    'transition-all': 'all 0.15s',
    'transition-none': 'none',
    'transition-transform': 'transform 0.15s',
    'transition-color': 'color 0.15s',
    'transition-transform-bg': 'transform 0.15s, background 0.15s',
    'transition-transform-shadow': 'transform 0.15s, box-shadow 0.15s',
  },
} as const;
