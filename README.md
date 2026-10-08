# SkyWatch — Weather Intelligence Android App

[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-57-000020?logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Android](https://img.shields.io/badge/Android%20Package-com.sunilkumar.SkyWatch-3DDC84?logo=android&logoColor=white)](https://developer.android.com)

**SkyWatch** is an executive-grade weather intelligence mobile application engineered for Android. Built with React Native, TypeScript, and OpenWeather APIs, it elevates meteorological data into rich atmospheric telemetry with a luxury dark-glassmorphic aesthetic.

---

## 🚀 Key Highlights & Architectural Features

### 1. Current Atmospheric Telemetry
- **Thermal Metrics:** Real-time temperature, perceived "feels like", daily high & low range, dew point calculation ($T - (100 - RH)/5$).
- **Vector Wind Telemetry:** Wind speed (km/h & mph), dynamic 360° compass bearing, cardinal direction (N, NE, E...), and peak gust speed.
- **Barometric Pressure:** Atmospheric pressure (hPa & inHg) with pressure categorization (High/Clear, Low/Stormy, Steady).
- **Humidity & Visibility:** Relative humidity %, horizontal visibility range (km/mi), cloud coverage %, and precipitation alerts.
- **Celestial Solar & Moon Arc:** Interactive SVG curve tracking sunrise, sunset, total daylight duration, and real-time sun progression across the horizon.

### 2. 5-Day / 3-Hour Forecast Engine
- **Horizontal Hourly Carousel:** Instant time-step forecast cards displaying hourly timestamps, condition icons, temperatures, and probability of precipitation (%) badges.
- **Interactive SVG Thermal Curve:** 24-hour smooth bezier curve graph plotting temperature curves with gradient area fill and high/low points.
- **5-Day Outlook Matrix:** Grouped daily summaries with relative temperature range bars, weather condition icons, and cumulative precipitation probabilities.

### 3. Air Quality Index (AQI) Intelligence
- **OpenWeather Air Pollution API:** Real-time evaluation mapping European 1–5 AQI indices to US AQI scores.
- **Radial AQI Gauge:** Custom 240-degree circular arc gauge with active needle tracking, numeric index readout, categorical status label (**Good**, **Fair**, **Moderate**, **Poor**, **Very Poor**), and health advisory notice.
- **Particulate & Gas Matrix ($\mu g/m^3$):** Fine particles ($PM_{2.5}$), Coarse particles ($PM_{10}$), Nitrogen Dioxide ($NO_2$), Ozone ($O_3$), Carbon Monoxide ($CO$), and Sulfur Dioxide ($SO_2$) with WHO/EPA threshold progress bars.

### 4. Interactive Weather Radar Map
- **OpenWeatherMap 2.0 Tile Layers:**
  - `precipitation_new` (Rain & Precipitation Radar)
  - `temp_new` (Thermal Heatmap)
  - `clouds_new` (Cloud Cover)
  - `wind_new` (Wind Velocity Vectors)
  - `pressure_new` (Sea-Level Barometric Pressure)
- **Map Controls:** Floating quick-controls (Center on city, Zoom In, Zoom Out, Reset), horizontal layer selector pills, dynamic legend scale, and 100% Android compatibility using Leaflet via WebView.

### 5. Geocoding & Omnibox Location Search
- **Live Search Autocomplete:** Instant queries against OpenWeather Geocoding API (`/geo/1.0/direct`).
- **Rich Result Display:** City, State/Province, Country, precise coordinates ($Lat, Lon$).
- **GPS Location Detection:** One-tap location detection with `expo-location` and reverse geocoding.
- **Recent Searches & Popular Hubs:** Quick-switch history pills and popular international weather hubs.

### 6. Persistence & Customization
- **Saved Locations Registry:** Add, view, switch, and remove favorite locations stored in AsyncStorage.
- **Unit System Toggle:** Seamless instant toggle between Metric (°C, km/h, hPa) and Imperial (°F, mph, inHg).
- **API Key Configuration:** In-app OpenWeather API key input with automatic zero-configuration sandbox demo fallback.

---

## 📁 Directory Architecture

```
assignment/
├── App.tsx                     # Application Root & Providers
├── app.json                    # Expo & Android Package Config (com.sunilkumar.SkyWatch)
├── src/
│   ├── api/
│   │   ├── openWeatherApi.ts   # OpenWeather client with retry & fallback
│   │   └── mockData.ts         # High-fidelity realistic telemetry sandbox
│   ├── types/
│   │   └── weather.ts          # TypeScript interfaces for weather & AQI
│   ├── context/
│   │   ├── WeatherContext.tsx  # Atmospheric state, GPS, forecast telemetry
│   │   └── SettingsContext.tsx # Units (°C/°F), API key, saved locations
│   ├── utils/
│   │   ├── formatters.ts       # Temperature, wind, pressure, sun progress
│   │   ├── aqiUtils.ts         # AQI calculations & WHO threshold mappings
│   │   ├── weatherIcons.tsx    # Weather condition to vector icon mapper
│   │   └── storage.ts          # AsyncStorage persistence wrapper
│   ├── components/
│   │   ├── common/             # GlassCard, Header
│   │   ├── current/            # CurrentWeatherHero, AtmosphericGrid, SunMoonArc
│   │   ├── forecast/           # HourlyForecastList, TempTrendChart, DailyForecastCard
│   │   ├── aqi/                # RadialAqiGauge, PollutantGrid
│   │   ├── map/                # WeatherRadarModal
│   │   ├── search/             # SearchLocationModal
│   │   └── settings/           # SettingsModal
│   └── screens/
│       └── DashboardScreen.tsx # Primary Weather Intelligence Dashboard
```

---

## 🛠️ Getting Started & Commands

### Prerequisites
- Node.js 18+ (tested on Node v24)
- Android Studio / Expo Go app on your Android device

### Running the App

```bash
# Start the Expo development server
npx expo start

# Run on Android emulator or connected device
npx expo run:android

# Run type check
npx tsc --noEmit

# Run linter
npx expo lint

# Diagnose dependencies
npx expo-doctor
```

---

## 📱 Android Configuration
- **Package Name:** `com.sunilkumar.SkyWatch`
- **Permissions:**
  - `android.permission.ACCESS_FINE_LOCATION`
  - `android.permission.ACCESS_COARSE_LOCATION`
  - `android.permission.INTERNET`
- **UI Theme:** Luxury Deep Slate Dark Theme (`#0B0F19`)
