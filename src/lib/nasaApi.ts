// NASA Terra Satellite API Integration for Bangladesh

export const API_CONFIG = {
  nasaApiKey: 'ergBLMygalCMreEXyWzadwomDUdbqppdTtFJTMmO',
  firmsMapKey: '3bf8983f8e11b3ad84c70300281d6008',
  earthdataToken: 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6InNoYWtpaGFzYW4xMDcwIiwiZXhwIjoxNzY0MjAxNTk5LCJpYXQiOjE3NTg5NDUwMzYsImlzcyI6Imh0dHBzOi8vdXJzLmVhcnRoZGF0YS5uYXNhLmdvdiIsImlkZW50aXR5X3Byb3ZpZGVyIjoiZWRsX29wcyIsImFjciI6ImVkbCIsImFzc3VyYW5jZV9sZXZlbCI6M30.1kQCf58ZMBXnxPv5M_hMsKigsTNYy0O0IA43WAEiEDUONst9QmMEqdHBEd3_ciiLKBje2T4DKNQBKQ5WcZWETSjxfBelTyhkyZHt9Jrt9AkNiaJzGgCNmN9jbhJOdQGTZ_YBC7X0PE_wukOuDte5w43qTBbxWLl3dJ-Rel1vhVtis7zqsQ4fwu53Ivxfh-zQFlerJiJRkLOjvp0MHB7VNrezghwIdh3E06bthKoP3l0HOc0iNJzkc9b6IsDRcGuaN-Y1dLavhiHoe3eL9lOADSTMhIOK5dPW00QfsbzK8cdlCF2kO8uSOmz89RwvvQgm3hOnyud-DL0_stkUt1LKqw'
};

export interface Location {
  id: string;
  name: string;
  coordinates: { lat: number; lon: number };
  description: string;
  bbox: string;
  focus: string;
}

export const BANGLADESH_LOCATIONS: Location[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    coordinates: { lat: 23.8103, lon: 90.4125 },
    description: 'Capital city - Urban heat island monitoring',
    bbox: '88.4125,21.8103,92.4125,25.8103',
    focus: 'Urban temperature, air quality, fires'
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    coordinates: { lat: 22.3569, lon: 91.7832 },
    description: 'Port city - Coastal environmental changes',
    bbox: '89.7832,20.3569,93.7832,24.3569',
    focus: 'Coastal erosion, shipping pollution, weather'
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    coordinates: { lat: 24.8949, lon: 91.8687 },
    description: 'Tea region - Vegetation health monitoring',
    bbox: '89.8687,22.8949,93.8687,26.8949',
    focus: 'NDVI, tea plantations, flood risk'
  },
  {
    id: 'khulna',
    name: 'Khulna',
    coordinates: { lat: 22.8456, lon: 89.5403 },
    description: 'Sundarbans gateway - Mangrove forest health',
    bbox: '87.5403,20.8456,91.5403,24.8456',
    focus: 'Mangrove health, sea level, biodiversity'
  }
];

