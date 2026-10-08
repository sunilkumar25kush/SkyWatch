import {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResult,
  SavedLocation,
} from '../types/weather';

export const DEFAULT_MOCK_LOCATION: SavedLocation = {
  id: 'new_delhi_in',
  name: 'New Delhi',
  state: 'Delhi',
  country: 'IN',
  lat: 28.6139,
  lon: 77.209,
};

export const POPULAR_LOCATIONS: SavedLocation[] = [
  {
    id: 'new_delhi_in',
    name: 'New Delhi',
    state: 'Delhi',
    country: 'IN',
    lat: 28.6139,
    lon: 77.209,
  },
  {
    id: 'bengaluru_in',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'IN',
    lat: 12.9716,
    lon: 77.5946,
  },
  {
    id: 'london_uk',
    name: 'London',
    state: 'England',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278,
  },
  {
    id: 'tokyo_jp',
    name: 'Tokyo',
    country: 'JP',
    lat: 35.6762,
    lon: 139.6503,
  },
  {
    id: 'san_francisco_us',
    name: 'San Francisco',
    state: 'California',
    country: 'US',
    lat: 37.7749,
    lon: -122.4194,
  },
  {
    id: 'dubai_ae',
    name: 'Dubai',
    country: 'AE',
    lat: 25.2048,
    lon: 55.2708,
  },
];

