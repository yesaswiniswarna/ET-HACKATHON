import React from 'react';
import { Shield, MapPin, CheckCircle, Clock, Zap, UserCheck } from 'lucide-react';
import { type Ward } from '../data/mockData';

interface EnforcementAction {
  id: string;
  wardName: string;
  actionType: string;
  timestamp: string;
  status: 'Pending' | 'Active' | 'Resolved';
  responseTimeMin: number;
}

interface EnforcementIntelligenceProps {
  wards: Ward[];
  selectedWard: Ward;
  onExecuteAction: (wardId: string, actionType: string) => void;
  activeInterventions: EnforcementAction[];
}

export const EnforcementIntelligence: React.FC<EnforcementIntelligenceProps> = ({
  wards,
  selectedWard,
  onExecuteAction,
  activeInterventions,
}) => {
  // Sort wards by highest AQI to rank the hotspots
  const hotspots = [...wards].sort((a, b) => b.currentAQI - a.currentAQI);

  // Recommendations based on selected ward's major sources
  const getInterventionRecommendation = (w: Ward) => {
    const { vehicular, industrial, constructionDust, biomassBurning } = w.sourceAttribution;
    const maxVal = Math.max(vehicular, industrial, constructionDust, biomassBurning);
    
    if (maxVal === vehicular) {
      return {
        action: 'Dynamic Traffic Diversion Grid',
        authority: 'Municipal Traffic Control',
        impact: 'Est. PM2.5 reduction: 18%',
        type: 'Traffic Restrictions (Odd-Even)',
      };
    }
    if (maxVal === industrial) {
      return {
        action: 'Emission Compliance Inspection Stack Audit',
        authority: 'State Pollution Control Board',
        impact: 'Est. SO2/NO2 reduction: 25%',
        type: 'Industrial Emission Caps',
      };
    }
    if (maxVal === constructionDust) {
      return {
        action: 'Smog-Gun Spray & Dust Suppression Sweep',
        authority: 'Municipal Ward Engineering',
        impact: 'Est. PM10 reduction: 30%',
        type: 'Water Sprinklers',
      };
    }
    // Biomass Burning
    return {
      action: 'Crop Bio-decomposer Subsidy Grant',
      authority: 'Agricultural Department Division',
      impact: 'Est. Smoke Plume reduction: 45%',
      type: 'Stubble Burn Subsidies',
    };
  };

  const currentRec = getInterventionRecommendation(selectedWard);

  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="card-title">
        <span>
          <Shield size={16} className="text-cyan-400" />
          Enforcement & Intervention Center
        </span>
        <span className="text-[10px] text-rose-400 font-semibold bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-900/50 flex items-center gap-1 animate-pulse">
          <Zap size={10} /> Smart Priority
        </span>
      </div>

      {/* Intervention Performance Metric */}
      <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 flex justify-between items-center text-xs">
        <div>
          <div className="text-gray-400 font-semibold flex items-center gap-1">
            <Clock size={12} className="text-rose-400" /> Signal-to-Intervention
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">Response latency reduction</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-rose-400">18.5 Min Avg</div>
          <div className="text-[9px] text-green-400 font-semibold">▼ 84.5% vs CPCB baseline</div>
        </div>
      </div>

      {/* Target Action Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">AI Recommendation for {selectedWard.name}</span>
        <h4 className="text-sm font-semibold text-white">{currentRec.action}</h4>
        <div className="flex flex-col gap-1 text-[11px] text-gray-400">
          <span>Authority: <strong className="text-gray-300">{currentRec.authority}</strong></span>
          <span>Projected Impact: <strong className="text-green-400">{currentRec.impact}</strong></span>
        </div>
        <button
          onClick={() => onExecuteAction(selectedWard.id, currentRec.type)}
          className="action-btn w-full mt-1.5 py-2 text-xs flex items-center gap-1 justify-center font-bold"
        >
          <UserCheck size={14} /> Dispatch Intervention Force
        </button>
      </div>

      {/* Hotspot Priority list */}
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
          <MapPin size={14} className="text-rose-400" />
          Hotspot Urgency Index
        </div>
        <div className="flex flex-col gap-1.5">
          {hotspots.slice(0, 3).map((w, i) => (
            <div key={w.id} className="flex justify-between items-center p-2 bg-slate-900/30 rounded border border-white/[0.02] text-[11px]">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  i === 0 ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50' : 'bg-slate-800 text-gray-400'
                }`}>
                  {i + 1}
                </span>
                <div>
                  <span className="text-white font-medium block">{w.name}</span>
                  <span className="text-[9px] text-gray-500">
                    Primary: {Object.entries(w.sourceAttribution).sort((a,b) => b[1] - a[1])[0][0]}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-white block">AQI {w.currentAQI}</span>
                <span className={`text-[9px] font-bold ${w.currentAQI > 300 ? 'text-red-400' : 'text-amber-400'}`}>
                  {w.currentAQI > 300 ? 'Severe Alert' : 'Poor Risk'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions logs */}
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
          <CheckCircle size={14} className="text-green-400" />
          Live Intervention Dispatch Logs
        </div>
        <div className="enforcement-log flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
          {activeInterventions.length === 0 ? (
            <div className="text-[11px] text-gray-500 italic text-center py-4">
              No active dispatches. Select a ward and deploy enforcement.
            </div>
          ) : (
            [...activeInterventions].reverse().map((act) => (
              <div key={act.id} className="log-item p-2 bg-slate-950/60 rounded border border-white/5 flex justify-between items-center text-[10px]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-white font-medium">{act.actionType}</span>
                  <span className="text-gray-500">Ward: {act.wardName} • {act.timestamp}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`log-status ${act.status.toLowerCase()}`}>{act.status}</span>
                  {act.status === 'Resolved' && (
                    <span className="text-green-400 text-[9px] font-mono">Response: {act.responseTimeMin}m</span>
                  )}
                  {act.status === 'Active' && (
                    <span className="text-cyan-400 text-[9px] font-mono animate-pulse">In Progress</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
