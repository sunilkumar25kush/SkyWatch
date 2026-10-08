import React, { useEffect, useState } from 'react';
import { Animated, Easing, ViewStyle, StyleProp, Platform } from 'react-native';
import { Motion } from '../../theme/motion';

interface HoppyBobProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  amplitude?: number; // default bob displacement in px
  disabled?: boolean;
}

/**
 * HoppyBob: Implements the '5s ease-in-out infinite hoppy-bob' motion token.
 * Provides a gentle, physics-inspired hovering float animation.
 */
export const HoppyBob: React.FC<HoppyBobProps> = ({
  children,
  style,
  amplitude = 6,
  disabled = false,
}) => {
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (disabled) return;

    const halfDuration = Motion.durationSlowMs / 2; // 2500ms each way = 5s total
    const isNative = Platform.OS !== 'web';

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -amplitude,
          duration: halfDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: isNative,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: halfDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: isNative,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [translateY, amplitude, disabled]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
