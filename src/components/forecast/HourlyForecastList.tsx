import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ForecastItem } from '../../types/weather';
import { WeatherIcon } from '../../utils/weatherIcons';
import { formatTemp, formatHourlyTime } from '../../utils/formatters';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export const HourlyForecastList: React.FC = () => {
  const { forecast } = useWeather();
  const { unitSystem } = useSettings();

  if (!forecast || !forecast.list || forecast.list.length === 0) return null;

  // Take the first 12 forecast intervals (~36 hours)
  const items = forecast.list.slice(0, 12);
  const tz = forecast.city.timezone;

  const renderItem = ({ item, index }: { item: ForecastItem; index: number }) => {
    const isNow = index === 0;
    const timeLabel = isNow ? 'Now' : formatHourlyTime(item.dt, tz);
    const tempLabel = formatTemp(item.main.temp, unitSystem);
    const condition = item.weather[0] || { main: 'Clear', icon: '01d' };
    const popPercent = Math.round(item.pop * 100);

    return (
      <View style={[styles.cardItem, isNow && styles.nowCardItem]}>
        <Text style={[styles.timeText, isNow && styles.nowText]}>
          {timeLabel}
        </Text>

        <View style={styles.iconContainer}>
          <WeatherIcon
            iconCode={condition.icon}
            condition={condition.main}
            size={28}
          />
        </View>

        <Text style={styles.tempText}>{tempLabel}</Text>

        {/* Rain probability pill */}
        {popPercent > 10 ? (
          <View style={styles.popBadge}>
            <MaterialCommunityIcons name="water" size={10} color="#38BDF8" />
            <Text style={styles.popText}>{popPercent}%</Text>
          </View>
        ) : (
          <View style={styles.popSpacer} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Feather name="clock" size={15} color="#38BDF8" />
        <Text style={styles.sectionTitle}>HOURLY ATMOSPHERIC TIMELINE</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#94A3B8',
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  cardItem: {
    width: 76,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(26, 36, 56, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  nowCardItem: {
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
  },
  nowText: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  iconContainer: {
    marginVertical: 4,
    height: 32,
    justifyContent: 'center',
  },
  tempText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
  },
  popBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  popText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  popSpacer: {
    height: 18,
    marginTop: 6,
  },
});
