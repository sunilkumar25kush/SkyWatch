# SkyWatch - Production-Ready Weather Intelligence Android App
## Comprehensive Product Requirements Document (PRD)

**App Name:** SkyWatch  
**Package Name:** `com.sunilkumar.SkyWatch`  
**Platform:** Android (with responsive React Native / Expo support)  
**Framework:** React Native + Expo (TypeScript)  
**Weather Provider:** OpenWeather API (One Call / Current Weather, 5-Day 3-Hour Forecast, Air Pollution, Geocoding, Map 2.0 Tile Layers)  
**Architecture:** Production-ready, Clean Architecture (Modular Service/Repository/UI Pattern)  
**Primary Design Goal:** Premium Weather Intelligence Dashboard (Dark Glassmorphism, Luxury Typography, High Information Density, Fluid Visualizations)

---

## 1. PRODUCT OVERVIEW & OBJECTIVES

SkyWatch is an executive-grade weather intelligence mobile application engineered for Android. Unlike standard minimalist weather apps that offer basic icons and single temperatures, SkyWatch treats weather as atmospheric telemetry—offering rich contextual insights, air quality particulate breakdowns, interactive radar tiles, hourly micro-trends, and multi-location management.

### Key Tenets
1. **Visual Excellence:** High-contrast luxury palette (Deep Space `#0B0F19`, Electric Indigo `#6366F1`, Cyan `#06B6D4`, Amber `#F59E0B`, Emerald `#10B981`) with frosted glass containers and smooth SVG data visualizations.
2. **Actionable Intelligence:** Every metric comes with a human-readable interpretation (e.g., AQI recommendations, dew point comfort rating, UV peak advisory).
3. **Resilience & Reliability:** Graceful fallback mock modes if OpenWeather keys are missing or rate-limited; offline cache persistence with AsyncStorage; robust GPS permission handling.

---

## 2. CORE FEATURE SPECIFICATIONS

### 2.1 Current Weather Telemetry
- **Thermal Metrics:** Real-time Temperature, Perceived "Feels Like", Daily High / Low, Dew Point.
- **Atmospheric Dynamics:** Barometric pressure (hPa/inHg) with trend indicator (Rising/Falling/Steady), Relative Humidity (%), Cloud cover (%).
- **Wind Vectoring:** Wind velocity (km/h, mph, m/s), Compass bearing angle (° and Cardinal N/NE/E...), Peak Gust speed.
- **Visibility & Celestial:** Horizontal visibility range (km/miles), Celestial cycle with dynamic sun path arc (Sunrise, Sunset, Daylight duration, Solar noon).
- **Condition Hierarchy:** Primary condition header, detailed atmospheric description, dynamic weather artwork/icons.

### 2.2 5-Day / 3-Hour Forecast Engine
- **Horizontal 24-48h Hourly Carousel:** Instant time-step cards displaying temperature curve, rain probability (%) badge, wind vectors, and icon.
- **Interactive SVG Trend Chart:** Smooth temperature bezier curve graph with precipitation probability area fill and high/low points.
- **Daily 5-Day Forecast Matrix:** Grouped daily summaries showing min/max temperature bars with relative gradient fills, dominant condition, and aggregate rain probability.

### 2.3 Air Quality Index (AQI) Intelligence
- **OpenWeather Air Pollution API:** Real-time AQI evaluation (Scale 1–5 with US AQI 0–500 translation).
- **Radial AQI Gauge:** Custom circular arc gauge with glowing needle indicator, numeric score, status label (Good, Fair, Moderate, Poor, Very Poor), and health advisory notice.
- **Detailed Pollutant Matrix (μg/m³):**
  - Fine Particulate Matter ($PM_{2.5}$)
  - Coarse Particulate Matter ($PM_{10}$)
  - Ozone ($O_3$)
  - Nitrogen Dioxide ($NO_2$)
  - Carbon Monoxide ($CO$)
  - Sulfur Dioxide ($SO_2$)
  - Nitric Oxide ($NO$) & Ammonia ($NH_3$)
- **Contextual Health Guidance:** Tailored advice for sensitive groups, outdoor workouts, indoor ventilation, and mask recommendations.

### 2.4 Interactive Weather Radar & Atmospheric Map
- **OpenWeatherMap 2.0 Tile Layers:**
  - Precipitation / Rain (`precipitation_new`)
  - Cloud Cover (`clouds_new`)
  - Sea-Level Atmospheric Pressure (`pressure_new`)
  - Wind Velocity Fields (`wind_new`)
  - Temperature Thermal Map (`temp_new`)
- **Map UX Controls:**
  - Floating layer switch pills (horizontal carousel)
  - Zoom in/out, re-center on target coordinates
  - Legend bar indicating data scales (e.g. mm/h, °C, hPa, m/s)
  - Interactive WebView/Leaflet map rendering ensuring 100% Android compatibility without native Google Play Services crashes.

### 2.5 Geocoding & Omnibox Location Search
- **Live Search Autocomplete:** Instant queries against OpenWeather Geocoding API (`/geo/1.0/direct?q={query}&limit=5`).
- **Rich Result Display:**
  - City name, State/Province, Country flag/code
  - Coordinates ($Lat, Long$)
  - Live preview badge showing current temperature & condition if cached
- **Reverse Geocoding:** Translates device GPS coordinates (`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`) into clean locality and administrative labels.
- **Recent Searches:** Quick-pick history pills stored locally for instant switching.

### 2.6 Multi-City Management & Saved Locations
- **Favorites Registry:** Save frequently monitored locations (e.g., Home, Work, Vacation).
- **Quick Switcher:** Fast swipeable or drawer/sheet selector from the dashboard.
- **Storage:** Persisted across app sessions via `@skywatch:saved_locations`.

### 2.7 Unit Conversion & App Settings
- **Temperature Units:** Metric (°C) vs Imperial (°F).
- **Wind Units:** km/h, mph, m/s.
- **Pressure Units:** hPa, inHg, mmHg.
- **API Key Configuration:** In-app OpenWeather API key input modal so users can test with their own keys, with an automatic demo/sandbox fallback mode when unkeyed.
