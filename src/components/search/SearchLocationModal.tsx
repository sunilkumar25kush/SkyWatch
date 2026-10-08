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
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { weatherApi } from '../../api/openWeatherApi';
import { GeocodingResult, SavedLocation } from '../../types/weather';
import { POPULAR_LOCATIONS } from '../../api/mockData';
import { StorageService } from '../../utils/storage';

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
            <Ionicons name="navigate" size={18} color="#38BDF8" />
          </View>
          <View style={styles.gpsTextBox}>
            <Text style={styles.gpsTitle}>Use Current Location</Text>
            <Text style={styles.gpsSubtitle}>Detect coordinates via GPS</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Results / Suggestions */}
        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color="#38BDF8" />
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
                    <Ionicons name="location-outline" size={20} color="#38BDF8" />
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
                      color={saved ? '#F59E0B' : '#64748B'}
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
                <Text style={styles.sectionHeader}>RECENT SEARCHES</Text>
                <View style={styles.pillsRow}>
                  {recentSearches.map((rec, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.pill}
                      onPress={() => handleSelectRecent(rec)}
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
              <Text style={styles.sectionHeader}>POPULAR HUBS</Text>
              <View style={styles.popularGrid}>
                {POPULAR_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    style={styles.popularCard}
                    onPress={() => handleSelectSaved(loc)}
                    activeOpacity={0.7}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 6,
  },
  cancelText: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '600',
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  gpsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gpsTextBox: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  gpsSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  loaderBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(26, 36, 56, 0.6)',
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#F1F5F9',
  },
  resultSub: {
    fontSize: 12,
    color: '#94A3B8',
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
    color: '#94A3B8',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#64748B',
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pillText: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(26, 36, 56, 0.7)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
    color: '#FFFFFF',
  },
  popularCountry: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularCoords: {
    fontSize: 11,
    color: '#64748B',
  },
});
