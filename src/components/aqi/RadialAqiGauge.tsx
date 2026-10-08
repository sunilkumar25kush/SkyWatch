import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { GlassCard } from '../common/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { getAqiDetails } from '../../utils/aqiUtils';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export const RadialAqiGauge: React.FC = () => {
  const { airPollution } = useWeather();

  const currentAqiTier = airPollution?.list?.[0]?.main?.aqi ?? 2;
  const components = airPollution?.list?.[0]?.components;
  const aqiInfo = getAqiDetails(currentAqiTier, components);

  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Fraction across 0 - 300+ scale for visual needle accuracy (1.0 at 300)
  const fraction = Math.min(1, Math.max(0.04, aqiInfo.aqiScore / 300));

  const startAngle = (150 * Math.PI) / 180;
  const sweepAngle = (240 * Math.PI) / 180;
  const endAngle = startAngle + sweepAngle;

  // Calculate active arc progression
  const currentSweep = sweepAngle * fraction;
  const activeEndAngle = startAngle + currentSweep;

  const polarToCartesian = (cx: number, cy: number, r: number, angleInRad: number) => ({
    x: cx + r * Math.cos(angleInRad),
    y: cy + r * Math.sin(angleInRad),
  });

  const pStart = polarToCartesian(center, center, radius, startAngle);
  const pEnd = polarToCartesian(center, center, radius, endAngle);
  const pActiveEnd = polarToCartesian(center, center, radius, activeEndAngle);

  // Background track (240° sweep > 180°, so largeArcFlag is always 1)
  const bgPath = `M ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 1 1 ${pEnd.x} ${pEnd.y}`;

  // Active colored track: largeArcFlag must be 1 ONLY when currentSweep > Math.PI (180°)
  const largeArcFlag = currentSweep > Math.PI ? 1 : 0;
  const activePath = `M ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${pActiveEnd.x} ${pActiveEnd.y}`;

  return (
    <GlassCard variant="elevated" style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="wind" size={16} color={Colors.orange600} />
          <Text style={styles.headerTitle}>Air quality intelligence</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { borderColor: `${aqiInfo.color}66`, backgroundColor: `${aqiInfo.color}15` },
          ]}
        >
          <Text style={[styles.statusBadgeText, { color: aqiInfo.color }]}>
            {aqiInfo.category}
          </Text>
        </View>
      </View>

      {/* Radial Gauge SVG */}
      <View style={styles.gaugeContainer}>
        <Svg width={size} height={180} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <Path
            d={bgPath}
            fill="none"
            stroke="rgba(28, 28, 28, 0.09)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <Path
            d={activePath}
            fill="none"
            stroke={aqiInfo.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Needle Point: Outer Ring */}
          <Circle
            cx={pActiveEnd.x}
            cy={pActiveEnd.y}
            r={9}
            fill="#FFFFFF"
            stroke={aqiInfo.color}
            strokeWidth={3.5}
          />

          {/* Active Needle Point: Inner Pip */}
          <Circle
            cx={pActiveEnd.x}
            cy={pActiveEnd.y}
            r={3}
            fill={aqiInfo.color}
          />
        </Svg>

        {/* Center Readout inside the radial arc */}
        <View style={styles.centerReadout}>
          <Text style={styles.aqiScore}>{aqiInfo.aqiScore}</Text>
          <Text style={styles.aqiUnit}>AQI index</Text>
          <Text style={[styles.aqiCategoryLabel, { color: aqiInfo.color }]}>
            {aqiInfo.category}
          </Text>
          <Text style={styles.dominantText}>
            Main: {aqiInfo.dominantPollutant} • Tier {aqiInfo.index}/5
          </Text>
        </View>
      </View>

      {/* Health Recommendation Box */}
      <View style={[styles.recommendationBox, { borderLeftColor: aqiInfo.color }]}>
        <View style={[styles.shieldCircle, { backgroundColor: `${aqiInfo.color}18` }]}>
          <MaterialCommunityIcons
            name="shield-alert-outline"
            size={20}
            color={aqiInfo.color}
          />
        </View>
        <View style={styles.recommendationTextCol}>
          <Text style={styles.recDescription}>{aqiInfo.description}</Text>
          <Text style={styles.recAdvice}>{aqiInfo.recommendation}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.space8,
    marginBottom: Spacing.space8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
  },
  headerTitle: {
    ...Typography.textXsBold,
    letterSpacing: 1.2,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.space4,
    paddingVertical: 4,
    borderRadius: Shapes.radiusFull,
    borderWidth: 1,
  },
  statusBadgeText: {
    ...Typography.textXsBold,
    letterSpacing: 0.5,
  },

  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: Spacing.space2,
    height: 180,
  },
  centerReadout: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 36,
  },
  aqiScore: {
    fontSize: 50,
    lineHeight: 52,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1.5,
  },
  aqiUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  aqiCategoryLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  dominantText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 3,
  },

  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.space4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Shapes.radiusSm,
    padding: Spacing.space4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
  },
  shieldCircle: {
    width: 36,
    height: 36,
    borderRadius: Shapes.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationTextCol: {
    flex: 1,
    gap: 4,
  },
  recDescription: {
    ...Typography.textXsBold,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  recAdvice: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
