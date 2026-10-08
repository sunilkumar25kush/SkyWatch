import { AirPollutionComponents } from '../types/weather';
import { Colors } from '../theme/colors';

export interface AqiDetail {
  index: number;              // OpenWeather Tier 1-5
  aqiScore: number;           // Standard US EPA AQI 0-500
  label: string;
  category: string;
  color: string;
  dominantPollutant: string;
  description: string;
  recommendation: string;
}

interface Breakpoint {
  bpLo: number;
  bpHi: number;
  iLo: number;
  iHi: number;
}

// Official US EPA AQI Breakpoints
const PM25_BREAKPOINTS: Breakpoint[] = [
  { bpLo: 0.0, bpHi: 12.0, iLo: 0, iHi: 50 },
  { bpLo: 12.1, bpHi: 35.4, iLo: 51, iHi: 100 },
  { bpLo: 35.5, bpHi: 55.4, iLo: 101, iHi: 150 },
  { bpLo: 55.5, bpHi: 150.4, iLo: 151, iHi: 200 },
  { bpLo: 150.5, bpHi: 250.4, iLo: 201, iHi: 300 },
  { bpLo: 250.5, bpHi: 350.4, iLo: 301, iHi: 400 },
  { bpLo: 350.5, bpHi: 500.4, iLo: 401, iHi: 500 },
];

const PM10_BREAKPOINTS: Breakpoint[] = [
  { bpLo: 0, bpHi: 54, iLo: 0, iHi: 50 },
  { bpLo: 55, bpHi: 154, iLo: 51, iHi: 100 },
  { bpLo: 155, bpHi: 254, iLo: 101, iHi: 150 },
  { bpLo: 255, bpHi: 354, iLo: 151, iHi: 200 },
  { bpLo: 355, bpHi: 424, iLo: 201, iHi: 300 },
  { bpLo: 425, bpHi: 504, iLo: 301, iHi: 400 },
  { bpLo: 505, bpHi: 604, iLo: 401, iHi: 500 },
];

const O3_BREAKPOINTS: Breakpoint[] = [
  { bpLo: 0, bpHi: 108, iLo: 0, iHi: 50 },
  { bpLo: 109, bpHi: 140, iLo: 51, iHi: 100 },
  { bpLo: 141, bpHi: 170, iLo: 101, iHi: 150 },
  { bpLo: 171, bpHi: 210, iLo: 151, iHi: 200 },
  { bpLo: 211, bpHi: 400, iLo: 201, iHi: 300 },
];

const NO2_BREAKPOINTS: Breakpoint[] = [
  { bpLo: 0, bpHi: 100, iLo: 0, iHi: 50 },
  { bpLo: 101, bpHi: 188, iLo: 51, iHi: 100 },
  { bpLo: 189, bpHi: 677, iLo: 101, iHi: 150 },
  { bpLo: 678, bpHi: 1222, iLo: 151, iHi: 200 },
];

const SO2_BREAKPOINTS: Breakpoint[] = [
  { bpLo: 0, bpHi: 92, iLo: 0, iHi: 50 },
  { bpLo: 93, bpHi: 197, iLo: 51, iHi: 100 },
  { bpLo: 198, bpHi: 485, iLo: 101, iHi: 150 },
  { bpLo: 486, bpHi: 797, iLo: 151, iHi: 200 },
];

const CO_BREAKPOINTS: Breakpoint[] = [
  { bpLo: 0, bpHi: 5000, iLo: 0, iHi: 50 },
  { bpLo: 5001, bpHi: 10800, iLo: 51, iHi: 100 },
  { bpLo: 10801, bpHi: 14200, iLo: 101, iHi: 150 },
  { bpLo: 14201, bpHi: 17600, iLo: 151, iHi: 200 },
];

function calculateSubIndex(cp: number, breakpoints: Breakpoint[]): number {
  if (cp <= 0 || isNaN(cp)) return 0;
  for (const bp of breakpoints) {
    if (cp >= bp.bpLo && cp <= bp.bpHi) {
      return Math.round(((bp.iHi - bp.iLo) / (bp.bpHi - bp.bpLo)) * (cp - bp.bpLo) + bp.iLo);
    }
  }
  // If exceeds highest breakpoint
  if (breakpoints.length > 0 && cp > breakpoints[breakpoints.length - 1].bpHi) {
    const last = breakpoints[breakpoints.length - 1];
    return Math.min(500, Math.round(last.iHi + (cp - last.bpHi)));
  }
  return 0;
}

/**
 * Calculates authentic US EPA Air Quality Index (0-500)
 * from live particulate and gaseous concentrations.
 */
