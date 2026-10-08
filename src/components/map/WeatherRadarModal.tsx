import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { MapLayerType } from '../../types/weather';

interface WeatherRadarModalProps {
  visible: boolean;
  onClose: () => void;
}

interface LayerOption {
  id: MapLayerType;
  label: string;
  icon: string;
  legend: string;
}

const LAYERS: LayerOption[] = [
  {
    id: 'precipitation_new',
    label: 'Precipitation',
    icon: 'weather-pouring',
    legend: 'Light (0.1 mm) → Extreme (>50 mm/h)',
  },
  {
    id: 'temp_new',
    label: 'Temperature',
    icon: 'thermometer',
    legend: 'Freezing (-40°C) → Scorching (+40°C)',
  },
  {
    id: 'clouds_new',
    label: 'Cloud Cover',
    icon: 'weather-cloudy',
    legend: 'Clear (0%) → Overcast (100%)',
  },
  {
    id: 'wind_new',
    label: 'Wind Velocity',
    icon: 'weather-windy',
    legend: 'Calm (0 m/s) → Gale (>30 m/s)',
  },
  {
    id: 'pressure_new',
    label: 'Sea Pressure',
    icon: 'gauge',
    legend: 'Low (950 hPa) → High (1070 hPa)',
  },
];

export const WeatherRadarModal: React.FC<WeatherRadarModalProps> = ({
  visible,
  onClose,
}) => {
  const { activeLocation } = useWeather();
  const { apiKey } = useSettings();
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('precipitation_new');
  const webViewRef = useRef<WebView>(null);

  const keyToUse = apiKey || '439d4b804bc8187953eb36d2a8c26a02'; // Fallback key for demo tiles

  // Generate Leaflet Dark Map HTML
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #0B0F19; }
          .leaflet-control-attribution { display: none !important; }
          .leaflet-bar { border: none !important; box-shadow: none !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: false,
            center: [${activeLocation.lat}, ${activeLocation.lon}],
            zoom: 6
          });

          // Dark Carto Base Map
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          // Current Weather Overlay Layer
          var weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${keyToUse}', {
            opacity: 0.75,
            maxZoom: 18
          }).addTo(map);

          // Marker for Active City
          var marker = L.circleMarker([${activeLocation.lat}, ${activeLocation.lon}], {
            radius: 8,
            fillColor: '#38BDF8',
            color: '#FFFFFF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(map);

          // Bridge calls from React Native
          window.changeWeatherLayer = function(newLayer) {
            map.removeLayer(weatherLayer);
            weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/' + newLayer + '/{z}/{x}/{y}.png?appid=${keyToUse}', {
              opacity: 0.75,
              maxZoom: 18
            }).addTo(map);
          };

          window.zoomIn = function() { map.zoomIn(); };
          window.zoomOut = function() { map.zoomOut(); };
          window.resetCenter = function() {
            map.setView([${activeLocation.lat}, ${activeLocation.lon}], 6);
          };
        </script>
      </body>
    </html>
  `;

  const handleSelectLayer = (layer: MapLayerType) => {
    setActiveLayer(layer);
    webViewRef.current?.injectJavaScript(`window.changeWeatherLayer('${layer}'); true;`);
  };

  const handleZoomIn = () => {
    webViewRef.current?.injectJavaScript(`window.zoomIn(); true;`);
  };

  const handleZoomOut = () => {
    webViewRef.current?.injectJavaScript(`window.zoomOut(); true;`);
  };

  const handleResetLocation = () => {
    webViewRef.current?.injectJavaScript(`window.resetCenter(); true;`);
  };

  const currentLayerInfo = LAYERS.find((l) => l.id === activeLayer) || LAYERS[0];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="chevron-down" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.locationTitleBox}>
            <Text style={styles.radarTitle}>ATMOSPHERIC RADAR</Text>
            <Text style={styles.locationSubText}>
              {activeLocation.name}, {activeLocation.country}
            </Text>
          </View>

          <View style={styles.badgeLive}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>RADAR LIVE</Text>
          </View>
        </View>

        {/* Map View with Floating Controls */}
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: leafletHtml }}
            style={styles.webView}
            scrollEnabled={false}
          />

          {/* Floating Map Controls on the Right (PRD Section 9) */}
          <View style={styles.floatingControls}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleResetLocation}
              activeOpacity={0.7}
            >
              <Ionicons name="locate" size={20} color="#38BDF8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleZoomIn}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleZoomOut}
              activeOpacity={0.7}
            >
              <Feather name="minus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Dynamic Scale / Legend Bar */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>{currentLayerInfo.label} Scale</Text>
            <Text style={styles.legendText}>{currentLayerInfo.legend}</Text>
          </View>
        </View>

        {/* Bottom Horizontal Layer Picker (PRD Section 9) */}
        <View style={styles.bottomLayerSelector}>
          <Text style={styles.layerSelectorTitle}>RADAR LAYERS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.layerScroll}
          >
            {LAYERS.map((layer) => {
              const isSelected = layer.id === activeLayer;
              return (
                <TouchableOpacity
                  key={layer.id}
                  style={[
                    styles.layerPill,
                    isSelected && styles.layerPillSelected,
                  ]}
                  onPress={() => handleSelectLayer(layer.id)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={layer.icon as any}
                    size={18}
                    color={isSelected ? '#38BDF8' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.layerPillText,
                      isSelected && styles.layerPillTextSelected,
                    ]}
                  >
                    {layer.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTitleBox: {
    alignItems: 'center',
  },
  radarTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#F8FAFC',
  },
  locationSubText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  floatingControls: {
    position: 'absolute',
    right: 16,
    top: 20,
    gap: 10,
  },
  floatingBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  legendContainer: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  legendText: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 2,
  },
  bottomLayerSelector: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  layerSelectorTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#64748B',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  layerScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  layerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  layerPillSelected: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    borderColor: '#38BDF8',
  },
  layerPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  layerPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
