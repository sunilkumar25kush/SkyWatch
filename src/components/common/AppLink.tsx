import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { color } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface AppLinkProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  underline?: boolean;
  accessibilityLabel?: string;
}

/**
 * AppLink: Interactive navigation & action link element conforming to design rules:
 * - Interactive states: default, hover, focus-visible, active, disabled
 * - Tokens: Spacing, Typography, Color tokens
 * - Sentence case text formatting
 */
export const AppLink: React.FC<AppLinkProps> = ({
  label,
  onPress,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  underline = false,
  accessibilityLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getTextColor = (pressed: boolean): string => {
    if (disabled) return color.text.light;
    if (pressed) return color.accent.orange600;
    if (isHovered) return color.accent.orange500;
    return color.accent.orange700;
  };

  const formattedLabel =
    label.length > 0
      ? label.charAt(0).toUpperCase() + label.slice(1)
      : label;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={({ pressed }) => [
        styles.base,
        isFocused && styles.focusRing,
        pressed && styles.pressed,
        style,
      ]}
    >
      {leftIcon}
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(false),
            textDecorationLine: underline || isHovered ? 'underline' : 'none',
          },
          textStyle,
        ]}
      >
        {formattedLabel}
      </Text>
      {rightIcon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    paddingVertical: Spacing.space1,
    paddingHorizontal: Spacing.space2,
    borderRadius: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'color 0.15s, opacity 0.15s',
      } as any,
    }),
  },
  text: {
    ...Typography.textSmMedium,
  },
  focusRing: {
    borderWidth: 1,
    borderColor: color.accent.orange500,
  },
  pressed: {
    opacity: 0.7,
  },
});
