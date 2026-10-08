import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../common/GlassCard';
import { WeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

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
            {weather.main.toUpperCase()}
          </Text>
        </View>

        <View style={styles.coordPill}>
          <Feather name="crosshair" size={11} color="#64748B" />
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
          <View style={styles.iconCircle}>
            <WeatherIcon
              iconCode={weather.icon}
              condition={weather.main}
              size={64}
            />
          </View>
        </View>
      </View>

      {/* Rain/Snow Advisory Alert if active */}
      {(hasRain || hasSnow) && (
        <View style={styles.precipitationAlert}>
          <MaterialCommunityIcons
            name={hasSnow ? 'weather-snowy-heavy' : 'weather-pouring'}
            size={18}
            color="#38BDF8"
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
          <MaterialCommunityIcons name="arrow-up" size={16} color="#F43F5E" />
          <Text style={styles.rangeLabel}>High</Text>
          <Text style={styles.rangeValue}>{tempMax}</Text>
        </View>

        <View style={styles.rangeDivider} />

        <View style={styles.rangeItem}>
          <MaterialCommunityIcons name="arrow-down" size={16} color="#38BDF8" />
          <Text style={styles.rangeLabel}>Low</Text>
          <Text style={styles.rangeValue}>{tempMin}</Text>
        </View>

        <View style={styles.rangeDivider} />

        <View style={styles.rangeItem}>
          <MaterialCommunityIcons name="water-percent" size={16} color="#A78BFA" />
          <Text style={styles.rangeLabel}>Humidity</Text>
          <Text style={styles.rangeValue}>{main.humidity}%</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  conditionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  conditionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  coordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  coordText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tempLeft: {
    flex: 1,
  },
  tempNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    lineHeight: 64,
  },
  weatherDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 6,
  },
  feelsLikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feelsLikeLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  feelsLikeValue: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  tempRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  precipitationAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.3)',
  },
  precipitationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7DD3FC',
    flex: 1,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.07)',
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  rangeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  rangeDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
