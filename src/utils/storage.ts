import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedLocation, UnitSystem } from '../types/weather';
import { DEFAULT_MOCK_LOCATION, POPULAR_LOCATIONS } from '../api/mockData';

const KEYS = {
  SAVED_LOCATIONS: '@skywatch:saved_locations',
  ACTIVE_LOCATION: '@skywatch:active_location',
  UNITS: '@skywatch:units',
  API_KEY: '@skywatch:api_key',
  RECENT_SEARCHES: '@skywatch:recent_searches',
};

export const StorageService = {
  async getSavedLocations(): Promise<SavedLocation[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SAVED_LOCATIONS);
      if (data) {
        return JSON.parse(data);
      }
      // Seed default popular locations if first run
      await AsyncStorage.setItem(
        KEYS.SAVED_LOCATIONS,
        JSON.stringify(POPULAR_LOCATIONS.slice(0, 3))
      );
      return POPULAR_LOCATIONS.slice(0, 3);
    } catch (e) {
      console.warn('Error reading saved locations:', e);
      return [DEFAULT_MOCK_LOCATION];
    }
  },

  async saveLocation(location: SavedLocation): Promise<SavedLocation[]> {
    try {
      const list = await this.getSavedLocations();
      const filtered = list.filter((item) => item.id !== location.id);
      const updated = [location, ...filtered];
      await AsyncStorage.setItem(KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error saving location:', e);
      return [];
    }
  },

  async removeLocation(id: string): Promise<SavedLocation[]> {
    try {
      const list = await this.getSavedLocations();
      const updated = list.filter((item) => item.id !== id);
      await AsyncStorage.setItem(KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error removing location:', e);
      return [];
    }
  },

  async getActiveLocation(): Promise<SavedLocation> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ACTIVE_LOCATION);
      return data ? JSON.parse(data) : DEFAULT_MOCK_LOCATION;
    } catch {
      return DEFAULT_MOCK_LOCATION;
    }
  },

  async setActiveLocation(loc: SavedLocation): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ACTIVE_LOCATION, JSON.stringify(loc));
    } catch (e) {
      console.warn('Error setting active location:', e);
    }
  },

  async getUnitSystem(): Promise<UnitSystem> {
    try {
      const unit = await AsyncStorage.getItem(KEYS.UNITS);
      return unit === 'imperial' ? 'imperial' : 'metric';
    } catch {
      return 'metric';
    }
  },

  async setUnitSystem(unit: UnitSystem): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.UNITS, unit);
    } catch (e) {
      console.warn('Error setting unit system:', e);
    }
  },

  async getApiKey(): Promise<string> {
    try {
      const key = await AsyncStorage.getItem(KEYS.API_KEY);
      return key || '';
    } catch {
      return '';
    }
  },

  async setApiKey(key: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.API_KEY, key.trim());
    } catch (e) {
      console.warn('Error saving API key:', e);
    }
  },

  async getRecentSearches(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
      return data ? JSON.parse(data) : ['London', 'Tokyo', 'Bengaluru'];
    } catch {
      return ['London', 'Tokyo'];
    }
  },

  async addRecentSearch(query: string): Promise<string[]> {
    try {
      const current = await this.getRecentSearches();
      const filtered = current.filter(
        (q) => q.toLowerCase() !== query.toLowerCase()
      );
      const updated = [query, ...filtered].slice(0, 8);
      await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
};
