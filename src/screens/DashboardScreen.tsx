import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Header } from '../components/common/Header';
import { CurrentWeatherHero } from '../components/current/CurrentWeatherHero';
import { AtmosphericGrid } from '../components/current/AtmosphericGrid';
import { SunMoonArc } from '../components/current/SunMoonArc';
import { HourlyForecastList } from '../components/forecast/HourlyForecastList';
import { TempTrendChart } from '../components/forecast/TempTrendChart';
import { DailyForecastCard } from '../components/forecast/DailyForecastCard';
import { RadialAqiGauge } from '../components/aqi/RadialAqiGauge';
import { PollutantGrid } from '../components/aqi/PollutantGrid';
import { SearchLocationModal } from '../components/search/SearchLocationModal';
import { WeatherRadarModal } from '../components/map/WeatherRadarModal';
import { SettingsModal } from '../components/settings/SettingsModal';
import { useWeather } from '../context/WeatherContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Shapes } from '../theme/shapes';
import { Spacing } from '../theme/spacing';
import { Elevation } from '../theme/elevation';
import { Feather, Ionicons } from '@expo/vector-icons';

export const DashboardScreen: React.FC = () => {
  const {
    loading,
    refreshing,
    refreshData,
    locationPermissionDenied,
    detectGpsLocation,
    error,
  } = useWeather();

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCream} translucent />

      {/* Top Header */}
      <Header
        onOpenSearch={() => setSearchModalVisible(true)}
        onOpenMap={() => setMapModalVisible(true)}
        onOpenSettings={() => setSettingsModalVisible(true)}
      />

      {/* GPS Location Explanation Banner (PRD Section 8) */}
      {locationPermissionDenied && (
        <View style={styles.permissionBanner}>
          <Ionicons name="location-outline" size={18} color={Colors.orange700} />
          <View style={styles.permissionTextBox}>
            <Text style={styles.permissionTitle}>GPS Permission Needed</Text>
            <Text style={styles.permissionSubtitle}>
              Grant location access to receive localized telemetry for your exact coordinates.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.enableGpsBtn}
            onPress={detectGpsLocation}
          >
            <Text style={styles.enableGpsText}>Enable</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Warning/Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Feather name="info" size={16} color={Colors.orange700} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.orange600} />
          <Text style={styles.loadingText}>Synchronizing Atmospheric Telemetry...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshData}
              tintColor={Colors.orange600}
              colors={[Colors.orange600]}
            />
          }
        >
          {/* Section 4: Current Weather Hero */}
          <CurrentWeatherHero />

          {/* Section 5: Hourly Forecast Timeline */}
          <HourlyForecastList />

          {/* Section 5: Temperature Trend Curve */}
          <TempTrendChart />

          {/* Section 5: 5-Day Outlook */}
          <DailyForecastCard />

          {/* Section 6: Radial AQI Gauge */}
          <RadialAqiGauge />

          {/* Section 6: Particulate & Gas Concentrations */}
          <PollutantGrid />

          {/* Section 4.1: Detailed Atmospheric Telemetry Grid */}
          <AtmosphericGrid />

          {/* Section 4.1: Celestial Sun & Moon Arc */}
          <SunMoonArc />

          {/* Footer branding */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              SkyWatch weather intelligence • OpenWeather pro telemetry
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Modals */}
      <SearchLocationModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
      />

      <WeatherRadarModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const ANDROID_STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 36) : 0;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgCream,
    paddingTop: ANDROID_STATUS_BAR_HEIGHT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.space12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.space6,
  },
  loadingText: {
    ...Typography.textSmSemiBold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: Spacing.space8,
    marginBottom: Spacing.space1,
    padding: Spacing.space4,
    borderRadius: Shapes.radiusSm,
    borderWidth: 1,
    borderColor: Colors.orange500,
    gap: Spacing.space2,
    ...Elevation.shadowSm,
  },
  permissionTextBox: {
    flex: 1,
  },
  permissionTitle: {
    ...Typography.textXsBold,
    color: Colors.orange700,
  },
  permissionSubtitle: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  enableGpsBtn: {
    backgroundColor: Colors.orange600,
    paddingHorizontal: Spacing.space4,
    paddingVertical: 6,
    borderRadius: Shapes.radiusSm,
    ...Elevation.shadowMd,
  },
  enableGpsText: {
    ...Typography.textXsBold,
    color: '#FFFFFF',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: Spacing.space8,
    marginBottom: Spacing.space1,
    padding: Spacing.space2,
    borderRadius: Shapes.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.shadowSm,
  },

  errorText: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.space6,
    paddingBottom: Spacing.space9,
  },
  footerText: {
    ...Typography.textXsBold,
    letterSpacing: 1.5,
    color: Colors.textMuted,
  },
});

