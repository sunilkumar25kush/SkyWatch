import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { weatherApi } from '../../api/openWeatherApi';
import { GeocodingResult, SavedLocation } from '../../types/weather';
import { POPULAR_LOCATIONS } from '../../api/mockData';
import { StorageService } from '../../utils/storage';
import { Colors } from '../../theme/colors';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';
import { Elevation } from '../../theme/elevation';


interface SearchLocationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SearchLocationModal: React.FC<SearchLocationModalProps> = ({
  visible,
  onClose,
}) => {
  const { selectLocation, detectGpsLocation } = useWeather();
  const { addLocation, removeLocation, isLocationSaved } = useSettings();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      StorageService.getRecentSearches().then(setRecentSearches);
    }
  }, [visible]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await weatherApi.searchLocations(trimmed, 6);
        setResults(data);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectGeocodingResult = async (item: GeocodingResult) => {
    Keyboard.dismiss();
    const id = `${item.name}_${item.country}_${item.lat.toFixed(2)}_${item.lon.toFixed(2)}`.toLowerCase();
    const loc: SavedLocation = {
      id,
      name: item.name,
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    };

    await StorageService.addRecentSearch(item.name);
    await selectLocation(loc);
    onClose();
  };

  const handleSelectSaved = async (loc: SavedLocation) => {
    Keyboard.dismiss();
    await selectLocation(loc);
    onClose();
  };

  const handleSelectRecent = (name: string) => {
    setQuery(name);
  };

  const handleGpsCurrent = async () => {
    const success = await detectGpsLocation();
    if (success) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header Search Input */}
        <View style={styles.searchHeader}>
          <View style={styles.inputWrapper}>
            <Feather name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.input}
              placeholder="Search city, state, or country..."
              placeholderTextColor="#64748B"
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (text.trim().length < 2) {
                  setResults([]);
                }
              }}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setQuery('');
                  setResults([]);
                }}
              >
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Current Location GPS Button */}
        <TouchableOpacity
          style={styles.gpsRow}
          onPress={handleGpsCurrent}
          activeOpacity={0.7}
        >
          <View style={styles.gpsIconCircle}>
            <Ionicons name="navigate" size={18} color={Colors.orange600} />
          </View>
          <View style={styles.gpsTextBox}>
            <Text style={styles.gpsTitle}>Use Current Location</Text>
            <Text style={styles.gpsSubtitle}>Detect coordinates via GPS</Text>
          </View>
          <Feather name="chevron-right" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Results / Suggestions */}
        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color={Colors.orange600} />
            <Text style={styles.loaderText}>Searching atmospheric registry...</Text>
          </View>
        ) : query.length >= 2 ? (
          <FlatList
            data={results}
            keyExtractor={(item, idx) => `${item.lat}_${item.lon}_${idx}`}
            contentContainerStyle={styles.resultsList}
            renderItem={({ item }) => {
              const id = `${item.name}_${item.country}_${item.lat.toFixed(2)}_${item.lon.toFixed(2)}`.toLowerCase();
              const saved = isLocationSaved(id);

              return (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleSelectGeocodingResult(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.resultLeft}>
                    <Ionicons name="location-outline" size={20} color={Colors.green600} />
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultName}>{item.name}</Text>
                      <Text style={styles.resultSub}>
                        {[item.state, item.country].filter(Boolean).join(', ')} • {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.saveIconBtn}
                    onPress={async (e) => {
                      e.stopPropagation();
                      const loc: SavedLocation = {
                        id,
                        name: item.name,
                        state: item.state,
                        country: item.country,
                        lat: item.lat,
                        lon: item.lon,
                      };
                      if (saved) {
                        await removeLocation(id);
                      } else {
                        await addLocation(loc);
                      }
                    }}
                  >
                    <Ionicons
                      name={saved ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={saved ? Colors.orange600 : Colors.textMuted}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Feather name="map-pin" size={32} color="#475569" />
                <Text style={styles.emptyTitle}>No matching cities</Text>
                <Text style={styles.emptySubtitle}>Try searching by city name or country</Text>
              </View>
            }
          />
        ) : (
          <View style={styles.suggestionsContainer}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Recent searches</Text>
                <View style={styles.pillsRow}>
                  {recentSearches.map((rec, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.pill, Elevation.shadowSm]}
                      onPress={() => handleSelectRecent(rec)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                    >
                      <Feather name="clock" size={12} color="#94A3B8" />
                      <Text style={styles.pillText}>{rec}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Global Hubs */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Popular hubs</Text>
              <View style={styles.popularGrid}>
                {POPULAR_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    style={[styles.popularCard, Elevation.shadowSm]}
                    onPress={() => handleSelectSaved(loc)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                  >
                    <View style={styles.popularCardTop}>
                      <Text style={styles.popularName}>{loc.name}</Text>
                      <Text style={styles.popularCountry}>{loc.country}</Text>
                    </View>
                    <Text style={styles.popularCoords}>
                      {loc.lat.toFixed(1)}°N, {loc.lon.toFixed(1)}°E
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const ANDROID_STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 36) : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCream,
    paddingTop: ANDROID_STATUS_BAR_HEIGHT,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.space6,
    paddingVertical: Spacing.space4,
    gap: Spacing.space4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Shapes.radiusSm,
    paddingHorizontal: Spacing.space5,
    height: 46,
    gap: Spacing.space2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 6,
  },
  cancelText: {
    color: Colors.orange700,
    fontSize: 15,
    fontWeight: '600',
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.space8,
    paddingVertical: Spacing.space5,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: Shapes.radiusFull,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.space4,
  },
  gpsTextBox: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gpsSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  loaderBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: Spacing.space4,
  },
  loaderText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  resultsList: {
    paddingHorizontal: Spacing.space6,
    paddingVertical: Spacing.space2,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.space5,
    paddingHorizontal: Spacing.space5,
    backgroundColor: Colors.surface,
    borderRadius: Shapes.radiusSm,
    marginBottom: Spacing.space1,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resultSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  saveIconBtn: {
    padding: 6,
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.space8,
    paddingTop: Spacing.space6,
  },
  section: {
    marginBottom: Spacing.space9,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.space2,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.space1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.space4,
    paddingVertical: Spacing.space1,
    borderRadius: Shapes.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.space2,
  },
  popularCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Shapes.radiusSm,
    padding: Spacing.space4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popularCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  popularName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  popularCountry: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popularCoords: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
