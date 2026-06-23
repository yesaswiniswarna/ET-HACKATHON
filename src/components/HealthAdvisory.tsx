import React, { useState, useEffect } from 'react';
import { Heart, Languages, Landmark } from 'lucide-react';
import { type Ward } from '../data/mockData';

interface HealthAdvisoryProps {
  selectedWard: Ward;
  cityId: string;
}

export const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({ selectedWard, cityId }) => {
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'kn' | 'ta' | 'mr' | 'bn'>('en');

  // Set default language depending on city
  useEffect(() => {
    if (cityId === 'delhi') setActiveLang('hi');
    else if (cityId === 'bengaluru') setActiveLang('kn');
    else if (cityId === 'chennai') setActiveLang('ta');
    else if (cityId === 'mumbai') setActiveLang('mr');
    else if (cityId === 'kolkata') setActiveLang('bn');
    else setActiveLang('en');
  }, [cityId]);

  const { vulnerability, advisories, currentAQI } = selectedWard;

  // Language display name
  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en': return 'English';
      case 'hi': return 'हिन्दी';
      case 'kn': return 'ಕನ್ನಡ';
      case 'ta': return 'தமிழ்';
      case 'mr': return 'मराठी';
      case 'bn': return 'বাংলা';
      default: return code.toUpperCase();
    }
  };

  const getAdvisoryText = () => {
    if (activeLang === 'en') return advisories.en;
    if (activeLang === 'hi') return advisories.hi || advisories.en;
    if (activeLang === 'kn') return advisories.kn || advisories.en;
    if (activeLang === 'ta') return advisories.ta || advisories.en;
    if (activeLang === 'mr') return advisories.mr || advisories.en;
    if (activeLang === 'bn') return advisories.bn || advisories.en;
    return advisories.en;
  };

  const getSeverityLabel = (aqi: number) => {
    if (aqi > 400) return { label: 'Severe Alert', color: 'text-red-500 bg-red-950/40 border-red-900/50' };
    if (aqi > 300) return { label: 'Very Poor Health Risk', color: 'text-red-400 bg-red-950/45 border-red-900/40' };
    if (aqi > 200) return { label: 'Poor Health Risk', color: 'text-orange-400 bg-orange-950/30 border-orange-900/50' };
    if (aqi > 100) return { label: 'Moderate Sensitive Alert', color: 'text-yellow-400 bg-yellow-950/30 border-yellow-900/50' };
    return { label: 'Satisfactory / Good', color: 'text-green-400 bg-green-950/30 border-green-900/50' };
  };

  const severity = getSeverityLabel(currentAQI);

  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="card-title">
        <span>
          <Heart size={16} className="text-cyan-400" />
          Citizen Health Risk Advisory
        </span>
        <span className="text-[10px] text-cyan-400 font-mono font-semibold">Localized Alert</span>
      </div>

      {/* Language Selector */}
      <div className="flex justify-between items-center bg-slate-950/20 p-2 rounded-lg border border-white/5">
        <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
          <Languages size={12} /> Regional Language Broadcast
        </span>
        <div className="lang-row">
          {(['en', 'hi', 'kn', 'ta', 'mr', 'bn'] as const).map((lang) => {
            // Only show languages relevant to the city
            const isRelevant = 
              lang === 'en' ||
              (cityId === 'delhi' && lang === 'hi') ||
              (cityId === 'mumbai' && (lang === 'mr' || lang === 'hi')) ||
              (cityId === 'bengaluru' && lang === 'kn') ||
              (cityId === 'chennai' && lang === 'ta') ||
              (cityId === 'kolkata' && lang === 'bn');

            if (!isRelevant) return null;

            return (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`lang-btn ${activeLang === lang ? 'active' : ''}`}
              >
                {getLanguageName(lang)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory Content Box */}
      <div className={`health-alert-box ${currentAQI > 250 ? 'critical' : ''} p-3 rounded-r-lg border-l-4 bg-slate-900/40 border-slate-800`}>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-400">Personalized Exposure Warning</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${severity.color}`}>
            {severity.label}
          </span>
        </div>
        <p className="text-xs text-white leading-relaxed font-medium">
          {getAdvisoryText()}
        </p>
      </div>

      {/* Vulnerability Indexes */}
      <div className="border-t border-white/5 pt-3">
        <div className="text-xs font-semibold text-gray-400 mb-2.5 flex items-center gap-1.5">
          <Landmark size={14} className="text-cyan-400" />
          Grid Vulnerability Registry
        </div>

        <div className="flex flex-col gap-2">
          <div className="vuln-row">
            <span className="text-gray-400">Schools inside ward grid</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{vulnerability.schools}</span>
              <div className="vuln-bar-bg">
                <div className="vuln-bar-fill" style={{ width: `${Math.min(vulnerability.schools * 5, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="vuln-row">
            <span className="text-gray-400">Hospitals inside ward grid</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{vulnerability.hospitals}</span>
              <div className="vuln-bar-bg">
                <div className="vuln-bar-fill" style={{ width: `${Math.min(vulnerability.hospitals * 15, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="vuln-row">
            <span className="text-gray-400">Outdoor Worker Density index</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{vulnerability.outdoorWorkersDensity}/10</span>
              <div className="vuln-bar-bg">
                <div className="vuln-bar-fill bg-rose-400" style={{ width: `${vulnerability.outdoorWorkersDensity * 10}%` }}></div>
              </div>
            </div>
          </div>

          <div className="vuln-row">
            <span className="text-gray-400">High-risk population count</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{vulnerability.vulnerablePopulation}k</span>
              <div className="vuln-bar-bg">
                <div className="vuln-bar-fill" style={{ width: `${Math.min(vulnerability.vulnerablePopulation * 1.5, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
