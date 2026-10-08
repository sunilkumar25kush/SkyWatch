import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';

import { Elevation } from '../../theme/elevation';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMap,
  onOpenSettings,
}) => {
  const { activeLocation, detectGpsLocation, loading } = useWeather();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color={Colors.orange600} />
          <Text style={styles.brandTitle}>SkyWatch</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>AI Intel</Text>
          </View>
        </View>

        <View style={styles.actionIconsRow}>
          <TouchableOpacity
            style={[styles.iconButton, Elevation.shadowSm]}
            onPress={onOpenMap}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open Weather Radar"
          >
            <Feather name="map" size={19} color={Colors.orange600} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, Elevation.shadowSm]}
            onPress={onOpenSearch}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Search Cities"
          >
            <Feather name="search" size={19} color={Colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, Elevation.shadowSm]}
            onPress={onOpenSettings}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
          >
            <Feather name="sliders" size={19} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Selector Bar - Non-nested structure */}
      <View style={[styles.locationSelector, Elevation.shadowSm]}>
        <TouchableOpacity
          style={styles.locationLeftPressable}
          onPress={onOpenSearch}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Select Location"
        >
          <Ionicons
            name={activeLocation.isCurrentLocation ? 'navigate' : 'location-sharp'}
            size={18}
            color={activeLocation.isCurrentLocation ? Colors.green700 : Colors.orange600}
          />
          <Text style={styles.cityName} numberOfLines={1}>
            {activeLocation.name}
          </Text>
          {activeLocation.country ? (
            <Text style={styles.countryBadge}>{activeLocation.country}</Text>
          ) : null}
          <Ionicons name="chevron-down" size={15} color={Colors.textSecondary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gpsSyncButton}
          onPress={detectGpsLocation}
          disabled={loading}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Detect GPS Location"
          accessibilityState={{ disabled: loading }}
        >
          <Ionicons
            name="locate"
            size={16}
            color={activeLocation.isCurrentLocation ? Colors.green700 : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.space8,
    paddingTop: Spacing.space4,
    paddingBottom: Spacing.space1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space4,
    minHeight: 44,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    flexShrink: 1,
  },
  brandTitle: {
    ...Typography.textLgBold,
    letterSpacing: 2.5,
    color: Colors.textPrimary,
  },
  proBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.orange500,
  },
  proText: {
    ...Typography.textXsBold,
    color: Colors.orange700,
    letterSpacing: 1,
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    flexShrink: 0,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Shapes.radiusSm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Shapes.radiusSm,
    paddingVertical: Spacing.space2,
    paddingHorizontal: Spacing.space5,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  locationLeftPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cityName: {
    ...Typography.textBaseBold,
    color: Colors.textPrimary,
    maxWidth: '70%',
  },
  countryBadge: {
    ...Typography.textXsBold,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  locationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpsSyncButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(28, 28, 28, 0.05)',
  },
});
