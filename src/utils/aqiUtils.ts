import { AirPollutionComponents } from '../types/weather';

export interface AqiDetail {
  index: number;
  label: string;
  category: string;
  color: string;
  bgGradient: [string, string];
  approxUsAqi: number;
  description: string;
  recommendation: string;
}

export const getAqiDetails = (openWeatherAqi: number = 1): AqiDetail => {
  switch (openWeatherAqi) {
    case 1:
      return {
        index: 1,
        label: '1 - Good',
        category: 'Good',
        color: '#10B981', // Emerald
        bgGradient: ['#064E3B', '#047857'],
        approxUsAqi: 28,
        description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
        recommendation: 'Ideal conditions for outdoor exercises, ventilation, and normal outdoor activities.',
      };
    case 2:
      return {
        index: 2,
        label: '2 - Fair',
        category: 'Fair',
        color: '#84CC16', // Lime
        bgGradient: ['#3F6212', '#65A30D'],
        approxUsAqi: 65,
        description: 'Air quality is acceptable. However, very sensitive individuals may experience mild irritation.',
        recommendation: 'Acceptable for most people. Sensitive groups should monitor for prolonged outdoor exertion.',
      };
    case 3:
      return {
        index: 3,
        label: '3 - Moderate',
        category: 'Moderate',
        color: '#F59E0B', // Amber
        bgGradient: ['#78350F', '#B45309'],
        approxUsAqi: 115,
        description: 'Members of sensitive groups may experience health effects. General public less likely to be affected.',
        recommendation: 'Sensitive groups should reduce strenuous outdoor activities and consider wearing masks.',
      };
    case 4:
      return {
        index: 4,
        label: '4 - Poor',
        category: 'Poor',
        color: '#F97316', // Orange
        bgGradient: ['#7C2D12', '#C2410C'],
        approxUsAqi: 165,
        description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.',
        recommendation: 'Avoid prolonged outdoor exertion. Keep windows closed and run indoor air purifiers.',
      };
    case 5:
    default:
      return {
        index: 5,
        label: '5 - Very Poor',
        category: 'Very Poor',
        color: '#EF4444', // Red / Rose
        bgGradient: ['#7F1D1D', '#B91C1C'],
        approxUsAqi: 240,
        description: 'Health alert: The risk of health effects is increased for everyone.',
        recommendation: 'Avoid outdoor activities entirely. Use N95/FFP2 masks outdoors and stay inside sealed air-filtered rooms.',
      };
  }
};

export interface PollutantDetail {
  code: string;
  name: string;
  value: number;
  unit: string;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  statusColor: string;
  safeLimit: number;
}

export const getPollutantThresholds = (
  components?: AirPollutionComponents | Partial<AirPollutionComponents> | null
): PollutantDetail[] => {
  const getStatus = (
    val: number,
    goodLimit: number,
    modLimit: number,
    unhealthyLimit: number
  ): { status: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous'; color: string } => {
    if (val <= goodLimit) return { status: 'Good', color: '#10B981' };
    if (val <= modLimit) return { status: 'Moderate', color: '#F59E0B' };
    if (val <= unhealthyLimit) return { status: 'Unhealthy', color: '#F97316' };
    return { status: 'Hazardous', color: '#EF4444' };
  };

  const safe = components || {};
  const list: PollutantDetail[] = [];

  // PM2.5
  const pm25Val = safe.pm2_5 ?? 0;
  const pm25Stat = getStatus(pm25Val, 15, 35, 75);
  list.push({
    code: 'PM2.5',
    name: 'Fine Particulates',
    value: Math.round(pm25Val * 10) / 10,
    unit: 'μg/m³',
    status: pm25Stat.status,
    statusColor: pm25Stat.color,
    safeLimit: 15,
  });

  // PM10
  const pm10Val = safe.pm10 ?? 0;
  const pm10Stat = getStatus(pm10Val, 45, 100, 200);
  list.push({
    code: 'PM10',
    name: 'Coarse Particulates',
    value: Math.round(pm10Val * 10) / 10,
    unit: 'μg/m³',
    status: pm10Stat.status,
    statusColor: pm10Stat.color,
    safeLimit: 45,
  });

  // NO2
  const no2Val = safe.no2 ?? 0;
  const no2Stat = getStatus(no2Val, 40, 90, 180);
  list.push({
    code: 'NO₂',
    name: 'Nitrogen Dioxide',
    value: Math.round(no2Val * 10) / 10,
    unit: 'μg/m³',
    status: no2Stat.status,
    statusColor: no2Stat.color,
    safeLimit: 40,
  });

  // O3
  const o3Val = safe.o3 ?? 0;
  const o3Stat = getStatus(o3Val, 60, 120, 180);
  list.push({
    code: 'O₃',
    name: 'Ozone',
    value: Math.round(o3Val * 10) / 10,
    unit: 'μg/m³',
    status: o3Stat.status,
    statusColor: o3Stat.color,
    safeLimit: 60,
  });

  // CO
  const coVal = safe.co ?? 0;
  const coStat = getStatus(coVal, 4000, 9000, 15000);
  list.push({
    code: 'CO',
    name: 'Carbon Monoxide',
    value: Math.round(coVal * 10) / 10,
    unit: 'μg/m³',
    status: coStat.status,
    statusColor: coStat.color,
    safeLimit: 4000,
  });

  // SO2
  const so2Val = safe.so2 ?? 0;
  const so2Stat = getStatus(so2Val, 20, 80, 250);
  list.push({
    code: 'SO₂',
    name: 'Sulfur Dioxide',
    value: Math.round(so2Val * 10) / 10,
    unit: 'μg/m³',
    status: so2Stat.status,
    statusColor: so2Stat.color,
    safeLimit: 20,
  });

  return list;
};
