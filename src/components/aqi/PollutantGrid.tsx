import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../common/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { getPollutantThresholds } from '../../utils/aqiUtils';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Feather } from '@expo/vector-icons';


export const PollutantGrid: React.FC = () => {
  const { airPollution } = useWeather();

  const components = airPollution?.list?.[0]?.components;
  const pollutants = getPollutantThresholds(components);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Feather name="layers" size={15} color={Colors.orange600} />
        <Text style={styles.sectionTitle}>Particulate & gas concentrations</Text>
      </View>

      <View style={styles.grid}>
        {pollutants.map((p) => (
          <GlassCard key={p.code} style={styles.tile}>
            <View style={styles.tileTop}>
              <Text style={styles.pollutantCode}>{p.code}</Text>
              <View
                style={[
                  styles.statusTag,
                  { backgroundColor: `${p.statusColor}22`, borderColor: `${p.statusColor}66` },
                ]}
              >
                <Text style={[styles.statusTagText, { color: p.statusColor }]}>
                  {p.status}
                </Text>
              </View>
            </View>

            <Text style={styles.pollutantName} numberOfLines={1}>
              {p.name}
            </Text>

            <View style={styles.valueRow}>
              <Text style={styles.valueNumber}>{p.value}</Text>
              <Text style={styles.valueUnit}>{p.unit}</Text>
            </View>

            <View style={styles.thresholdTrack}>
              <View
                style={[
                  styles.thresholdBar,
                  {
                    width: `${Math.min(100, Math.max(8, (p.value / (p.safeLimit * 2.5)) * 100))}%`,
                    backgroundColor: p.statusColor,
                  },
                ]}
              />
            </View>
          </GlassCard>
        ))}
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
    gap: 7,
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
    gap: Spacing.space2,
  },
  tile: {
    flex: 1,
    minWidth: '47%',
  },

  tileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pollutantCode: {
    ...Typography.textBaseBold,
    color: Colors.textPrimary,
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusTagText: {
    ...Typography.textXsBold,
  },
  pollutantName: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  valueNumber: {
    ...Typography.textXlBold,
    color: Colors.textPrimary,
  },
  valueUnit: {
    ...Typography.textXs,
    color: Colors.textSecondary,
  },
  thresholdTrack: {
    height: 4,
    backgroundColor: 'rgba(28, 28, 28, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  thresholdBar: {
    height: '100%',
    borderRadius: 2,
  },
});

