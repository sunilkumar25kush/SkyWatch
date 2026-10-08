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
  Platform,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '../../context/SettingsContext';
import { useWeather } from '../../context/WeatherContext';
import { GlassCard } from '../common/GlassCard';
import { SavedLocation } from '../../types/weather';
import { Colors } from '../../theme/colors';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';

import { Elevation } from '../../theme/elevation';

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
          <TouchableOpacity
            style={[styles.closeBtn, Elevation.shadowSm]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close Settings"
          >
            <Feather name="x" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings & intelligence</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Unit System Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unit measurement system</Text>
            <View style={styles.unitsRow}>
              <TouchableOpacity
                style={[
                  styles.unitPill,
                  unitSystem === 'metric' && styles.unitPillActive,
                  unitSystem === 'metric' && Elevation.shadowMd,
                ]}
                onPress={() => setUnitSystem('metric')}
                accessibilityRole="button"
                accessibilityLabel="Select Metric units"
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
                  unitSystem === 'imperial' && Elevation.shadowMd,
                ]}
                onPress={() => setUnitSystem('imperial')}
                accessibilityRole="button"
                accessibilityLabel="Select Imperial units"
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
            <Text style={styles.sectionTitle}>OpenWeather API key</Text>
            <GlassCard style={styles.apiKeyCard}>
              <Text style={styles.apiKeyHint}>
                Supply your own OpenWeather API Key for live uncapped radar tiles and real-time station data. If blank, SkyWatch runs in sandbox demo telemetry mode.
              </Text>

              <View style={styles.keyInputRow}>
                <TextInput
                  style={styles.keyInput}
                  placeholder="Paste OpenWeather API Key..."
                  placeholderTextColor={Colors.textMuted}
                  value={inputKey}
                  onChangeText={setInputKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={[styles.saveKeyBtn, Elevation.shadowMd]}
                  onPress={handleSaveApiKey}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Save API Key"
                >
                  <Text style={styles.saveKeyBtnText}>Save</Text>
                </TouchableOpacity>
              </View>

              {saveSuccess && (
                <View style={styles.saveSuccessBanner}>
                  <Feather name="check-circle" size={14} color={Colors.green600} />
                  <Text style={styles.saveSuccessText}>API key successfully saved!</Text>
                </View>
              )}
            </GlassCard>
          </View>

          {/* Saved Locations Registry */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved locations registry</Text>
            {savedLocations.length === 0 ? (
              <Text style={styles.emptyLocationsText}>
                No saved locations yet. Star cities from the search modal to add them here.
              </Text>
            ) : (
              <View style={styles.savedLocationsList}>
                {savedLocations.map((loc) => (
                  <View
                    key={loc.id}
                    style={[styles.savedLocationItem, Elevation.shadowSm]}
                  >
                    <TouchableOpacity
                      style={styles.savedItemLeft}
                      onPress={() => handleSelectSavedCity(loc)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`Select location ${loc.name}`}
                    >
                      <Ionicons name="location-sharp" size={18} color={Colors.orange600} />
                      <View>
                        <Text style={styles.savedCityName}>{loc.name}</Text>
                        <Text style={styles.savedCityCoords}>
                          {[loc.state, loc.country].filter(Boolean).join(', ')} • {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteCityBtn}
                      onPress={() => removeLocation(loc.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete saved location ${loc.name}`}
                    >
                      <Feather name="trash-2" size={18} color={Colors.orange700} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* App Telemetry Info */}
          <View style={styles.appInfoBox}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={28} color={Colors.orange600} />
            <Text style={styles.appName}>SkyWatch Intelligence v1.0.0</Text>
            <Text style={styles.packageName}>Package: com.sunilkumar.SkyWatch</Text>
            <Text style={styles.authorBadge}>Engineered for Android Mobile Platform</Text>
          </View>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.space6,
    paddingVertical: Spacing.space5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: Shapes.radiusFull,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.space8,
    paddingTop: Spacing.space8,
    paddingBottom: 40,
  },
  section: {
    marginBottom: Spacing.space9,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textSecondary,
    marginBottom: Spacing.space2,
  },
  unitsRow: {
    flexDirection: 'row',
    gap: Spacing.space2,
  },
  unitPill: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.space5,
    borderRadius: Shapes.radiusSm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  unitPillActive: {
    backgroundColor: Colors.orange500,
    borderColor: Colors.orange600,
  },
  unitPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  unitPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  apiKeyCard: {
    padding: Spacing.space6,
  },
  apiKeyHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.space4,
  },
  keyInputRow: {
    flexDirection: 'row',
    gap: Spacing.space2,
  },
  keyInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: Shapes.radiusSm,
    paddingHorizontal: Spacing.space4,
    color: Colors.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveKeyBtn: {
    backgroundColor: Colors.orange600,
    borderRadius: Shapes.radiusSm,
    paddingHorizontal: Spacing.space7,
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
    gap: Spacing.space1,
    marginTop: Spacing.space2,
  },
  saveSuccessText: {
    fontSize: 12,
    color: Colors.green600,
    fontWeight: '600',
  },
  emptyLocationsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  savedLocationsList: {
    gap: Spacing.space1,
  },
  savedLocationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.space5,
    backgroundColor: Colors.surface,
    borderRadius: Shapes.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  savedCityCoords: {
    fontSize: 11,
    color: Colors.textSecondary,
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
    color: Colors.textPrimary,
    marginTop: 6,
  },
  packageName: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  authorBadge: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
});

