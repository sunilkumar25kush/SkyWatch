import { UnitSystem } from '../types/weather';

export const formatTemp = (temp: number | undefined | null, unit: UnitSystem = 'metric'): string => {
  if (temp === undefined || temp === null) return '--°';
  const rounded = Math.round(temp);
  return `${rounded}°${unit === 'metric' ? 'C' : 'F'}`;
};

export const formatWindSpeed = (speed: number | undefined, unit: UnitSystem = 'metric'): string => {
  if (speed === undefined || speed === null) return '--';
  if (unit === 'metric') {
    // OpenWeather returns m/s for metric, let's display km/h for intuitive readability
    const kmh = Math.round(speed * 3.6);
    return `${kmh} km/h`;
  } else {
    // Imperial returns mph
    return `${Math.round(speed)} mph`;
  }
};

export const getWindDirectionCardinal = (deg: number | undefined): string => {
  if (deg === undefined) return '--';
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
};

export const formatPressure = (pressure: number | undefined, unit: UnitSystem = 'metric'): string => {
  if (pressure === undefined || pressure === null) return '--';
  if (unit === 'metric') {
    return `${pressure} hPa`;
  } else {
    const inHg = (pressure * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
};

export const formatDistance = (meters: number | undefined, unit: UnitSystem = 'metric'): string => {
  if (meters === undefined || meters === null) return '--';
  if (unit === 'metric') {
    return `${(meters / 1000).toFixed(1)} km`;
  } else {
    return `${(meters / 1609.34).toFixed(1)} mi`;
  }
};

export const formatTime = (timestamp: number | undefined, timezoneOffsetSeconds: number = 0): string => {
  if (!timestamp) return '--:--';
  const localDate = new Date((timestamp + timezoneOffsetSeconds) * 1000);
  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatHourlyTime = (timestamp: number | undefined, timezoneOffsetSeconds: number = 0): string => {
  if (!timestamp) return '--';
  const localDate = new Date((timestamp + timezoneOffsetSeconds) * 1000);
  const hours = localDate.getUTCHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours} ${ampm}`;
};

export const formatDayName = (timestamp: number, timezoneOffsetSeconds: number = 0): string => {
  const localDate = new Date((timestamp + timezoneOffsetSeconds) * 1000);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[localDate.getUTCDay()];
};

export const getSunlightProgress = (
  sunrise: number,
  sunset: number,
  currentTime: number = Math.floor(Date.now() / 1000)
): { progress: number; isDaylight: boolean; daylightHours: string } => {
  const dayDuration = Math.max(1, sunset - sunrise);
  const daylightHours = (dayDuration / 3600).toFixed(1) + ' hrs';

  if (currentTime < sunrise) {
    return { progress: 0, isDaylight: false, daylightHours };
  }
  if (currentTime > sunset) {
    return { progress: 1, isDaylight: false, daylightHours };
  }

  const progress = Math.min(1, Math.max(0, (currentTime - sunrise) / dayDuration));
  return { progress, isDaylight: true, daylightHours };
};
