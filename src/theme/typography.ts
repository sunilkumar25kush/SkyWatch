import { TextStyle, Platform } from 'react-native';

/**
 * SkyWatch Typography Design System
 * 
 * Font stack: Poppins, Inter, Times New Roman
 * Weight scale: 400 · 500 · 600 · 700 · 800
 * Line heights: 80.2816px · 54.6px · 33px · 59.4084px · 29.45px · 22.5px · 19.5px · 21px · 24px · 27px · 15.6px · 18px
 */

export const FontStack = {
  primary: 'Poppins',
  secondary: 'Inter',
  serif: 'Times New Roman',
  cssFamily: 'Poppins, Inter, "Times New Roman", sans-serif',
};

export const FontWeights = {
  w400: '400' as const,
  w500: '500' as const,
  w600: '600' as const,
  w700: '700' as const,
  w800: '800' as const,
  // Semantic aliases
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const FontSizes = {
  xs: 12,    // text-xs: Captions, metadata
  sm: 14,    // text-sm: Labels, secondary text
  base: 16,  // text-base: Body text (default)
  lg: 18,    // text-lg: Subheadings, emphasis
  xl: 22,    // text-xl: Section headings
  '2xl': 52, // text-2xl: Section headings / Display
  '3xl': 61, // text-3xl: Section headings / Hero Temp
  '4xl': 82, // text-4xl: Section headings / Maximum Hero
} as const;

export const LineHeights = {
  lh15_6: 15.6,
  lh18: 18,
  lh19_5: 19.5,
  lh21: 21,
  lh22_5: 22.5,
  lh24: 24,
  lh27: 27,
  lh29_45: 29.45,
  lh33: 33,
  lh54_6: 54.6,
  lh59_41: 59.4084,
  lh80_28: 80.2816,
} as const;

// Helper to resolve font family with weights cross-platform
const getFontFamily = (weight: keyof typeof FontWeights, family: 'poppins' | 'inter' | 'serif' = 'poppins') => {
  if (family === 'serif') {
    return Platform.select({
      web: '"Times New Roman", Times, Georgia, serif',
      ios: 'Times New Roman',
      android: 'serif',
      default: 'serif',
    });
  }

  if (family === 'inter') {
    return Platform.select({
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      android: weight === 'w800' || weight === 'extraBold'
        ? 'Inter_800ExtraBold'
        : weight === 'w700' || weight === 'bold'
        ? 'Inter_700Bold'
        : weight === 'w600' || weight === 'semiBold'
        ? 'Inter_600SemiBold'
        : weight === 'w500' || weight === 'medium'
        ? 'Inter_500Medium'
        : 'Inter_400Regular',
      ios: 'Inter',
      default: 'Inter',
    });
  }

  return Platform.select({
    web: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    android: weight === 'w800' || weight === 'extraBold'
      ? 'Poppins_800ExtraBold'
      : weight === 'w700' || weight === 'bold'
      ? 'Poppins_700Bold'
      : weight === 'w600' || weight === 'semiBold'
      ? 'Poppins_600SemiBold'
      : weight === 'w500' || weight === 'medium'
      ? 'Poppins_500Medium'
      : 'Poppins_400Regular',
    ios: 'Poppins',
    default: 'Poppins',
  });
};

export const Typography = {
  // text-xs (12px) - Captions, metadata
  textXs: {
    fontFamily: getFontFamily('w400'),
    fontSize: FontSizes.xs,
    lineHeight: LineHeights.lh15_6,
    fontWeight: FontWeights.w400,
  } as TextStyle,
  textXsMedium: {
    fontFamily: getFontFamily('w500'),
    fontSize: FontSizes.xs,
    lineHeight: LineHeights.lh15_6,
    fontWeight: FontWeights.w500,
  } as TextStyle,
  textXsBold: {
    fontFamily: getFontFamily('w700'),
    fontSize: FontSizes.xs,
    lineHeight: LineHeights.lh18,
    fontWeight: FontWeights.w700,
  } as TextStyle,

  // text-sm (14px) - Labels, secondary text
  textSm: {
    fontFamily: getFontFamily('w400'),
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.lh18,
    fontWeight: FontWeights.w400,
  } as TextStyle,
  textSmMedium: {
    fontFamily: getFontFamily('w500'),
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.lh19_5,
    fontWeight: FontWeights.w500,
  } as TextStyle,
  textSmSemiBold: {
    fontFamily: getFontFamily('w600'),
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.lh19_5,
    fontWeight: FontWeights.w600,
  } as TextStyle,
  textSmBold: {
    fontFamily: getFontFamily('w700'),
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.lh21,
    fontWeight: FontWeights.w700,
  } as TextStyle,

  // text-base (16px) - Body text (default)
  textBase: {
    fontFamily: getFontFamily('w400'),
    fontSize: FontSizes.base,
    lineHeight: LineHeights.lh22_5,
    fontWeight: FontWeights.w400,
  } as TextStyle,
  textBaseMedium: {
    fontFamily: getFontFamily('w500'),
    fontSize: FontSizes.base,
    lineHeight: LineHeights.lh22_5,
    fontWeight: FontWeights.w500,
  } as TextStyle,
  textBaseSemiBold: {
    fontFamily: getFontFamily('w600'),
    fontSize: FontSizes.base,
    lineHeight: LineHeights.lh24,
    fontWeight: FontWeights.w600,
  } as TextStyle,
  textBaseBold: {
    fontFamily: getFontFamily('w700'),
    fontSize: FontSizes.base,
    lineHeight: LineHeights.lh24,
    fontWeight: FontWeights.w700,
  } as TextStyle,

  // text-lg (18px) - Subheadings, emphasis
  textLg: {
    fontFamily: getFontFamily('w400'),
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lh24,
    fontWeight: FontWeights.w400,
  } as TextStyle,
  textLgMedium: {
    fontFamily: getFontFamily('w500'),
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lh24,
    fontWeight: FontWeights.w500,
  } as TextStyle,
  textLgSemiBold: {
    fontFamily: getFontFamily('w600'),
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lh27,
    fontWeight: FontWeights.w600,
  } as TextStyle,
  textLgBold: {
    fontFamily: getFontFamily('w700'),
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lh27,
    fontWeight: FontWeights.w700,
  } as TextStyle,

  // text-xl (22px) - Section headings
  textXl: {
    fontFamily: getFontFamily('w600'),
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.lh29_45,
    fontWeight: FontWeights.w600,
  } as TextStyle,
  textXlBold: {
    fontFamily: getFontFamily('w700'),
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.lh33,
    fontWeight: FontWeights.w700,
  } as TextStyle,
  textXlExtraBold: {
    fontFamily: getFontFamily('w800'),
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.lh33,
    fontWeight: FontWeights.w800,
  } as TextStyle,

  // text-2xl (52px) - Section headings / Large Display
  text2xl: {
    fontFamily: getFontFamily('w700'),
    fontSize: FontSizes['2xl'],
    lineHeight: LineHeights.lh54_6,
    fontWeight: FontWeights.w700,
  } as TextStyle,
  text2xlExtraBold: {
    fontFamily: getFontFamily('w800'),
    fontSize: FontSizes['2xl'],
    lineHeight: LineHeights.lh59_41,
    fontWeight: FontWeights.w800,
  } as TextStyle,

  // text-3xl (61px) - Section headings / Large Hero
  text3xl: {
    fontFamily: getFontFamily('w700'),
    fontSize: FontSizes['3xl'],
    lineHeight: LineHeights.lh59_41,
    fontWeight: FontWeights.w700,
  } as TextStyle,
  text3xlExtraBold: {
    fontFamily: getFontFamily('w800'),
    fontSize: FontSizes['3xl'],
    lineHeight: LineHeights.lh80_28,
    fontWeight: FontWeights.w800,
  } as TextStyle,

  // text-4xl (82px) - Section headings / Maximum Hero Display
  text4xl: {
    fontFamily: getFontFamily('w800'),
    fontSize: FontSizes['4xl'],
    lineHeight: LineHeights.lh80_28,
    fontWeight: FontWeights.w800,
  } as TextStyle,
};
