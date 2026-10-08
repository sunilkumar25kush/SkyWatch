import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../common/GlassCard';
import { WeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { Colors } from '../../theme/colors';
import { Typography, FontWeights } from '../../theme/typography';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { HoppyBob } from '../common/HoppyBob';
import { Elevation } from '../../theme/elevation';

export const CurrentWeatherHero: React.FC = () => {
  const { currentWeather } = useWeather();
  const { unitSystem } = useSettings();

  if (!currentWeather) return null;

  const main = currentWeather.main;
  const weather = currentWeather.weather[0] || {
    main: 'Clear',
    description: 'clear sky',
    icon: '01d',
  };

  const temp = formatTemp(main.temp, unitSystem);
  const feelsLike = formatTemp(main.feels_like, unitSystem);
  const tempMin = formatTemp(main.temp_min, unitSystem);
  const tempMax = formatTemp(main.temp_max, unitSystem);

  const hasRain = currentWeather.rain && (currentWeather.rain['1h'] || currentWeather.rain['3h']);
  const hasSnow = currentWeather.snow && (currentWeather.snow['1h'] || currentWeather.snow['3h']);

  return (
    <GlassCard variant="elevated" style={styles.card}>
      {/* Top status indicator row */}
      <View style={styles.topStatusRow}>
        <View style={styles.conditionPill}>
          <View style={styles.pulseDot} />
          <Text style={styles.conditionPillText}>
            {weather.main}
          </Text>
        </View>

        <View style={styles.coordPill}>
          <Feather name="crosshair" size={11} color={Colors.textSecondary} />
          <Text style={styles.coordText}>
            {currentWeather.coord.lat.toFixed(2)}°, {currentWeather.coord.lon.toFixed(2)}°
          </Text>
        </View>
      </View>

      {/* Main Temperature & Visuals Display */}
      <View style={styles.heroContent}>
        <View style={styles.tempLeft}>
          <Text style={styles.tempNumber}>{temp}</Text>
          <Text style={styles.weatherDescription}>
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </Text>
          <View style={styles.feelsLikeRow}>
            <Text style={styles.feelsLikeLabel}>Feels like</Text>
            <Text style={styles.feelsLikeValue}>{feelsLike}</Text>
          </View>
        </View>

        <View style={styles.tempRight}>
          <HoppyBob amplitude={6}>
            <View style={[styles.iconCircle, Elevation.shadowSm]}>
              <WeatherIcon
                iconCode={weather.icon}
                condition={weather.main}
                size={64}
              />
            </View>
          </HoppyBob>
        </View>
      </View>

      {/* Rain/Snow Advisory Alert if active */}
      {(hasRain || hasSnow) && (
        <View style={styles.precipitationAlert}>
          <MaterialCommunityIcons
            name={hasSnow ? 'weather-snowy-heavy' : 'weather-pouring'}
            size={18}
            color={Colors.orange700}
          />
          <Text style={styles.precipitationText}>
            {hasRain
              ? `Precipitation active: ${currentWeather.rain?.['1h'] || currentWeather.rain?.['3h']} mm recorded`
              : `Snowfall active: ${currentWeather.snow?.['1h'] || currentWeather.snow?.['3h']} mm recorded`}
          </Text>
        </View>
      )}

      {/* Bottom Range Bar: High & Low */}
      <View style={styles.rangeRow}>
        <View style={styles.rangeItem}>
          <MaterialCommunityIcons name="arrow-up" size={16} color={Colors.orange600} />
          <Text style={styles.rangeLabel}>High</Text>
          <Text style={styles.rangeValue}>{tempMax}</Text>
        </View>

        <View style={styles.rangeDivider} />

        <View style={styles.rangeItem}>
          <MaterialCommunityIcons name="arrow-down" size={16} color={Colors.green600} />
          <Text style={styles.rangeLabel}>Low</Text>
          <Text style={styles.rangeValue}>{tempMin}</Text>
        </View>

        <View style={styles.rangeDivider} />

        <View style={styles.rangeItem}>
          <MaterialCommunityIcons name="water-percent" size={16} color={Colors.olive600} />
          <Text style={styles.rangeLabel}>Humidity</Text>
          <Text style={styles.rangeValue}>{main.humidity}%</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.space8,
    marginTop: Spacing.space1,
    marginBottom: Spacing.space6,
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space5,
  },
  conditionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.space2,
    paddingVertical: Spacing.baseUnit,
    borderRadius: Shapes.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.orange600,
  },
  conditionPillText: {
    ...Typography.textXsBold,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  coordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(28, 28, 28, 0.04)',
    paddingHorizontal: Spacing.space1,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coordText: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semiBold,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space6,
  },
  tempLeft: {
    flex: 1,
  },
  tempNumber: {
    ...Typography.text3xlExtraBold,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
  },
  weatherDescription: {
    ...Typography.textBaseSemiBold,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  feelsLikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feelsLikeLabel: {
    ...Typography.textSmMedium,
    color: Colors.textSecondary,
  },
  feelsLikeValue: {
    ...Typography.textSmBold,
    color: Colors.textPrimary,
  },
  tempRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: Shapes.radiusFull,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  precipitationAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.space4,
    paddingVertical: Spacing.space1,
    borderRadius: Shapes.radiusSm,
    marginBottom: Spacing.space5,
    borderWidth: 1,
    borderColor: Colors.orange500,
  },
  precipitationText: {
    ...Typography.textXsMedium,
    color: Colors.orange700,
    flex: 1,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.space5,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rangeLabel: {
    ...Typography.textXsMedium,
    color: Colors.textSecondary,
  },
  rangeValue: {
    ...Typography.textSmBold,
    color: Colors.textPrimary,
  },
  rangeDivider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.border,
  },
});