export const MOCK_CURRENT_WEATHER: CurrentWeatherResponse = {
  coord: {
    lat: 28.6139,
    lon: 77.209,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  base: 'stations',
  main: {
    temp: 29.4,
    feels_like: 31.2,
    temp_min: 24.0,
    temp_max: 34.8,
    pressure: 1012,
    humidity: 48,
    sea_level: 1012,
    grnd_level: 988,
  },
  visibility: 8500,
  wind: {
    speed: 3.6,
    deg: 295,
    gust: 6.2,
  },
  clouds: {
    all: 5,
  },
  rain: undefined,
  dt: Math.floor(Date.now() / 1000),
  sys: {
    country: 'IN',
    sunrise: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago
    sunset: Math.floor(Date.now() / 1000) + 21600, // 6 hours ahead
  },
  timezone: 19800,
  id: 1261481,
  name: 'New Delhi',
  cod: 200,
};

export const generateMockForecast = (baseTemp = 29.4): ForecastResponse => {
  const now = Math.floor(Date.now() / 1000);
  const items = [];
  const hours = [
    { offset: 3, temp: baseTemp + 1.2, pop: 0.05, condition: 'Clear', icon: '01d' },
    { offset: 6, temp: baseTemp + 3.4, pop: 0.1, condition: 'Clear', icon: '01d' },
    { offset: 9, temp: baseTemp + 4.1, pop: 0.15, condition: 'Clouds', icon: '02d' },
    { offset: 12, temp: baseTemp + 1.8, pop: 0.2, condition: 'Clouds', icon: '03n' },
    { offset: 15, temp: baseTemp - 1.5, pop: 0.15, condition: 'Clear', icon: '01n' },
    { offset: 18, temp: baseTemp - 3.2, pop: 0.1, condition: 'Clear', icon: '01n' },
    { offset: 21, temp: baseTemp - 4.5, pop: 0.05, condition: 'Clear', icon: '01n' },
    { offset: 24, temp: baseTemp - 2.0, pop: 0.1, condition: 'Clear', icon: '01d' },
    { offset: 27, temp: baseTemp + 0.8, pop: 0.25, condition: 'Clouds', icon: '02d' },
    { offset: 30, temp: baseTemp + 3.1, pop: 0.35, condition: 'Rain', icon: '10d' },
    { offset: 33, temp: baseTemp + 2.5, pop: 0.45, condition: 'Rain', icon: '10d' },
    { offset: 36, temp: baseTemp + 0.2, pop: 0.2, condition: 'Clouds', icon: '03n' },
    { offset: 39, temp: baseTemp - 2.0, pop: 0.1, condition: 'Clear', icon: '01n' },
    { offset: 42, temp: baseTemp - 3.8, pop: 0.05, condition: 'Clear', icon: '01n' },
    { offset: 45, temp: baseTemp - 1.8, pop: 0.1, condition: 'Clear', icon: '01d' },
    { offset: 48, temp: baseTemp + 1.5, pop: 0.15, condition: 'Clouds', icon: '02d' },
    { offset: 51, temp: baseTemp + 3.8, pop: 0.2, condition: 'Clear', icon: '01d' },
    { offset: 54, temp: baseTemp + 1.0, pop: 0.1, condition: 'Clear', icon: '01n' },
    { offset: 57, temp: baseTemp - 2.2, pop: 0.05, condition: 'Clear', icon: '01n' },
    { offset: 60, temp: baseTemp - 3.5, pop: 0.05, condition: 'Clear', icon: '01n' },
    { offset: 63, temp: baseTemp + 0.5, pop: 0.1, condition: 'Clouds', icon: '02d' },
    { offset: 66, temp: baseTemp + 2.9, pop: 0.15, condition: 'Clear', icon: '01d' },
    { offset: 69, temp: baseTemp + 0.4, pop: 0.05, condition: 'Clear', icon: '01n' },
    { offset: 72, temp: baseTemp - 2.8, pop: 0.05, condition: 'Clear', icon: '01n' },
  ];

  for (const h of hours) {
    const itemDt = now + h.offset * 3600;
    const dateObj = new Date(itemDt * 1000);
    items.push({
      dt: itemDt,
      main: {
        temp: Math.round(h.temp * 10) / 10,
        feels_like: Math.round((h.temp + 1.5) * 10) / 10,
        temp_min: Math.round((h.temp - 2.0) * 10) / 10,
        temp_max: Math.round((h.temp + 2.0) * 10) / 10,
        pressure: 1013,
        humidity: 52,
      },
      weather: [
        {
          id: h.condition === 'Clear' ? 800 : h.condition === 'Rain' ? 500 : 802,
          main: h.condition,
          description: h.condition.toLowerCase(),
          icon: h.icon,
        },
      ],
      clouds: { all: h.condition === 'Clear' ? 10 : 65 },
      wind: { speed: 4.1, deg: 280, gust: 6.8 },
      visibility: 9000,
      pop: h.pop,
      rain: h.condition === 'Rain' ? { '3h': 2.4 } : undefined,
      dt_txt: dateObj.toISOString().replace('T', ' ').substring(0, 19),
    });
  }

  return {
    cod: '200',
    message: 0,
    cnt: items.length,
    list: items,
    city: {
      id: 1261481,
      name: 'New Delhi',
      coord: { lat: 28.6139, lon: 77.209 },
      country: 'IN',
      population: 31870000,
      timezone: 19800,
      sunrise: now - 14400,
      sunset: now + 21600,
    },
  };
};

export const MOCK_AIR_POLLUTION: AirPollutionResponse = {
  coord: {
    lat: 28.6139,
    lon: 77.209,
  },
  list: [
    {
      main: {
        aqi: 3, // Moderate
      },
      components: {
        co: 780.4,
        no: 3.2,
        no2: 24.8,
        o3: 68.2,
        so2: 12.4,
        pm2_5: 42.6,
        pm10: 88.5,
        nh3: 9.3,
      },
      dt: Math.floor(Date.now() / 1000),
    },
  ],
};

export const MOCK_SEARCH_RESULTS: GeocodingResult[] = [
  {
    name: 'New Delhi',
    lat: 28.6139,
    lon: 77.209,
    country: 'IN',
    state: 'Delhi',
  },
  {
    name: 'Bengaluru',
    lat: 12.9716,
    lon: 77.5946,
    country: 'IN',
    state: 'Karnataka',
  },
  {
    name: 'Mumbai',
    lat: 19.076,
    lon: 72.8777,
    country: 'IN',
    state: 'Maharashtra',
  },
  {
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
    country: 'GB',
    state: 'England',
  },
  {
    name: 'New York',
    lat: 40.7128,
    lon: -74.006,
    country: 'US',
    state: 'New York',
  },
];
