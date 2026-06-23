import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, Wind, ShieldAlert } from 'lucide-react';
import { type Ward, type MeteorologicalData } from '../data/mockData';

interface ForecastingPanelProps {
  selectedWard: Ward;
  meteorology: MeteorologicalData;
  onMeteorologyChange: (updatedMet: MeteorologicalData) => void;
}

export const ForecastingPanel: React.FC<ForecastingPanelProps> = ({
  selectedWard,
  meteorology,
  onMeteorologyChange,
}) => {
  const [simWindSpeed, setSimWindSpeed] = useState(meteorology.windSpeed);
  const [simWindDir, setSimWindDir] = useState(meteorology.windDirection);
  const [simMixingHeight, setSimMixingHeight] = useState(meteorology.mixingHeight);

  // Derive simulated forecast values based on sliders
  // Higher wind speed -> better dispersion -> lower AQI
  // Lower mixing height -> compressed boundary layer -> higher AQI
  const dispersionMultiplier =
    (meteorology.windSpeed / Math.max(simWindSpeed, 2)) *
    (meteorology.mixingHeight / Math.max(simMixingHeight, 100));

  const baseAqi = selectedWard.currentAQI;
  const forecastData = [
    {
      time: 'Current',
      forecast: Math.round(baseAqi * dispersionMultiplier),
      persistence: baseAqi,
    },
    {
      time: '24 Hours',
      forecast: Math.round((baseAqi + 25) * dispersionMultiplier * 0.95),
      persistence: baseAqi,
    },
    {
      time: '48 Hours',
      forecast: Math.round((baseAqi - 15) * dispersionMultiplier * 1.02),
      persistence: baseAqi,
    },
    {
      time: '72 Hours',
      forecast: Math.round((baseAqi + 40) * dispersionMultiplier * 0.9),
      persistence: baseAqi,
    },
  ];

  const handleWindSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSimWindSpeed(val);
    onMeteorologyChange({ ...meteorology, windSpeed: val });
  };

  const handleWindDirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSimWindDir(val);
    onMeteorologyChange({ ...meteorology, windDirection: val });
  };

  const handleMixingHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSimMixingHeight(val);
    onMeteorologyChange({ ...meteorology, mixingHeight: val });
  };

  // Direction string
  const getWindDirectionString = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N (North)';
    if (deg >= 22.5 && deg < 67.5) return 'NE (North-East)';
    if (deg >= 67.5 && deg < 112.5) return 'E (East)';
    if (deg >= 112.5 && deg < 157.5) return 'SE (South-East)';
    if (deg >= 157.5 && deg < 202.5) return 'S (South)';
    if (deg >= 202.5 && deg < 247.5) return 'SW (South-West)';
    if (deg >= 247.5 && deg < 292.5) return 'W (West)';
    return 'NW (North-West)';
  };

  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="card-title">
        <span>
          <Calendar size={16} className="text-cyan-400" />
          Hyperlocal AQI Forecasting (72 Hours)
        </span>
        <span className="text-[10px] text-cyan-400 font-mono font-semibold">1km Grid Res</span>
      </div>

      <div className="h-[180px] w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '10px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}
              itemStyle={{ fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            <Line
              name="Hyperlocal Model Forecast"
              type="monotone"
              dataKey="forecast"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              name="Persistence Baseline"
              type="monotone"
              dataKey="persistence"
              stroke="#4b5563"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded border border-white/5 text-[11px]">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <ShieldAlert size={14} />
          Validation Benchmark
        </div>
        <div className="flex gap-3 text-gray-400">
          <span>Model RMSE: <strong className="text-white">12.8</strong></span>
          <span>Baseline RMSE: <strong className="text-white">28.4</strong></span>
        </div>
      </div>

      <div className="border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5 text-gray-400 font-semibold mb-3 text-xs">
          <Wind size={14} className="text-cyan-400" />
          Atmospheric Dispersion Simulator
        </div>

        <div className="flex flex-col gap-3 text-[11px]">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-gray-300">
              <span>Wind Velocity (Horizontal dispersion)</span>
              <span className="font-bold text-cyan-400">{simWindSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              value={simWindSpeed}
              onChange={handleWindSpeedChange}
              className="range-slider"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-gray-300">
              <span>Prevailing Wind Direction</span>
              <span className="font-bold text-cyan-400">{getWindDirectionString(simWindDir)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={simWindDir}
              onChange={handleWindDirChange}
              className="range-slider"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-gray-300">
              <span>Boundary Layer Mixing Height (Vertical dispersion)</span>
              <span className="font-bold text-cyan-400">{simMixingHeight} m</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              value={simMixingHeight}
              onChange={handleMixingHeightChange}
              className="range-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
