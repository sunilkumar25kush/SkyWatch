import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '../../context/SettingsContext';
import { useWeather } from '../../context/WeatherContext';
import { GlassCard } from '../common/GlassCard';
import { SavedLocation } from '../../types/weather';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    unitSystem,
    setUnitSystem,
    apiKey,
    updateApiKey,
    savedLocations,
    removeLocation,
  } = useSettings();
  const { selectLocation } = useWeather();

  const [inputKey, setInputKey] = useState(apiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveApiKey = async () => {
    await updateApiKey(inputKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSelectSavedCity = async (loc: SavedLocation) => {
    await selectLocation(loc);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SETTINGS & INTELLIGENCE</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Unit System Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UNIT MEASUREMENT SYSTEM</Text>
            <View style={styles.unitsRow}>
              <TouchableOpacity
                style={[
                  styles.unitPill,
                  unitSystem === 'metric' && styles.unitPillActive,
                ]}
                onPress={() => setUnitSystem('metric')}
              >
                <Text
                  style={[
                    styles.unitPillText,
                    unitSystem === 'metric' && styles.unitPillTextActive,
                  ]}
                >
                  Metric (°C, km/h, hPa)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitPill,
                  unitSystem === 'imperial' && styles.unitPillActive,
                ]}
                onPress={() => setUnitSystem('imperial')}
              >
                <Text
                  style={[
                    styles.unitPillText,
                    unitSystem === 'imperial' && styles.unitPillTextActive,
                  ]}
                >
                  Imperial (°F, mph, inHg)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* OpenWeather API Key Config */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OPENWEATHER API KEY</Text>
            <GlassCard style={styles.apiKeyCard}>
              <Text style={styles.apiKeyHint}>
                Supply your own OpenWeather API Key for live uncapped radar tiles and real-time station data. If blank, SkyWatch runs in sandbox demo telemetry mode.
              </Text>

              <View style={styles.keyInputRow}>
                <TextInput
                  style={styles.keyInput}
                  placeholder="Paste OpenWeather API Key..."
                  placeholderTextColor="#64748B"
                  value={inputKey}
                  onChangeText={setInputKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.saveKeyBtn}
                  onPress={handleSaveApiKey}
                >
                  <Text style={styles.saveKeyBtnText}>Save</Text>
                </TouchableOpacity>
              </View>

              {saveSuccess && (
                <View style={styles.saveSuccessBanner}>
                  <Feather name="check-circle" size={14} color="#10B981" />
                  <Text style={styles.saveSuccessText}>API key successfully saved!</Text>
                </View>
              )}
            </GlassCard>
          </View>

          {/* Saved Locations Registry */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SAVED LOCATIONS REGISTRY</Text>
            {savedLocations.length === 0 ? (
              <Text style={styles.emptyLocationsText}>
                No saved locations yet. Star cities from the search modal to add them here.
              </Text>
            ) : (
              <View style={styles.savedLocationsList}>
                {savedLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    style={styles.savedLocationItem}
                    onPress={() => handleSelectSavedCity(loc)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.savedItemLeft}>
                      <Ionicons name="location-sharp" size={18} color="#38BDF8" />
                      <View>
                        <Text style={styles.savedCityName}>{loc.name}</Text>
                        <Text style={styles.savedCityCoords}>
                          {[loc.state, loc.country].filter(Boolean).join(', ')} • {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteCityBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        removeLocation(loc.id);
                      }}
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* App Telemetry Info */}
          <View style={styles.appInfoBox}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={28} color="#38BDF8" />
            <Text style={styles.appName}>SkyWatch Intelligence v1.0.0</Text>
            <Text style={styles.packageName}>Package: com.sunilkumar.SkyWatch</Text>
            <Text style={styles.authorBadge}>Engineered for Android Mobile Platform</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#64748B',
    marginBottom: 10,
  },
  unitsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  unitPill: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  unitPillActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    borderColor: '#38BDF8',
  },
  unitPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  unitPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  apiKeyCard: {
    padding: 16,
  },
  apiKeyHint: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  keyInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  keyInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveKeyBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveKeyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  saveSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  saveSuccessText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  emptyLocationsText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
  savedLocationsList: {
    gap: 8,
  },
  savedLocationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(26, 36, 56, 0.7)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  savedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  savedCityName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  savedCityCoords: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  deleteCityBtn: {
    padding: 8,
  },
  appInfoBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 6,
  },
  packageName: {
    fontSize: 11,
    color: '#64748B',
  },
  authorBadge: {
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
  },
});
