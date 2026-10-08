export type UnitSystem = 'metric' | 'imperial';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number; // Probability of precipitation (0 to 1)
  rain?: {
    '3h': number;
  };
  snow?: {
    '3h': number;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AirPollutionComponents {
  co: number; // Carbon monoxide (μg/m3)
  no: number; // Nitrogen monoxide (μg/m3)
  no2: number; // Nitrogen dioxide (μg/m3)
  o3: number; // Ozone (μg/m3)
  so2: number; // Sulphur dioxide (μg/m3)
  pm2_5: number; // Fine particles matter (μg/m3)
  pm10: number; // Coarse particulate matter (μg/m3)
  nh3: number; // Ammonia (μg/m3)
}

export interface AirPollutionItem {
  main: {
    aqi: 1 | 2 | 3 | 4 | 5; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  };
  components: AirPollutionComponents;
  dt: number;
}

export interface AirPollutionResponse {
  coord: Coordinates;
  list: AirPollutionItem[];
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  isCurrentLocation?: boolean;
}

export type MapLayerType =
  | 'clouds_new'
  | 'precipitation_new'
  | 'pressure_new'
  | 'wind_new'
  | 'temp_new';

export interface MapLayerConfig {
  id: MapLayerType;
  label: string;
  unit: string;
  icon: string;
  color: string;
}
