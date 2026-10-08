import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
        return ['rgba(30, 41, 59, 0.85)', 'rgba(15, 23, 42, 0.9)'];
      case 'accent':
        return ['rgba(49, 46, 129, 0.5)', 'rgba(17, 24, 39, 0.85)'];
      case 'subtle':
        return ['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)'];
      case 'default':
      default:
        return ['rgba(26, 36, 56, 0.75)', 'rgba(13, 20, 36, 0.85)'];
    }
  };

  return (
    <View style={[styles.outerContainer, style]}>
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientInner: {
    padding: 18,
    borderRadius: 20,
  },
  noPadding: {
    padding: 0,
  },
});
