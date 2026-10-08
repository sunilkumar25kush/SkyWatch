import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface WeatherIconConfig {
  name: string;
  iconSet: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather';
  color: string;
}

export const getWeatherIconConfig = (
  iconCode: string = '01d',
  conditionMain: string = 'Clear'
): WeatherIconConfig => {
  const isNight = iconCode.endsWith('n');
  const main = conditionMain.toLowerCase();

  if (main.includes('thunderstorm')) {
    return {
      name: 'weather-lightning-rainy',
      iconSet: 'MaterialCommunityIcons',
      color: '#A855F7',
    };
  }

  if (main.includes('drizzle')) {
    return {
      name: 'weather-partly-rainy',
      iconSet: 'MaterialCommunityIcons',
      color: '#38BDF8',
    };
  }

  if (main.includes('rain')) {
    return {
      name: 'weather-pouring',
      iconSet: 'MaterialCommunityIcons',
      color: '#0284C7',
    };
  }

  if (main.includes('snow')) {
    return {
      name: 'weather-snowy-heavy',
      iconSet: 'MaterialCommunityIcons',
      color: '#BAE6FD',
    };
  }

  if (
    main.includes('mist') ||
    main.includes('smoke') ||
    main.includes('haze') ||
    main.includes('dust') ||
    main.includes('fog') ||
    main.includes('sand') ||
    main.includes('ash') ||
    main.includes('squall') ||
    main.includes('tornado')
  ) {
    return {
      name: 'weather-fog',
      iconSet: 'MaterialCommunityIcons',
      color: '#94A3B8',
    };
  }

  if (main.includes('clear')) {
    return isNight
      ? {
          name: 'weather-night',
          iconSet: 'MaterialCommunityIcons',
          color: '#818CF8',
        }
      : {
          name: 'weather-sunny',
          iconSet: 'MaterialCommunityIcons',
          color: '#FBBF24',
        };
  }

  // Clouds
  if (iconCode === '02d' || iconCode === '02n') {
    return isNight
      ? {
          name: 'weather-night-partly-cloudy',
          iconSet: 'MaterialCommunityIcons',
          color: '#A5B4FC',
        }
      : {
          name: 'weather-partly-cloudy',
          iconSet: 'MaterialCommunityIcons',
          color: '#FCD34D',
        };
  }

  return {
    name: 'weather-cloudy',
    iconSet: 'MaterialCommunityIcons',
    color: '#93C5FD',
  };
};

export const WeatherIcon: React.FC<{
  iconCode?: string;
  condition?: string;
  size?: number;
  color?: string;
}> = ({ iconCode = '01d', condition = 'Clear', size = 32, color }) => {
  const config = getWeatherIconConfig(iconCode, condition);
  const activeColor = color || config.color;

  return (
    <MaterialCommunityIcons
      name={config.name as any}
      size={size}
      color={activeColor}
    />
  );
};
