import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider } from './src/context/SettingsContext';
import { WeatherProvider } from './src/context/WeatherContext';
import { DashboardScreen } from './src/screens/DashboardScreen';

export default function App() {
  return (
    <SettingsProvider>
      <WeatherProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <DashboardScreen />
        </View>
      </WeatherProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
});
