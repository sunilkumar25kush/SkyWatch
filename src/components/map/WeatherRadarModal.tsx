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
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { MapLayerType } from '../../types/weather';
import { Colors } from '../../theme/colors';
import { Shapes } from '../../theme/shapes';
import { Spacing } from '../../theme/spacing';
import { Elevation } from '../../theme/elevation';


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

  const keyToUse =
    apiKey ||
    process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY?.trim() ||
    '439d4b804bc8187953eb36d2a8c26a02'; // Fallback key for demo tiles

  // Generate Leaflet Dark Map HTML
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #1C1C1C; }
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

          // Dark Base Map (Free, Clean, No Watermark)
          L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16
          }).addTo(map);

          // Current Weather Overlay Layer
          var weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${keyToUse}', {
            opacity: 0.75,
            maxZoom: 18
          }).addTo(map);

          // Marker for Active City
          var marker = L.circleMarker([${activeLocation.lat}, ${activeLocation.lon}], {
            radius: 8,
            fillColor: '#D9721A',
            color: '#FFFFFF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.95
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
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCream} />

        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.closeButton, Elevation.shadowSm]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close Radar"
          >
            <Feather name="chevron-down" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.locationTitleBox}>
            <Text style={styles.radarTitle}>Atmospheric radar</Text>
            <Text style={styles.locationSubText}>
              {activeLocation.name}, {activeLocation.country}
            </Text>
          </View>

          <View style={styles.badgeLive}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Radar live</Text>
          </View>
        </View>

        {/* Map View with Floating Controls */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              srcDoc={leafletHtml}
              style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#1C1C1C' }}
              title="Atmospheric Radar Map"
            />
          ) : (
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: leafletHtml }}
              style={styles.webView}
              scrollEnabled={false}
            />
          )}

          {/* Floating Map Controls on the Right (PRD Section 9) */}
          <View style={styles.floatingControls}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleResetLocation}
              activeOpacity={0.7}
            >
              <Ionicons name="locate" size={20} color={Colors.orange600} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleZoomIn}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={handleZoomOut}
              activeOpacity={0.7}
            >
              <Feather name="minus" size={20} color={Colors.textPrimary} />
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
          <Text style={styles.layerSelectorTitle}>Radar layers</Text>
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
                    isSelected ? [styles.layerPillSelected, Elevation.shadowSm] : null,
                  ]}
                  onPress={() => handleSelectLayer(layer.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Radar layer ${layer.label}`}
                >
                  <MaterialCommunityIcons
                    name={layer.icon as any}
                    size={18}
                    color={isSelected ? Colors.orange600 : Colors.textSecondary}
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

const ANDROID_STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 36) : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCream,
    paddingTop: ANDROID_STATUS_BAR_HEIGHT,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space6,
    paddingVertical: Spacing.space4,
    backgroundColor: Colors.bgCream,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: Shapes.radiusFull,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  locationTitleBox: {
    alignItems: 'center',
  },
  radarTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.textPrimary,
  },
  locationSubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(84, 165, 52, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(84, 165, 52, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green600,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.green600,
    letterSpacing: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  floatingControls: {
    position: 'absolute',
    right: Spacing.space6,
    top: Spacing.space8,
    gap: Spacing.space2,
  },
  floatingBtn: {
    width: 44,
    height: 44,
    borderRadius: Shapes.radiusFull,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.shadowSm,
  },
  legendContainer: {
    position: 'absolute',
    left: Spacing.space6,
    bottom: Spacing.space6,
    backgroundColor: Colors.surface,
    borderRadius: Shapes.radiusSm,
    paddingHorizontal: Spacing.space4,
    paddingVertical: Spacing.space1,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.shadowSm,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.orange700,
  },
  legendText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomLayerSelector: {
    backgroundColor: Colors.bgCream,
    paddingVertical: Spacing.space5,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  layerSelectorTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.space6,
    marginBottom: Spacing.space1,
  },
  layerScroll: {
    paddingHorizontal: Spacing.space6,
    gap: Spacing.space2,
  },
  layerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.space1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.space5,
    paddingVertical: Spacing.space2,
    borderRadius: Shapes.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  layerPillSelected: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.orange600,
  },
  layerPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  layerPillTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});

