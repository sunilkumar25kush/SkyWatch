import { ViewStyle, Platform } from 'react-native';

/**
 * SkyWatch Elevation & Shadow Design System
 * 
 * Supports both modern Web ("boxShadow") and Native ("shadow*" / "elevation").
 * 
 * Tokens:
 * - shadow-sm: rgba(0, 0, 0, 0.08) 0px 2px 12px 0px
 * - shadow-md: rgba(240, 136, 44, 0.35) 0px 4px 16px 0px
 * - shadow-lg: rgba(28, 28, 28, 0.35) 0px 32px 64px -20px, rgba(28, 28, 28, 0.12) 0px 8px 24px 0px
 */
export const Elevation = {
  // Low elevation for subtle cards and surfaces
  shadowSm: Platform.select({
    web: {
      boxShadow: '0px 2px 12px 0px rgba(0, 0, 0, 0.08)',
    } as any,
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 2,
    },
  }) as ViewStyle,

  // Medium elevation with warm orange accent glow
  shadowMd: Platform.select({
    web: {
      boxShadow: '0px 4px 16px 0px rgba(240, 136, 44, 0.35)',
    } as any,
    default: {
      shadowColor: 'rgb(240, 136, 44)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 6,
    },
  }) as ViewStyle,

  // High elevation for floating sheets, dialogs, and modals
  shadowLg: Platform.select({
    web: {
      boxShadow: '0px 32px 64px -20px rgba(28, 28, 28, 0.35), 0px 8px 24px 0px rgba(28, 28, 28, 0.12)',
    } as any,
    default: {
      shadowColor: '#1C1C1C',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.35,
      shadowRadius: 32,
      elevation: 12,
    },
  }) as ViewStyle,

  // Direct token strings (CSS / Web / Design tokens)
  tokens: {
    'shadow-sm': '0px 2px 12px 0px rgba(0, 0, 0, 0.08)',
    'shadow-md': '0px 4px 16px 0px rgba(240, 136, 44, 0.35)',
    'shadow-lg': '0px 32px 64px -20px rgba(28, 28, 28, 0.35), 0px 8px 24px 0px rgba(28, 28, 28, 0.12)',
  },
} as const;

export const Shadows = Elevation;
