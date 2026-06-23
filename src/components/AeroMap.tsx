import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type CityData } from '../data/mockData';

interface AeroMapProps {
  cityData: CityData;
  selectedWardId: string;
  onSelectWard: (wardId: string) => void;
  activeLayer: 'standard' | 'forecastGrid' | 'hotspots';
  activeInterventions: { id: string; wardId: string; status: string; actionType: string }[];
  filters: {
    traffic: boolean;
    industries: boolean;
    construction: boolean;
    hospitals: boolean;
    schools: boolean;
  };
  citizenReports: {
    id: string;
    wardId: string;
    type: string;
    locationName: string;
    coordinates: [number, number];
    details: string;
    timestamp: string;
  }[];
}

// Custom hook to fly the map view to the selected city center
const MapRefocus: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Function to return AQI colors
const getAqiColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981'; // Good - Green
  if (aqi <= 100) return '#84cc16'; // Satisfactory - Light Green
  if (aqi <= 200) return '#f59e0b'; // Moderate - Orange
  if (aqi <= 300) return '#ef4444'; // Poor - Red
  if (aqi <= 400) return '#b91c1c'; // Very Poor - Dark Red
  return '#7f1d1d'; // Severe - Maroon
};

// Creating customized icons to bypass default React asset bundling problems
const createStationIcon = (aqi: number) => {
  const color = getAqiColor(aqi);
  return L.divIcon({
    className: 'custom-station-icon',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #0f172a;
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${color}, inset 0 0 5px ${color};
      ">
        <span style="color: #fff; font-size: 8px; font-weight: bold; font-family: monospace;">${aqi}</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createThermalIcon = (_intensity: number) => {
  return L.divIcon({
    className: 'custom-thermal-icon',
    html: `
      <div style="position: relative; width: 30px; height: 30px;">
        <div style="
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.4);
          animation: pulse-ring 1.5s infinite;
        "></div>
        <div style="
          position: absolute;
          top: 5px;
          left: 5px;
          width: 20px;
          height: 20px;
          background: #ef4444;
          border: 1px solid #fee2e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px #ef4444;
          z-index: 10;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const createInterventionIcon = (actionType: string) => {
  let color = '#06b6d4'; // Traffic - Cyan
  let iconHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v11c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M13 18H7"/>
    </svg>
  `; // Default Truck

  if (actionType.includes('Sprinkler')) {
    color = '#38bdf8'; // Sprinkler - Sky Blue
    iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    `;
  } else if (actionType.includes('Emission') || actionType.includes('Caps')) {
    color = '#a78bfa'; // Industry Audit - Purple
    iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V9l6 4-6 4z"/>
      </svg>
    `;
  }

  return L.divIcon({
    className: 'custom-intervention-icon',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.2;
          animation: pulse-ring 1.2s infinite;
        "></div>
        <div style="
          width: 22px;
          height: 22px;
          background: ${color};
          border: 1px solid #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px ${color};
          z-index: 10;
        ">
          ${iconHtml}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

// Create custom filter markers
const createFilterIcon = (type: 'traffic' | 'industries' | 'construction' | 'hospitals' | 'schools') => {
  let color = '#38bdf8';
  let svgHtml = '';

  if (type === 'traffic') {
    color = '#ef4444'; // Red car
    svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v11c0 .6.4 1 1 1h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`;
  } else if (type === 'industries') {
    color = '#c084fc'; // Purple stack
    svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><path d="M2 20h20M5 17V3l6 4v10M11 17V7l6 4v6M17 17v-6l4 2v4"/></svg>`;
  } else if (type === 'construction') {
    color = '#f59e0b'; // Amber crane
    svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><path d="M21 7h-6M18 4v3M12 7H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h7M16 12v5M16 17h4"/></svg>`;
  } else if (type === 'hospitals') {
    color = '#10b981'; // Green cross
    svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><path d="M12 5v14M5 12h14"/></svg>`;
  } else if (type === 'schools') {
    color = '#06b6d4'; // Cyan cap
    svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`;
  }

  return L.divIcon({
    className: `custom-filter-${type}-icon`,
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: ${color};
        border: 1px solid #fff;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      ">
        ${svgHtml}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Create custom citizen reported icon
const createReportIcon = (_type: string) => {
  let color = '#f97316'; // Orange alert for citizen reports
  return L.divIcon({
    className: 'custom-citizen-report-icon',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background: ${color}; opacity: 0.3; animation: pulse-ring 1.5s infinite;"></div>
        <div style="
          width: 18px;
          height: 18px;
          background: #000;
          border: 2px solid ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px ${color};
          z-index: 10;
        ">
          <span style="color: ${color}; font-size: 10px; font-weight: 900;">!</span>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const AeroMap: React.FC<AeroMapProps> = ({
  cityData,
  selectedWardId,
  onSelectWard,
  activeLayer,
  activeInterventions,
  filters,
  citizenReports,
}) => {
  const center = cityData.center;

  // Generate dynamic locations around center for toggle overlays
  const trafficLocs: [number, number][] = [
    [center[0] + 0.008, center[1] - 0.012],
    [center[0] - 0.005, center[1] + 0.014],
    [center[0] + 0.015, center[1] + 0.005],
  ];

  const industryLocs: [number, number][] = [
    [center[0] - 0.018, center[1] - 0.015],
    [center[0] + 0.022, center[1] + 0.018],
  ];

  const constructionLocs: [number, number][] = [
    [center[0] + 0.004, center[1] + 0.022],
    [center[0] - 0.015, center[1] - 0.005],
  ];

  const hospitalLocs: [number, number][] = [
    [center[0] + 0.003, center[1] - 0.005],
    [center[0] - 0.012, center[1] + 0.012],
  ];

  const schoolLocs: [number, number][] = [
    [center[0] - 0.007, center[1] - 0.018],
    [center[0] + 0.011, center[1] + 0.013],
    [center[0] + 0.018, center[1] - 0.008],
  ];

  return (
    <div className="map-container">
      <MapContainer
        center={cityData.center}
        zoom={cityData.zoom}
        zoomControl={true}
        className="map-element"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapRefocus center={cityData.center} zoom={cityData.zoom} />

        {/* Layer 1: Ward Boundaries Polygons */}
        {activeLayer !== 'forecastGrid' &&
          cityData.wards.map((ward) => {
            const isSelected = ward.id === selectedWardId;
            const aqiColor = getAqiColor(ward.currentAQI);

            return (
              <Polygon
                key={ward.id}
                positions={ward.coordinates}
                pathOptions={{
                  fillColor: aqiColor,
                  fillOpacity: isSelected ? 0.6 : 0.35,
                  color: isSelected ? '#06b6d4' : '#1e293b',
                  weight: isSelected ? 3 : 1.5,
                  dashArray: isSelected ? '5, 5' : undefined,
                }}
                eventHandlers={{
                  click: () => onSelectWard(ward.id),
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs p-1 font-sans">
                    <strong className="text-white block font-semibold">{ward.name}</strong>
                    <span className="text-gray-400">AQI: </span>
                    <strong style={{ color: aqiColor }}>{ward.currentAQI}</strong>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

        {/* Layer 2: 1km Hyperlocal Grid Overlay */}
        {activeLayer === 'forecastGrid' &&
          cityData.gridForecast.map((cell) => {
            const color = getAqiColor(cell.aqi);
            return (
              <Polygon
                key={cell.id}
                positions={cell.coordinates}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.45,
                  color: 'rgba(255,255,255,0.04)',
                  weight: 0.8,
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs font-sans p-1">
                    <span className="text-gray-400">1km Grid Forecast: </span>
                    <strong style={{ color: color }}>AQI {cell.aqi}</strong>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

        {/* Layer 3: CAAQMS Station Markers */}
        {cityData.stations.map((st) => (
          <Marker key={st.id} position={st.coordinates} icon={createStationIcon(st.liveAQI)}>
            <Popup>
              <div className="text-xs font-sans leading-relaxed">
                <strong className="text-white text-[13px] font-semibold block mb-1">{st.name}</strong>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Station AQI:</span>
                  <strong style={{ color: getAqiColor(st.liveAQI) }}>{st.liveAQI}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Dominant Pollutant:</span>
                  <span className="text-cyan-400 font-bold">{st.dominantPollutant}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Layer 4: Satellite Thermal Anomalies (Fires) */}
        {(activeLayer === 'hotspots' || activeLayer === 'standard') &&
          cityData.thermalAnomalies.map((ta) => (
            <Marker key={ta.id} position={ta.coordinates} icon={createThermalIcon(ta.intensity)}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="text-rose-400 text-[12px] font-semibold block mb-1">
                    🔥 Thermal Anomaly Detected
                  </strong>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Anomaly Type:</span>
                    <span className="text-white font-bold">{ta.type}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">FRP (Radiative Power):</span>
                    <span className="text-rose-400 font-bold">{ta.intensity} MW</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Time Reported:</span>
                    <span className="text-gray-400">{ta.timestamp}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Layer 5: Active Intervention Dispatch Force Indicators */}
        {activeInterventions
          .filter((act) => act.status === 'Active')
          .map((act) => {
            const ward = cityData.wards.find((w) => w.id === act.wardId);
            if (!ward) return null;

            const dispatchCoord: [number, number] = [
              ward.center[0] + 0.005,
              ward.center[1] - 0.004,
            ];

            return (
              <Marker key={act.id} position={dispatchCoord} icon={createInterventionIcon(act.actionType)}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-cyan-400 text-[12px] font-semibold block mb-1">
                      ⚡ Enforcement Active
                    </strong>
                    <div>Action: <span className="text-white font-semibold">{act.actionType}</span></div>
                    <div>Target Ward: <span className="text-white font-semibold">{ward.name}</span></div>
                    <div className="text-green-400 font-bold mt-1 animate-pulse">Sprinklers/Diverters deploying...</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Layer 6: Toggle Filters Overlays */}
        {filters.traffic &&
          trafficLocs.map((loc, idx) => (
            <Marker key={`traffic_${idx}`} position={loc} icon={createFilterIcon('traffic')}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="text-red-400 block font-semibold">🚗 High Traffic Density</strong>
                  <span className="text-gray-400">Peak hour tailpipe emission build-up.</span>
                </div>
              </Popup>
            </Marker>
          ))}

        {filters.industries &&
          industryLocs.map((loc, idx) => (
            <Marker key={`ind_${idx}`} position={loc} icon={createFilterIcon('industries')}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="text-purple-400 block font-semibold">🏭 Registered Industry Chimney</strong>
                  <span className="text-gray-400">Continuous emissions audit in effect.</span>
                </div>
              </Popup>
            </Marker>
          ))}

        {filters.construction &&
          constructionLocs.map((loc, idx) => (
            <Marker key={`const_${idx}`} position={loc} icon={createFilterIcon('construction')}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="text-amber-400 block font-semibold">🚧 Construction Site</strong>
                  <span className="text-gray-400">Demolition and dust excavation active.</span>
                </div>
              </Popup>
            </Marker>
          ))}

        {filters.hospitals &&
          hospitalLocs.map((loc, idx) => (
            <Marker key={`hosp_${idx}`} position={loc} icon={createFilterIcon('hospitals')}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="text-emerald-400 block font-semibold">🏥 Healthcare Facility</strong>
                  <span className="text-gray-400">Sensitive health protection zone.</span>
                </div>
              </Popup>
            </Marker>
          ))}

        {filters.schools &&
          schoolLocs.map((loc, idx) => (
            <Marker key={`sch_${idx}`} position={loc} icon={createFilterIcon('schools')}>
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="text-cyan-400 block font-semibold">🏫 School / Institute</strong>
                  <span className="text-gray-400">Children exposure advisory boundary.</span>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Layer 7: Citizen Reported Incidents */}
        {citizenReports.map((rep) => (
          <Marker key={rep.id} position={rep.coordinates} icon={createReportIcon(rep.type)}>
            <Popup>
              <div className="text-xs font-sans">
                <strong className="text-orange-400 text-[12px] font-bold block mb-1">
                  🚨 Citizen Report Filed
                </strong>
                <div>Type: <span className="text-white font-semibold">{rep.type}</span></div>
                <div>Location: <span className="text-white font-semibold">{rep.locationName}</span></div>
                <div className="text-gray-300 italic mt-1 bg-slate-900 p-1.5 rounded">{rep.details}</div>
                <div className="text-gray-500 text-[10px] mt-1">Submitted: {rep.timestamp}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
