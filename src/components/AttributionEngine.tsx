import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ShieldCheck, BarChart3, TrendingUp } from 'lucide-react';
import { type Ward } from '../data/mockData';

interface AttributionEngineProps {
  selectedWard: Ward;
}

const COLORS = ['#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6', '#6b7280'];

export const AttributionEngine: React.FC<AttributionEngineProps> = ({ selectedWard }) => {
  const { vehicular, industrial, constructionDust, biomassBurning, domesticOthers, confidence } =
    selectedWard.sourceAttribution;

  const data = [
    { name: 'Vehicular', value: vehicular },
    { name: 'Industrial', value: industrial },
    { name: 'Construction Dust', value: constructionDust },
    { name: 'Biomass Burning', value: biomassBurning },
    { name: 'Domestic / Others', value: domesticOthers },
  ];

  return (
    <div className="glass-card flex flex-col gap-3">
      <div className="card-title">
        <span>
          <BarChart3 size={16} className="text-cyan-400" />
          Pollution Source Attribution
        </span>
        <div className="flex items-center gap-1 text-[11px] text-green-400 font-semibold bg-green-950/40 px-2 py-0.5 rounded-full border border-green-900/50">
          <ShieldCheck size={12} />
          {confidence}% Conf
        </div>
      </div>

      <div className="h-[180px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-1.5 mt-1 text-[11px]">
        {data.map((item, index) => (
          <div key={item.name} className="flex justify-between items-center bg-slate-900/30 p-1.5 rounded border border-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[index] }}></span>
              <span className="text-gray-300">{item.name}</span>
            </div>
            <span className="font-bold text-white">{item.value}%</span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 pt-3 mt-1 text-xs">
        <div className="flex items-center gap-1.5 text-gray-400 font-semibold mb-2">
          <TrendingUp size={14} className="text-cyan-400" />
          Geospatial Co-factors (Attribution Signatures)
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-900/50 p-2 rounded border border-white/5">
            <span className="text-gray-500 block">Traffic Flow Density</span>
            <span className="text-white font-bold">
              {vehicular > 50 ? 'Severe Gridlock (8.9/10)' : vehicular > 30 ? 'Moderate (5.6/10)' : 'Fluid (2.8/10)'}
            </span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border border-white/5">
            <span className="text-gray-500 block">Construction Permits</span>
            <span className="text-white font-bold">
              {constructionDust > 30 ? '4 Active Wreckings' : constructionDust > 15 ? '1 Major Site' : '0 Active Sites'}
            </span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border border-white/5 col-span-2">
            <span className="text-gray-500 block">Industrial Stack Count</span>
            <span className="text-white font-bold">
              {industrial > 40 ? '6 Registered Smelters / Heat Stacks' : industrial > 20 ? '2 Light Workshops' : 'No industrial vents in zone'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
