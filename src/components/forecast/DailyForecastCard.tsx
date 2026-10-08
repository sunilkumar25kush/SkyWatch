import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../common/GlassCard';
import { WeatherIcon } from '../../utils/weatherIcons';
import { formatDayName, formatTemp } from '../../utils/formatters';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ForecastItem } from '../../types/weather';

interface DaySummary {
  dayName: string;
  dateKey: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  condition: string;
  maxPop: number;
}

export const DailyForecastCard: React.FC = () => {
  const { forecast } = useWeather();
  const { unitSystem } = useSettings();

  if (!forecast || !forecast.list || forecast.list.length === 0) return null;

  const tz = forecast.city.timezone;

  // Group forecast items by calendar day
  const groupedByDay: { [key: string]: ForecastItem[] } = {};
  forecast.list.forEach((item) => {
    const localDate = new Date((item.dt + tz) * 1000);
    const dayKey = localDate.toISOString().split('T')[0];
    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = [];
    }
    groupedByDay[dayKey].push(item);
  });

  const dayKeys = Object.keys(groupedByDay).slice(0, 5);

  const days: DaySummary[] = dayKeys.map((key, index) => {
    const items = groupedByDay[key];
    const temps = items.map((i) => i.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const midItem = items[Math.floor(items.length / 2)] || items[0];
    const maxPop = Math.max(...items.map((i) => i.pop || 0));

    let dayName = formatDayName(midItem.dt, tz);
    if (index === 0) dayName = 'Today';
    if (index === 1) dayName = 'Tomorrow';

    return {
      dayName,
      dateKey: key,
      minTemp: Math.round(minTemp),
      maxTemp: Math.round(maxTemp),
      icon: midItem.weather[0]?.icon || '01d',
      condition: midItem.weather[0]?.main || 'Clear',
      maxPop: Math.round(maxPop * 100),
    };
  });

  // Calculate overall min/max across all 5 days for the relative bar
  const globalMin = Math.min(...days.map((d) => d.minTemp));
  const globalMax = Math.max(...days.map((d) => d.maxTemp));
  const globalSpan = Math.max(1, globalMax - globalMin);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="calendar" size={16} color="#38BDF8" />
          <Text style={styles.headerTitle}>5-DAY OUTLOOK & TEMPERATURE RANGE</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {days.map((day, idx) => {
          // Relative position of day's min/max within the global span (0% to 100%)
          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.minTemp - globalMin) / globalSpan) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((globalMax - day.maxTemp) / globalSpan) * 100)
          );

          return (
            <View key={day.dateKey} style={styles.dayRow}>
              {/* Day Name */}
              <View style={styles.dayNameCol}>
                <Text
                  style={[
                    styles.dayNameText,
                    idx === 0 && styles.todayNameText,
                  ]}
                >
                  {day.dayName}
                </Text>
              </View>

              {/* Weather Icon & Rain % */}
              <View style={styles.iconCol}>
                <WeatherIcon
                  iconCode={day.icon}
                  condition={day.condition}
                  size={24}
                />
                {day.maxPop > 15 ? (
                  <View style={styles.rainBadge}>
                    <MaterialCommunityIcons name="water" size={10} color="#38BDF8" />
                    <Text style={styles.rainText}>{day.maxPop}%</Text>
                  </View>
                ) : null}
              </View>

              {/* Low Temp */}
              <Text style={styles.tempMinText}>
                {formatTemp(day.minTemp, unitSystem)}
              </Text>

              {/* Relative Range Bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      marginLeft: `${leftPercent}%`,
                      marginRight: `${rightPercent}%`,
                    },
                  ]}
                />
              </View>

              {/* High Temp */}
              <Text style={styles.tempMaxText}>
                {formatTemp(day.maxTemp, unitSystem)}
              </Text>
            </View>
          );
        })}
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
    alignItems: 'center',
    marginBottom: 14,
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
  listContainer: {
    gap: 12,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayNameCol: {
    width: 80,
  },
  dayNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  todayNameText: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  iconCol: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rainText: {
    fontSize: 9,
    color: '#38BDF8',
    fontWeight: '700',
  },
  tempMinText: {
    width: 38,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  tempMaxText: {
    width: 38,
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'left',
  },
});
