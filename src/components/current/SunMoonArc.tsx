import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GlassCard } from '../common/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { formatTime, getSunlightProgress } from '../../utils/formatters';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export const SunMoonArc: React.FC = () => {
  const { currentWeather } = useWeather();

  if (!currentWeather) return null;

  const { sys, timezone } = currentWeather;
  const { progress, isDaylight, daylightHours } = getSunlightProgress(
    sys.sunrise,
    sys.sunset
  );

  const sunriseFormatted = formatTime(sys.sunrise, timezone);
  const sunsetFormatted = formatTime(sys.sunset, timezone);

  // SVG Arc Dimensions
  const width = 300;
  const height = 90;
  // Semi-ellipse arc from (20, 80) to (280, 80) with control curve peaking at y = 15
  // Point along arc using parametric angle theta: 0 (sunrise) to PI (sunset)
  const theta = Math.PI * (1 - progress);
  const cx = 150;
  const rx = 130;
  const ry = 65;
  const sunX = cx + rx * Math.cos(theta);
  const sunY = 80 - ry * Math.sin(theta);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="sun" size={16} color="#FBBF24" />
          <Text style={styles.headerTitle}>CELESTIAL CYCLE</Text>
        </View>
        <Text style={styles.daylightText}>Daylight: {daylightHours}</Text>
      </View>

      <View style={styles.svgContainer}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#F59E0B" stopOpacity="0.3" />
              <Stop offset="0.5" stopColor="#FBBF24" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#F97316" stopOpacity="0.3" />
            </LinearGradient>
          </Defs>

          {/* Background Horizon Line */}
          <Path
            d="M 10 80 L 290 80"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1.5"
            strokeDasharray="4, 4"
          />

          {/* Celestial Arc */}
          <Path
            d="M 20 80 Q 150 10 280 80"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2.5"
          />

          {/* Current Sun Position */}
          {isDaylight ? (
            <>
              {/* Outer Glow */}
              <Circle
                cx={sunX}
                cy={sunY}
                r="10"
                fill="rgba(251, 191, 36, 0.25)"
              />
              {/* Sun Core */}
              <Circle
                cx={sunX}
                cy={sunY}
                r="6"
                fill="#FBBF24"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </>
          ) : (
            /* Night Indicator */
            <Circle
              cx="150"
              cy="80"
              r="5"
              fill="#818CF8"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          )}
        </Svg>
      </View>

      {/* Sunrise & Sunset Row */}
      <View style={styles.timeLabelsRow}>
        <View style={styles.timeCol}>
          <View style={styles.timeIconRow}>
            <MaterialCommunityIcons name="weather-sunset-up" size={16} color="#FBBF24" />
            <Text style={styles.timeType}>Sunrise</Text>
          </View>
          <Text style={styles.timeValue}>{sunriseFormatted}</Text>
        </View>

        <View style={styles.centerStatus}>
          <Text style={styles.statusLabel}>
            {isDaylight ? 'Sun Above Horizon' : 'Night Hours'}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round(progress * 100)}% cycle
          </Text>
        </View>

        <View style={[styles.timeCol, styles.alignRight]}>
          <View style={[styles.timeIconRow, styles.justifyRight]}>
            <Text style={styles.timeType}>Sunset</Text>
            <MaterialCommunityIcons name="weather-sunset-down" size={16} color="#F97316" />
          </View>
          <Text style={styles.timeValue}>{sunsetFormatted}</Text>
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
    marginBottom: 10,
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
  daylightText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FBBF24',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timeCol: {
    flex: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  timeIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  justifyRight: {
    justifyContent: 'flex-end',
  },
  timeType: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  centerStatus: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    marginTop: 2,
  },
});
