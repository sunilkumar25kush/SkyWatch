import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';

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
          <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#38BDF8" />
          <Text style={styles.brandTitle}>SKYWATCH</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>AI INTEL</Text>
          </View>
        </View>

        <View style={styles.actionIconsRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenMap}
            activeOpacity={0.7}
            accessibilityLabel="Open Weather Radar"
          >
            <Feather name="map" size={19} color="#38BDF8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenSearch}
            activeOpacity={0.7}
            accessibilityLabel="Search Cities"
          >
            <Feather name="search" size={19} color="#E2E8F0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenSettings}
            activeOpacity={0.7}
            accessibilityLabel="Open Settings"
          >
            <Feather name="sliders" size={19} color="#E2E8F0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Selector Bar */}
      <TouchableOpacity
        style={styles.locationSelector}
        onPress={onOpenSearch}
        activeOpacity={0.8}
      >
        <View style={styles.locationLeft}>
          <Ionicons
            name={activeLocation.isCurrentLocation ? 'navigate' : 'location-sharp'}
            size={18}
            color={activeLocation.isCurrentLocation ? '#38BDF8' : '#F59E0B'}
          />
          <Text style={styles.cityName} numberOfLines={1}>
            {activeLocation.name}
          </Text>
          {activeLocation.country ? (
            <Text style={styles.countryBadge}>{activeLocation.country}</Text>
          ) : null}
        </View>

        <View style={styles.locationRight}>
          <TouchableOpacity
            style={styles.gpsSyncButton}
            onPress={(e) => {
              e.stopPropagation();
              detectGpsLocation();
            }}
            disabled={loading}
          >
            <Ionicons
              name="locate"
              size={15}
              color={activeLocation.isCurrentLocation ? '#38BDF8' : '#94A3B8'}
            />
          </TouchableOpacity>
          <Ionicons name="chevron-down" size={16} color="#94A3B8" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#F8FAFC',
  },
  proBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  proText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 27, 46, 0.7)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9',
    maxWidth: '70%',
  },
  countryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  locationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpsSyncButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
