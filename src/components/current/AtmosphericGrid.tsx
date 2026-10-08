import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../common/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import {
  getWindSpeedDisplay,
  getWindDirectionCardinal,
  formatPressure,
  formatDistance,
} from '../../utils/formatters';

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export const AtmosphericGrid: React.FC = () => {
  const { currentWeather } = useWeather();
  const { unitSystem } = useSettings();

  if (!currentWeather) return null;

  const { main, wind, clouds, visibility } = currentWeather;

  const dewPointCelsius = Math.round(main.temp - (100 - main.humidity) / 5);
  const dewPointDisplay =
    unitSystem === 'metric'
      ? `${dewPointCelsius}°C`
      : `${Math.round((dewPointCelsius * 9) / 5 + 32)}°F`;

  const windCardinal = getWindDirectionCardinal(wind.deg);
  const windInfo = getWindSpeedDisplay(wind.speed, unitSystem);
  const gustInfo = wind.gust ? getWindSpeedDisplay(wind.gust, unitSystem) : null;
  const pressureFormatted = formatPressure(main.pressure, unitSystem);
  const visibilityFormatted = formatDistance(visibility, unitSystem);

  const getHumidityStatus = (humidity: number): string => {
    if (humidity < 30) return 'Dry Atmosphere';
    if (humidity <= 60) return 'Optimal Comfort';
    if (humidity <= 80) return 'Elevated Humidity';
    return 'Very Humid';
  };

  const getPressureStatus = (pressure: number): string => {
    if (pressure > 1018) return 'High Pressure (Clear)';
    if (pressure < 1008) return 'Low Pressure (Stormy)';
    return 'Balanced Atmospheric';
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Feather name="activity" size={15} color={Colors.orange600} />
        <Text style={styles.sectionTitle}>Atmospheric telemetry</Text>
      </View>

      <View style={styles.grid}>
        {/* Wind Vector Tile */}
        <GlassCard style={styles.tile}>
          <View style={styles.tileHeader}>
            <MaterialCommunityIcons name="weather-windy" size={18} color={Colors.orange600} />
            <Text style={styles.tileTitle}>Wind</Text>
          </View>
          <Text style={styles.tileValue}>{windInfo.primary}</Text>
          <View style={styles.windSubRow}>
            <View
              style={[
                styles.compassArrow,
                { transform: [{ rotate: `${wind.deg}deg` }] },
              ]}
            >
              <MaterialCommunityIcons name="navigation" size={14} color={Colors.orange600} />
            </View>
            <Text style={styles.tileSubtitle}>
              {windCardinal} ({wind.deg}°) • {windInfo.secondary}
            </Text>
          </View>
          {gustInfo ? (
            <Text style={styles.tileNotice}>
              Gusts: {gustInfo.primary} ({gustInfo.secondary})
            </Text>
          ) : null}
        </GlassCard>


        {/* Barometric Pressure Tile */}
        <GlassCard style={styles.tile}>
          <View style={styles.tileHeader}>
            <MaterialCommunityIcons name="gauge" size={18} color={Colors.olive600} />
            <Text style={styles.tileTitle}>Pressure</Text>
          </View>
          <Text style={styles.tileValue}>{pressureFormatted}</Text>
          <Text style={styles.tileSubtitle}>{getPressureStatus(main.pressure)}</Text>
          {main.sea_level && (
            <Text style={styles.tileNotice}>Sea-level: {main.sea_level} hPa</Text>
          )}
        </GlassCard>

        {/* Humidity & Dew Point Tile */}
        <GlassCard style={styles.tile}>
          <View style={styles.tileHeader}>
            <MaterialCommunityIcons name="water-percent" size={18} color={Colors.green600} />
            <Text style={styles.tileTitle}>Humidity</Text>
          </View>
          <Text style={styles.tileValue}>{main.humidity}%</Text>
          <Text style={styles.tileSubtitle}>{getHumidityStatus(main.humidity)}</Text>
          <Text style={styles.tileNotice}>Dew point: {dewPointDisplay}</Text>
        </GlassCard>

        {/* Visibility Tile */}
        <GlassCard style={styles.tile}>
          <View style={styles.tileHeader}>
            <Feather name="eye" size={16} color={Colors.green700} />
            <Text style={styles.tileTitle}>Visibility</Text>
          </View>
          <Text style={styles.tileValue}>{visibilityFormatted}</Text>
          <Text style={styles.tileSubtitle}>
            {visibility >= 9000 ? 'Clear horizons' : 'Reduced visibility'}
          </Text>
          <Text style={styles.tileNotice}>Cloud cover: {clouds.all}%</Text>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.space8,
    marginBottom: Spacing.space8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    marginBottom: Spacing.space2,
  },
  sectionTitle: {
    ...Typography.textXsBold,
    letterSpacing: 1.5,
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.space4,
  },
  tile: {
    flex: 1,
    minWidth: '47%',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.space1,
  },

  tileTitle: {
    ...Typography.textXsBold,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  tileValue: {
    ...Typography.textXlBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  windSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  compassArrow: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileSubtitle: {
    ...Typography.textXsMedium,
    color: Colors.textSecondary,
  },
  tileNotice: {
    ...Typography.textXs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});

