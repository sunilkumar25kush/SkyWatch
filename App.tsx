import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { SettingsProvider } from './src/context/SettingsContext';
import { WeatherProvider } from './src/context/WeatherContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { Colors } from './src/theme/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingCenter]}>
        <ActivityIndicator size="large" color={Colors.orange600} />
      </View>
    );
  }

  return (
    <SettingsProvider>
      <WeatherProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <DashboardScreen />
        </View>
      </WeatherProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCream,
  },
  loadingCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

