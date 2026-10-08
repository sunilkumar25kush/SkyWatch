import {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResult,
  UnitSystem,
  MapLayerType,
} from '../types/weather';
import {
  MOCK_CURRENT_WEATHER,
  generateMockForecast,
  MOCK_AIR_POLLUTION,
  MOCK_SEARCH_RESULTS,
} from './mockData';

const BASE_URL = 'https://api.openweathermap.org';

// Read OpenWeather API key from Expo environment (.env)
export const DEFAULT_ENV_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY?.trim() || '';

export class OpenWeatherService {
  private apiKey: string;

  constructor(apiKey: string = DEFAULT_ENV_KEY) {
    this.apiKey = apiKey.trim();
  }

  setApiKey(key: string) {
    this.apiKey = key.trim();
  }

  getApiKey(): string {
    return this.apiKey;
  }

  private hasValidKey(): boolean {
    return this.apiKey.length >= 16;
  }

  async getCurrentWeather(
    lat: number,
    lon: number,
    units: UnitSystem = 'metric'
  ): Promise<CurrentWeatherResponse> {
    if (!this.hasValidKey()) {
      return {
        ...MOCK_CURRENT_WEATHER,
        coord: { lat, lon },
        dt: Math.floor(Date.now() / 1000),
      };
    }

    try {
      const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`OpenWeather API error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Falling back to mock current weather:', err);
      return {
        ...MOCK_CURRENT_WEATHER,
        coord: { lat, lon },
        dt: Math.floor(Date.now() / 1000),
      };
    }
  }

  async getForecast(
    lat: number,
    lon: number,
    units: UnitSystem = 'metric'
  ): Promise<ForecastResponse> {
    if (!this.hasValidKey()) {
      return generateMockForecast(29.4);
    }

    try {
      const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`OpenWeather API error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Falling back to mock forecast:', err);
      return generateMockForecast(29.4);
    }
  }

  async getAirPollution(lat: number, lon: number): Promise<AirPollutionResponse> {
    if (!this.hasValidKey()) {
      return {
        ...MOCK_AIR_POLLUTION,
        coord: { lat, lon },
      };
    }

    try {
      const url = `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`OpenWeather API error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Falling back to mock air pollution:', err);
      return {
        ...MOCK_AIR_POLLUTION,
        coord: { lat, lon },
      };
    }
  }

  async searchLocations(query: string, limit: number = 5): Promise<GeocodingResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    if (!this.hasValidKey()) {
      const lower = trimmed.toLowerCase();
      const matched = MOCK_SEARCH_RESULTS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(lower) ||
          (loc.state && loc.state.toLowerCase().includes(lower)) ||
          loc.country.toLowerCase().includes(lower)
      );
      if (matched.length > 0) return matched;
      return [
        {
          name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
          lat: 28.6139,
          lon: 77.209,
          country: 'Auto',
          state: 'Search Result',
        },
      ];
    }

    try {
      const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(
        trimmed
      )}&limit=${limit}&appid=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Geocoding error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Geocoding search failed, returning fallback:', err);
      return [];
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
    if (!this.hasValidKey()) {
      return {
        name: 'Detected Location',
        lat,
        lon,
        country: 'GPS',
        state: 'Locality',
      };
    }

    try {
      const url = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Reverse geocode error: ${res.status}`);
      const data: GeocodingResult[] = await res.json();
      return data[0] || null;
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      return null;
    }
  }

  getMapTileUrl(layer: MapLayerType, z: number, x: number, y: number): string {
    const key = this.apiKey || 'demo_key';
    return `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${key}`;
  }
}

export const weatherApi = new OpenWeatherService(DEFAULT_ENV_KEY);
