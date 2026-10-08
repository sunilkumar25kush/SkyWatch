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
import { color, Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';
import { Elevation } from '../../theme/elevation';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle';
export type ButtonShape = 'pill' | 'rounded';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
}

/**
 * AppButton: Multi-state interactive button conforming to design rules:
 * - Interactive states: default, hover, focus-visible, active (pressed), disabled
 * - Tokens: Elevation (shadow-md for primary, shadow-sm for secondary), Shapes, Spacing, Color tokens
 * - Typography: Sentence case, system weights
 */
export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  shape = 'pill',
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  accessibilityLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Border radius strictly pinned to detected set (16px, 999px)
  const borderRadius = shape === 'pill' ? Shapes.radiusFull : Shapes.radiusSm;

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    // 1. Base style by variant
    let base: ViewStyle = {
      borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.space4,
      paddingHorizontal: Spacing.space8,
      gap: Spacing.space2,
      borderWidth: 1,
      borderColor: 'transparent',
    };

    if (variant === 'primary') {
      base = {
        ...base,
        backgroundColor: Colors.orange500,
        ...Elevation.shadowMd,
      };
    } else if (variant === 'secondary') {
      base = {
        ...base,
        backgroundColor: Colors.surface,
        borderColor: Colors.border,
        ...Elevation.shadowSm,
      };
    } else {
      // subtle
      base = {
        ...base,
        backgroundColor: 'transparent',
      };
    }

    // 2. Interactive state: Disabled
    if (disabled) {
      return {
        ...base,
        opacity: 0.45,
        ...(Platform.OS === 'web'
          ? ({ boxShadow: 'none' } as any)
          : { shadowOpacity: 0, elevation: 0 }),
      };
    }

    // 3. Interactive state: Active (Pressed)
    if (pressed) {
      return {
        ...base,
        transform: [{ scale: 0.97 }],
        opacity: 0.88,
      };
    }

    // 4. Interactive state: Focus-visible (Focus ring)
    if (isFocused) {
      return {
        ...base,
        borderColor: Colors.orange600,
        borderWidth: 2,
      };
    }

    // 5. Interactive state: Hover
    if (isHovered) {
      if (variant === 'primary') {
        return {
          ...base,
          backgroundColor: Colors.orange600,
          transform: [{ scale: 1.02 }],
        };
      } else if (variant === 'secondary') {
        return {
          ...base,
          backgroundColor: Colors.surfaceElevated,
          transform: [{ scale: 1.02 }],
        };
      } else {
        return {
          ...base,
          backgroundColor: 'rgba(236, 234, 201, 0.4)',
        };
      }
    }

    // Default state
    return base;
  };

  const getLabelColor = (): string => {
    if (disabled) {
      return color.text.muted;
    }
    if (variant === 'primary') {
      return '#FFFFFF';
    }
    return color.text.primary;
  };

  // Enforce sentence case on label
  const formattedLabel =
    label.length > 0
      ? label.charAt(0).toUpperCase() + label.slice(1)
      : label;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled }}
      // Pointer hover events
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      // Focus-visible events
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={({ pressed }) => [
        styles.base,
        getContainerStyle(pressed),
        style,
      ]}
    >
      {leftIcon}
      <Text
        style={[
          styles.labelText,
          { color: getLabelColor() },
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
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.15s, background-color 0.15s, box-shadow 0.15s',
      } as any,
    }),
  },
  labelText: {
    ...Typography.textSmSemiBold,
  },
});
