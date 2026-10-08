import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  SavedLocation,
} from '../types/weather';
import { weatherApi } from '../api/openWeatherApi';
import { DEFAULT_MOCK_LOCATION } from '../api/mockData';
import { StorageService } from '../utils/storage';
import { useSettings } from './SettingsContext';

interface WeatherContextValue {
  activeLocation: SavedLocation;
  setActiveLocation: (loc: SavedLocation) => void;
  currentWeather: CurrentWeatherResponse | null;
  forecast: ForecastResponse | null;
  airPollution: AirPollutionResponse | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  locationPermissionDenied: boolean;
  refreshData: () => Promise<void>;
  detectGpsLocation: () => Promise<boolean>;
  selectLocation: (loc: SavedLocation) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextValue | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { unitSystem } = useSettings();
  const [activeLocation, setActiveLocationState] = useState<SavedLocation>(
    DEFAULT_MOCK_LOCATION
  );
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState<boolean>(false);

  // Core weather fetcher
  const fetchWeatherForCoords = useCallback(
    async (lat: number, lon: number, isPullToRefresh = false) => {
      try {
        if (isPullToRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const [curr, fore, air] = await Promise.all([
          weatherApi.getCurrentWeather(lat, lon, unitSystem),
          weatherApi.getForecast(lat, lon, unitSystem),
          weatherApi.getAirPollution(lat, lon),
        ]);

        setCurrentWeather(curr);
        setForecast(fore);
        setAirPollution(air);
      } catch (err: any) {
        console.error('Failed to fetch weather data:', err);
        setError('Unable to fetch live weather data. Showing cached/fallback data.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [unitSystem]
  );

  // Detect GPS location with Expo Location
  const detectGpsLocation = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermissionDenied(true);
        return false;
      }

      setLocationPermissionDenied(false);
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;

      // Reverse geocode to get locality name
      let locationName = 'Current Location';
      let stateName: string | undefined;
      let countryCode = 'GPS';

      try {
        const reverse = await weatherApi.reverseGeocode(latitude, longitude);
        if (reverse) {
          locationName = reverse.name;
          stateName = reverse.state;
          countryCode = reverse.country;
        } else {
          const expoReverse = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          if (expoReverse.length > 0) {
            const first = expoReverse[0];
            locationName = first.city || first.district || first.name || 'Current Location';
            stateName = first.region || undefined;
            countryCode = first.isoCountryCode || 'GPS';
          }
        }
      } catch (e) {
        console.warn('Reverse geocode fallback:', e);
      }

      const detectedLocation: SavedLocation = {
        id: `current_gps_${latitude.toFixed(2)}_${longitude.toFixed(2)}`,
        name: locationName,
        state: stateName,
        country: countryCode,
        lat: latitude,
        lon: longitude,
        isCurrentLocation: true,
      };

      setActiveLocationState(detectedLocation);
      await StorageService.setActiveLocation(detectedLocation);
      await fetchWeatherForCoords(latitude, longitude);
      return true;
    } catch (err) {
      console.warn('GPS location detection failed:', err);
      setLocationPermissionDenied(true);
      return false;
    }
  }, [fetchWeatherForCoords]);

  const isInitialMount = React.useRef(true);

  // Initial load
  useEffect(() => {
    let isCancelled = false;
    const initApp = async () => {
      const saved = await StorageService.getActiveLocation();
      if (isCancelled) return;
      setActiveLocationState(saved);

      // Attempt GPS detection first, fallback to saved if denied or unavailable
      const gpsSuccess = await detectGpsLocation();
      if (!gpsSuccess && !isCancelled) {
        await fetchWeatherForCoords(saved.lat, saved.lon);
      }
    };

    initApp();
    return () => {
      isCancelled = true;
    };
  }, [detectGpsLocation, fetchWeatherForCoords]);

  // Re-fetch when unit system changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (activeLocation) {
        fetchWeatherForCoords(activeLocation.lat, activeLocation.lon);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [unitSystem, activeLocation, fetchWeatherForCoords]);

  const refreshData = async () => {
    if (activeLocation) {
      await fetchWeatherForCoords(activeLocation.lat, activeLocation.lon, true);
    }
  };

  const selectLocation = async (loc: SavedLocation) => {
    setActiveLocationState(loc);
    await StorageService.setActiveLocation(loc);
    await fetchWeatherForCoords(loc.lat, loc.lon);
  };

  return (
    <WeatherContext.Provider
      value={{
        activeLocation,
        setActiveLocation: setActiveLocationState,
        currentWeather,
        forecast,
        airPollution,
        loading,
        refreshing,
        error,
        locationPermissionDenied,
        refreshData,
        detectGpsLocation,
        selectLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextValue => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
