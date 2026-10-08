import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { GlassCard } from '../common/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatHourlyTime } from '../../utils/formatters';
import { Feather } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 76; // Card margins + padding
const CHART_HEIGHT = 120;

export const TempTrendChart: React.FC = () => {
  const { forecast } = useWeather();
  const { unitSystem } = useSettings();

  if (!forecast || !forecast.list || forecast.list.length === 0) return null;

  // Use 8 time intervals (~24 hours) for the graph
  const dataPoints = forecast.list.slice(0, 8);
  const tz = forecast.city.timezone;

  const temps = dataPoints.map((item) => item.main.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  // Compute (x, y) coordinates for each point
  const paddingX = 24;
  const paddingY = 24;
  const graphWidth = CHART_WIDTH - paddingX * 2;
  const graphHeight = CHART_HEIGHT - paddingY * 2;

  const points = dataPoints.map((item, index) => {
    const x = paddingX + (index / (dataPoints.length - 1)) * graphWidth;
    const y =
      paddingY +
      graphHeight -
      ((item.main.temp - minTemp) / tempRange) * graphHeight;
    return {
      x,
      y,
      temp: Math.round(item.main.temp),
      time: formatHourlyTime(item.dt, tz),
      pop: Math.round(item.pop * 100),
    };
  });

  // Construct smooth bezier curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  // Construct area fill path closing at the bottom
  const fillD = `${pathD} L ${points[points.length - 1].x} ${CHART_HEIGHT} L ${points[0].x} ${CHART_HEIGHT} Z`;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="trending-up" size={16} color="#38BDF8" />
          <Text style={styles.headerTitle}>24-HOUR THERMAL CURVE</Text>
        </View>
        <Text style={styles.unitBadge}>
          {unitSystem === 'metric' ? '°C' : '°F'} Range: {Math.round(minTemp)}° - {Math.round(maxTemp)}°
        </Text>
      </View>

      <View style={styles.chartWrapper}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#38BDF8" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#38BDF8" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Area Fill */}
          <Path d={fillD} fill="url(#tempGradient)" />

          {/* Curve Line */}
          <Path
            d={pathD}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Points & Labels */}
          {points.map((p, idx) => (
            <React.Fragment key={idx}>
              <Circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#0B0F19"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <SvgText
                x={p.x}
                y={p.y - 10}
                fontSize="11"
                fontWeight="700"
                fill="#FFFFFF"
                textAnchor="middle"
              >
                {`${p.temp}°`}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </View>

      {/* X-axis timestamps */}
      <View style={styles.xAxisRow}>
        {points.map((p, idx) => (
          <Text key={idx} style={styles.xAxisLabel}>
            {p.time}
          </Text>
        ))}
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
    marginBottom: 12,
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
  unitBadge: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
});
