import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../common/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import {
  formatWindSpeed,
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

  // Approximate dew point in Celsius: T - ((100 - RH) / 5)
  const dewPointCelsius = Math.round(main.temp - (100 - main.humidity) / 5);
  const dewPointDisplay =
    unitSystem === 'metric'
      ? `${dewPointCelsius}°C`
      : `${Math.round((dewPointCelsius * 9) / 5 + 32)}°F`;

  const windCardinal = getWindDirectionCardinal(wind.deg);
  const windFormatted = formatWindSpeed(wind.speed, unitSystem);
  const pressureFormatted = formatPressure(main.pressure, unitSystem);
  const visibilityFormatted = formatDistance(visibility, unitSystem);

  const getHumidityStatus = (humidity: number): string => {
    if (humidity < 30) return 'Dry';
    if (humidity <= 60) return 'Comfortable';
    if (humidity <= 80) return 'Humid';
    return 'Very Humid';
  };

  const getPressureStatus = (pressure: number): string => {
    if (pressure > 1018) return 'High Pressure (Clear)';
    if (pressure < 1008) return 'Low Pressure (Stormy)';
    return 'Normal Atmospheric';
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Feather name="activity" size={15} color="#38BDF8" />
        <Text style={styles.sectionTitle}>ATMOSPHERIC TELEMETRY</Text>
      </View>

      <View style={styles.grid}>
        {/* Wind Vector Tile */}
        <GlassCard style={styles.tile}>
          <View style={styles.tileHeader}>
            <MaterialCommunityIcons name="weather-windy" size={18} color="#38BDF8" />
            <Text style={styles.tileTitle}>WIND</Text>
          </View>
          <Text style={styles.tileValue}>{windFormatted}</Text>
          <View style={styles.windSubRow}>
            <View
              style={[
                styles.compassArrow,
                { transform: [{ rotate: `${wind.deg}deg` }] },
              ]}
            >
              <MaterialCommunityIcons name="navigation" size={14} color="#38BDF8" />
            </View>
            <Text style={styles.tileSubtitle}>
              {windCardinal} ({wind.deg}°)
            </Text>
          </View>
          {wind.gust ? (
            <Text style={styles.tileNotice}>
              Gusts up to {formatWindSpeed(wind.gust, unitSystem)}
            </Text>
          ) : null}
        </GlassCard>

        {/* Barometric Pressure Tile */}
        <GlassCard style={styles.tile}>
          <View style={styles.tileHeader}>
            <MaterialCommunityIcons name="gauge" size={18} color="#818CF8" />
            <Text style={styles.tileTitle}>PRESSURE</Text>
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
            <MaterialCommunityIcons name="water-percent" size={18} color="#06B6D4" />
            <Text style={styles.tileTitle}>HUMIDITY</Text>
          </View>
          <Text style={styles.tileValue}>{main.humidity}%</Text>
          <Text style={styles.tileSubtitle}>{getHumidityStatus(main.humidity)}</Text>
          <Text style={styles.tileNotice}>Dew point: {dewPointDisplay}</Text>
        </GlassCard>

        {/* Visibility Tile */}
        <GlassCard style={styles.tile}>
          <View style={styles.tileHeader}>
            <Feather name="eye" size={16} color="#10B981" />
            <Text style={styles.tileTitle}>VISIBILITY</Text>
          </View>
          <Text style={styles.tileValue}>{visibilityFormatted}</Text>
          <Text style={styles.tileSubtitle}>
            {visibility >= 9000 ? 'Clear Horizons' : 'Reduced Visibility'}
          </Text>
          <Text style={styles.tileNotice}>Cloud Cover: {clouds.all}%</Text>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#94A3B8',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    flex: 1,
    minWidth: '47%',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
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
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  tileNotice: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
});