export const calculateRealAqi = (
  components?: Partial<AirPollutionComponents> | null,
  openWeatherAqiTier: number = 2
): AqiDetail => {
  let aqiScore = 0;
  let dominantPollutant = 'PM2.5';

  if (components) {
    const subIndices: { code: string; aqi: number }[] = [];

    if (components.pm2_5 !== undefined) {
      subIndices.push({
        code: 'PM2.5',
        aqi: calculateSubIndex(components.pm2_5, PM25_BREAKPOINTS),
      });
    }

    if (components.pm10 !== undefined) {
      subIndices.push({
        code: 'PM10',
        aqi: calculateSubIndex(components.pm10, PM10_BREAKPOINTS),
      });
    }

    if (components.o3 !== undefined) {
      subIndices.push({
        code: 'O₃',
        aqi: calculateSubIndex(components.o3, O3_BREAKPOINTS),
      });
    }

    if (components.no2 !== undefined) {
      subIndices.push({
        code: 'NO₂',
        aqi: calculateSubIndex(components.no2, NO2_BREAKPOINTS),
      });
    }

    if (components.so2 !== undefined) {
      subIndices.push({
        code: 'SO₂',
        aqi: calculateSubIndex(components.so2, SO2_BREAKPOINTS),
      });
    }

    if (components.co !== undefined) {
      subIndices.push({
        code: 'CO',
        aqi: calculateSubIndex(components.co, CO_BREAKPOINTS),
      });
    }

    // Sort descending by sub-index
    subIndices.sort((a, b) => b.aqi - a.aqi);

    if (subIndices.length > 0 && subIndices[0].aqi > 0) {
      aqiScore = subIndices[0].aqi;
      dominantPollutant = subIndices[0].code;
    }
  }

  // Fallback if components were missing or 0
  if (aqiScore === 0) {
    switch (openWeatherAqiTier) {
      case 1: aqiScore = 25; break;
      case 2: aqiScore = 65; break;
      case 3: aqiScore = 115; break;
      case 4: aqiScore = 165; break;
      case 5: default: aqiScore = 220; break;
    }
  }

  // Determine standard EPA classification category and theme colors
  let category = 'Good';
  let color: string = Colors.green600;
  let description = '';
  let recommendation = '';

  if (aqiScore <= 50) {
    category = 'Good';
    color = Colors.green600; // #54A534
    description = 'Air quality is satisfactory with little or no health risk.';
    recommendation = 'Ideal conditions for outdoor exercises, walks, and ventilation.';
  } else if (aqiScore <= 100) {
    category = 'Moderate';
    color = Colors.olive500; // #B1AA32
    description = 'Air quality is acceptable. Very sensitive individuals may experience mild irritation.';
    recommendation = 'Generally safe outdoors. Sensitive individuals should monitor respiratory comfort.';
  } else if (aqiScore <= 150) {
    category = 'Sensitive Groups';
    color = Colors.orange500; // #F0882C
    description = 'Members of sensitive groups may experience health effects; general public unlikely to be affected.';
    recommendation = 'Sensitive groups should reduce prolonged outdoor exertion and consider wearing masks.';
  } else if (aqiScore <= 200) {
    category = 'Unhealthy';
    color = Colors.orange600; // #D9721A
    description = 'Everyone may begin to experience health effects; sensitive groups may feel serious discomfort.';
    recommendation = 'Avoid prolonged outdoor exertion. Keep windows closed and operate indoor HEPA purifiers.';
  } else if (aqiScore <= 300) {
    category = 'Very Unhealthy';
    color = Colors.orange700; // #B85E10
    description = 'Health alert: Increased risk of respiratory and cardiovascular irritation for entire population.';
    recommendation = 'Remain indoors where possible. Wear N95/FFP2 masks if outdoor travel is mandatory.';
  } else {
    category = 'Hazardous';
    color = Colors.olive700; // #726C16
    description = 'Emergency health warning: Entire population is more likely to be seriously affected.';
    recommendation = 'Avoid all outdoor activity. Keep indoor living areas tightly sealed and filtered.';
  }

  return {
    index: openWeatherAqiTier,
    aqiScore,
    label: `${aqiScore} - ${category}`,
    category,
    color,
    dominantPollutant,
    description,
    recommendation,
  };
};

export const getAqiDetails = (
  openWeatherAqi: number = 1,
  components?: Partial<AirPollutionComponents> | null
): AqiDetail => {
  return calculateRealAqi(components, openWeatherAqi);
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
    if (val <= goodLimit) return { status: 'Good', color: Colors.green600 };
    if (val <= modLimit) return { status: 'Moderate', color: Colors.olive500 };
    if (val <= unhealthyLimit) return { status: 'Unhealthy', color: Colors.orange500 };
    return { status: 'Hazardous', color: Colors.orange700 };
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
