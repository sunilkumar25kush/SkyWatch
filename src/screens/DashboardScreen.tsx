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
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Top Header */}
      <Header
        onOpenSearch={() => setSearchModalVisible(true)}
        onOpenMap={() => setMapModalVisible(true)}
        onOpenSettings={() => setSettingsModalVisible(true)}
      />

      {/* GPS Location Explanation Banner (PRD Section 8) */}
      {locationPermissionDenied && (
        <View style={styles.permissionBanner}>
          <Ionicons name="location-outline" size={18} color="#F59E0B" />
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
          <Feather name="info" size={16} color="#38BDF8" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
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
              tintColor="#38BDF8"
              colors={['#38BDF8']}
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
              SKYWATCH WEATHER INTELLIGENCE • OPENWEATHER PRO TELEMETRY
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 10,
  },
  permissionTextBox: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  permissionSubtitle: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
  },
  enableGpsBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  enableGpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  errorText: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#475569',
  },
});
