import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Columns, Award } from 'lucide-react';
import { COMPARATIVE_METRICS } from '../data/mockData';

export const ComparativeAnalytics: React.FC = () => {
  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="card-title">
        <span>
          <Columns size={16} className="text-cyan-400" />
          Multi-City Comparative Intelligence
        </span>
        <span className="text-[10px] text-cyan-400 font-mono font-semibold">National Metros</span>
      </div>

      <div className="h-[180px] w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={COMPARATIVE_METRICS.averageAqi} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="city" stroke="#6b7280" style={{ fontSize: '10px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}
              itemStyle={{ fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            <Bar name="Avg AQI" dataKey="aqi" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar name="PM2.5" dataKey="pm25" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar name="NO2" dataKey="no2" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-white/5 pt-3">
        <div className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
          <Award size={14} className="text-cyan-400" />
          Intervention Efficacy Ledger (Cross-City Registry)
        </div>

        <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1 scrollable-list">
          {COMPARATIVE_METRICS.interventionEffectiveness.map((item) => (
            <div key={item.name} className="p-2.5 bg-slate-900/40 rounded-lg border border-white/5 flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{item.name}</span>
                <span className="px-2 py-0.5 bg-cyan-950/40 text-cyan-400 border border-cyan-900/40 rounded-full font-bold text-[9px]">
                  Score: {item.rating}%
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              <div className="grid grid-cols-3 gap-2 text-[9px] text-gray-500 font-mono mt-0.5 border-t border-white/[0.02] pt-1">
                <span>Cost: <strong className="text-gray-300">{item.cost}</strong></span>
                <span>Lag: <strong className="text-gray-300">{item.delay}</strong></span>
                <span>Type: <strong className="text-gray-300">{item.impact}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
