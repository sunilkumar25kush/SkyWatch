import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ForecastItem } from '../../types/weather';
import { WeatherIcon } from '../../utils/weatherIcons';
import { formatTemp, formatHourlyTime } from '../../utils/formatters';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export const HourlyForecastList: React.FC = () => {
  const { forecast } = useWeather();
  const { unitSystem } = useSettings();

  if (!forecast || !forecast.list || forecast.list.length === 0) return null;

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

        {popPercent > 10 ? (
          <View style={styles.popBadge}>
            <MaterialCommunityIcons name="water" size={10} color={Colors.green700} />
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
        <Feather name="clock" size={15} color={Colors.orange600} />
        <Text style={styles.sectionTitle}>Hourly atmospheric timeline</Text>
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
    marginBottom: Spacing.space8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginHorizontal: Spacing.space8,
    marginBottom: Spacing.space2,
  },
  sectionTitle: {
    ...Typography.textXsBold,
    letterSpacing: 1.5,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: Spacing.space8,
    gap: Spacing.space2,
  },
  cardItem: {
    width: 76,
    paddingVertical: Spacing.space5,
    alignItems: 'center',
    borderRadius: Shapes.radiusSm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nowCardItem: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.orange500,
  },
  timeText: {
    ...Typography.textXsMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.space1,
  },
  nowText: {
    color: Colors.orange700,
    fontWeight: '700',
  },
  iconContainer: {
    marginVertical: 4,
    height: 32,
    justifyContent: 'center',
  },
  tempText: {
    ...Typography.textBaseBold,
    color: Colors.textPrimary,
    marginTop: 6,
  },
  popBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Shapes.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 6,
  },
  popText: {
    ...Typography.textXsBold,
    color: Colors.green700,
  },
  popSpacer: {
    height: 18,
    marginTop: 6,
  },
});


