import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';

import { Elevation } from '../../theme/elevation';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'accent' | 'subtle';
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  noPadding = false,
}) => {
  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'elevated':
        return ['#ECEAC9', '#E5E2BE'];
      case 'accent':
        return ['#EDEBCB', '#E8DFB5'];
      case 'subtle':
        return ['rgba(236, 234, 201, 0.75)', 'rgba(236, 234, 201, 0.95)'];
      case 'default':
      default:
        return ['#ECEAC9', '#E7E4BE'];
    }
  };

  const shadowStyle = variant === 'accent' ? Elevation.shadowMd : Elevation.shadowSm;

  return (
    <View style={[styles.outerContainer, shadowStyle, style]}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientInner, noPadding && styles.noPadding]}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: Shapes.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gradientInner: {
    padding: Spacing.space7,
    borderRadius: Shapes.radiusSm,
  },
  noPadding: {
    padding: 0,
  },
});

