import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GlassCard } from '../common/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { getAqiDetails } from '../../utils/aqiUtils';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export const RadialAqiGauge: React.FC = () => {
  const { airPollution } = useWeather();

  const currentAqi = airPollution?.list?.[0]?.main?.aqi ?? 2;
  const aqiInfo = getAqiDetails(currentAqi);

  // SVG Gauge geometry (240-degree sweep from -210° to 30°)
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Map AQI scale 1..5 to angle fraction 0..1
  // 1 -> 0.1, 2 -> 0.32, 3 -> 0.55, 4 -> 0.78, 5 -> 1.0
  const fraction = Math.min(1, Math.max(0.1, (currentAqi - 1) / 4 * 0.9 + 0.1));

  // Angles in radians: start at 150 deg (5pi/6), sweep 240 deg (4pi/3) to 390 deg (13pi/6)
  const startAngle = (150 * Math.PI) / 180;
  const sweepAngle = (240 * Math.PI) / 180;
  const endAngle = startAngle + sweepAngle;
  const activeEndAngle = startAngle + sweepAngle * fraction;

  // Polar to Cartesian
  const polarToCartesian = (cx: number, cy: number, r: number, angleInRad: number) => ({
    x: cx + r * Math.cos(angleInRad),
    y: cy + r * Math.sin(angleInRad),
  });

  const pStart = polarToCartesian(center, center, radius, startAngle);
  const pEnd = polarToCartesian(center, center, radius, endAngle);
  const pActiveEnd = polarToCartesian(center, center, radius, activeEndAngle);

  // Background track path
  const bgPath = `M ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 1 1 ${pEnd.x} ${pEnd.y}`;

  // Active arc path
  const largeArcFlag = fraction > 0.5 ? 1 : 0;
  const activePath = `M ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${pActiveEnd.x} ${pActiveEnd.y}`;

  return (
    <GlassCard variant="elevated" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="wind" size={16} color="#38BDF8" />
          <Text style={styles.headerTitle}>AIR QUALITY INTELLIGENCE</Text>
        </View>
        <View style={[styles.statusBadge, { borderColor: aqiInfo.color }]}>
          <Text style={[styles.statusBadgeText, { color: aqiInfo.color }]}>
            {aqiInfo.category.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Radial Gauge SVG */}
      <View style={styles.gaugeContainer}>
        <Svg width={size} height={size - 25} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#10B981" />
              <Stop offset="0.3" stopColor="#84CC16" />
              <Stop offset="0.6" stopColor="#F59E0B" />
              <Stop offset="0.8" stopColor="#F97316" />
              <Stop offset="1" stopColor="#EF4444" />
            </LinearGradient>
          </Defs>

          {/* Background Track */}
          <Path
            d={bgPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
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

          {/* Active Needle Point */}
          <Circle
            cx={pActiveEnd.x}
            cy={pActiveEnd.y}
            r={8}
            fill="#FFFFFF"
            stroke={aqiInfo.color}
            strokeWidth={3}
          />
        </Svg>

        {/* Center Readout inside the radial arc */}
        <View style={styles.centerReadout}>
          <Text style={styles.aqiScore}>{aqiInfo.approxUsAqi}</Text>
          <Text style={styles.aqiUnit}>AQI INDEX</Text>
          <Text style={[styles.aqiCategoryLabel, { color: aqiInfo.color }]}>
            {aqiInfo.category.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Human-readable Health Recommendation */}
      <View style={styles.recommendationBox}>
        <MaterialCommunityIcons
          name="shield-check-outline"
          size={18}
          color={aqiInfo.color}
        />
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
    marginHorizontal: 20,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  centerReadout: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 55,
  },
  aqiScore: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  aqiUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
  },
  aqiCategoryLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 1,
  },
  recommendationBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  recommendationTextCol: {
    flex: 1,
    gap: 3,
  },
  recDescription: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
    lineHeight: 16,
  },
  recAdvice: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    lineHeight: 15,
  },
});