// MODIS - Fire Detection (FIRMS API)
export async function getMODISFires(location: Location, days: number = 7) {
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/json/${API_CONFIG.firmsMapKey}/MODIS_NRT/${location.bbox}/${days}`;
  
  try {
    const response = await fetch(url);
    const fires = await response.json();
    
    if (!Array.isArray(fires)) {
      return { total: 0, highConfidence: 0, avgBrightness: 0, avgFRP: 0, fires: [] };
    }
    
    return {
      total: fires.length,
      highConfidence: fires.filter((f: any) => f.confidence > 80).length,
      avgBrightness: fires.length > 0 ? fires.reduce((sum: number, f: any) => sum + f.brightness, 0) / fires.length : 0,
      avgFRP: fires.length > 0 ? fires.reduce((sum: number, f: any) => sum + (f.frp || 0), 0) / fires.length : 0,
      fires: fires.slice(0, 20).map((f: any) => ({
        lat: f.latitude,
        lon: f.longitude,
        brightness: f.brightness,
        confidence: f.confidence,
        frp: f.frp,
        date: f.acq_date,
        time: f.acq_time
      }))
    };
  } catch (error) {
    console.error('MODIS Fire API Error:', error);
    return { total: 0, highConfidence: 0, avgBrightness: 0, avgFRP: 0, fires: [] };
  }
}

// MODIS Imagery Layers (GIBS)
export function getMODISImageryURL(date: string, layer: string = 'TrueColor') {
  const layerMap: Record<string, string> = {
    TrueColor: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    Temperature: 'MODIS_Terra_Land_Surface_Temp_Day',
    NDVI: 'MODIS_Terra_NDVI_8Day',
    Fires: 'MODIS_Terra_Thermal_Anomalies_All'
  };
  
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerMap[layer]}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
}

// CERES - Energy Balance & Climate (NASA POWER API)
export async function getCERESData(location: Location, startDate: string, endDate: string) {
  const { lat, lon } = location.coordinates;
  
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point`;
  const params = new URLSearchParams({
    parameters: 'ALLSKY_SFC_SW_DWN,ALLSKY_SFC_LW_DWN,CLRSKY_SFC_SW_DWN,T2M,PRECTOTCORR,CLOUD_AMT,RH2M,WS10M',
    community: 'RE',
    longitude: lon.toString(),
    latitude: lat.toString(),
    start: startDate.replace(/-/g, ''),
    end: endDate.replace(/-/g, ''),
    format: 'JSON'
  });
  
  try {
    const response = await fetch(`${url}?${params}`);
    const data = await response.json();
    const parameters = data.properties.parameter;
    
    const getLatest = (param: string) => {
      const values = Object.values(parameters[param] || {});
      return values[values.length - 1] as number || 0;
    };
    
    return {
      solarRadiation: getLatest('ALLSKY_SFC_SW_DWN'),
      clearSkySolar: getLatest('CLRSKY_SFC_SW_DWN'),
      longwaveRadiation: getLatest('ALLSKY_SFC_LW_DWN'),
      temperature: getLatest('T2M'),
      precipitation: getLatest('PRECTOTCORR'),
      cloudCover: getLatest('CLOUD_AMT'),
      humidity: getLatest('RH2M'),
      windSpeed: getLatest('WS10M'),
      energyBalance: getLatest('ALLSKY_SFC_SW_DWN') - getLatest('ALLSKY_SFC_LW_DWN')
    };
  } catch (error) {
    console.error('CERES/POWER API Error:', error);
    return null;
  }
}

// ASTER - Surface Temperature & Elevation
export function getASTERLayers(date: string) {
  return {
    elevation: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/ASTER_GDEM_Color_Shaded_Relief/default/${date}/GoogleMapsCompatible_Level12/{z}/{y}/{x}.png`,
    temperature: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/ASTER_L3_Surface_Kinetic_Temperature_Day/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`
  };
}

// MOPITT - Carbon Monoxide
export function getMOPITTData(date: string) {
  return {
    layerURL: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MOPITT_CO_Monthly_Total_Column_Day/default/${date}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`,
    description: 'Carbon Monoxide levels in atmosphere',
    units: 'molecules/cm²'
  };
}

// MISR - Aerosol & Multi-angle Imagery
export function getMISRLayers(date: string) {
  return {
    trueColor: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MISR_FIRSTRED_RadianceRGB_Natural/default/${date}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.jpg`,
    aerosol: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MISR_Aerosol_Optical_Depth_Avg/default/${date}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`
  };
}

// Fetch ALL Terra data for a location
export async function fetchAllTerraData(locationId: string, date: string) {
  const location = BANGLADESH_LOCATIONS.find(l => l.id === locationId);
  if (!location) throw new Error('Location not found');
  
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - 7);
  const start = startDate.toISOString().split('T')[0];
  
  try {
    const [modisData, ceresData] = await Promise.all([
      getMODISFires(location, 7),
      getCERESData(location, start, date)
    ]);
    
    return {
      location: location.name,
      date,
      modis: modisData,
      ceres: ceresData,
      aster: getASTERLayers(date),
      mopitt: getMOPITTData(date),
      misr: getMISRLayers(date)
    };
  } catch (error) {
    console.error('Error fetching Terra data:', error);
    throw error;
  }
}
