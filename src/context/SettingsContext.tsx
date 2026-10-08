import React, { createContext, useContext, useState, useEffect } from 'react';
import { SavedLocation, UnitSystem } from '../types/weather';
import { StorageService } from '../utils/storage';
import { weatherApi } from '../api/openWeatherApi';

interface SettingsContextValue {
  unitSystem: UnitSystem;
  setUnitSystem: (unit: UnitSystem) => Promise<void>;
  apiKey: string;
  updateApiKey: (key: string) => Promise<void>;
  savedLocations: SavedLocation[];
  addLocation: (loc: SavedLocation) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
  isLocationSaved: (id: string) => boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>('metric');
  const [apiKey, setApiKeyState] = useState<string>('');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      const [storedUnit, storedKey, storedLocations] = await Promise.all([
        StorageService.getUnitSystem(),
        StorageService.getApiKey(),
        StorageService.getSavedLocations(),
      ]);

      const activeKey = storedKey || process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY?.trim() || '';
      setUnitSystemState(storedUnit);
      setApiKeyState(activeKey);
      setSavedLocations(storedLocations);
      weatherApi.setApiKey(activeKey);
    };

    loadSettings();
  }, []);

  const setUnitSystem = async (unit: UnitSystem) => {
    setUnitSystemState(unit);
    await StorageService.setUnitSystem(unit);
  };

  const updateApiKey = async (key: string) => {
    setApiKeyState(key);
    weatherApi.setApiKey(key);
    await StorageService.setApiKey(key);
  };

  const addLocation = async (loc: SavedLocation) => {
    const updated = await StorageService.saveLocation(loc);
    setSavedLocations(updated);
  };

  const removeLocation = async (id: string) => {
    const updated = await StorageService.removeLocation(id);
    setSavedLocations(updated);
  };

  const isLocationSaved = (id: string): boolean => {
    return savedLocations.some((l) => l.id === id);
  };

  return (
    <SettingsContext.Provider
      value={{
        unitSystem,
        setUnitSystem,
        apiKey,
        updateApiKey,
        savedLocations,
        addLocation,
        removeLocation,
        isLocationSaved,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
