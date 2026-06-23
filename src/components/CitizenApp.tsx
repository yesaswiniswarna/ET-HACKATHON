import React, { useState, useEffect } from 'react';
import { Home, Calendar, Heart, MapPin, AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import { type Ward } from '../data/mockData';

interface CitizenAppProps {
  currentCityName: string;
  wards: Ward[];
  selectedWardId: string;
  onSelectWard: (wardId: string) => void;
  onNewReportSubmitted: () => void;
  onClose?: () => void;
}

export const CitizenApp: React.FC<CitizenAppProps> = ({
  currentCityName,
  wards,
  selectedWardId,
  onSelectWard,
  onNewReportSubmitted,
  onClose,
}) => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'forecast' | 'health' | 'map' | 'report'>('home');
  const [selectedWard, setSelectedWard] = useState<Ward>(
    wards.find((w) => w.id === selectedWardId) || wards[0]
  );

  // Selected Language for Translation
  const [selectedLang, setSelectedLang] = useState<string>('english');

  // Pollution report state
  const [reportType, setReportType] = useState<string>('Waste Burning');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [photoSelected, setPhotoSelected] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  const [reportLoading, setReportLoading] = useState<boolean>(false);

  useEffect(() => {
    const activeWard = wards.find((w) => w.id === selectedWardId) || wards[0];
    setSelectedWard(activeWard);
  }, [selectedWardId, wards]);

  // Translate Health Advisories statically to support instant offline translation rendering
  const getTranslation = (lang: string, wardName: string, aqi: number) => {
    if (lang === 'hindi') {
      return `${wardName} में वायु गुणवत्ता खराब (AQI ${aqi}) है। बाहर जोरदार व्यायाम से बचें। बाहर निकलने पर N95/KN95 मास्क पहनें। बच्चों और बुजुर्गों का विशेष ध्यान रखें।`;
    }
    if (lang === 'telugu') {
      return `${currentCityName}, ${wardName} నివాసితులారా! గాలి కాలుష్యం (AQI ${aqi}) చాలా ఎక్కువగా ఉంది. N95 మాస్కులు ధరించండి. పిల్లలు, వృద్ధులు బయటి కార్యకలాపాలు తగ్గించండి.`;
    }
    if (lang === 'tamil') {
      return `${wardName} பகுதியில் காற்று தரம் மோசமாக உள்ளது (AQI ${aqi}). வெளியில் செல்வதை தவிர்க்கவும். N95 முகக்கவசம் அணியவும். குழந்தைகள் மற்றும் முதியவர்கள் எச்சரிக்கையாக இருக்கவும்.`;
    }
    if (lang === 'kannada') {
      return `${wardName} ನಲ್ಲಿ ವಾಯು ಗುಣಮಟ್ಟವು ಹದಗೆಟ್ಟಿದೆ (AQI ${aqi}). ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ಮಿತಿಗೊಳಿಸಿ. N95 ಮಾಸ್ಕ್ ಧರಿಸಿ. ಮಕ್ಕಳು ಮತ್ತು ವೃದ್ಧರು ಜಾಗರೂಕರಾಗಿರಿ.`;
    }
    if (lang === 'bengali') {
      return `${wardName}-এ বায়ুর গুণমান খারাপ (AQI ${aqi})। বাইরের কার্যকলাপ সীমিত করুন। N95 মাস্ক ব্যবহার করুন। শিশু এবং বয়স্করা সতর্ক থাকুন।`;
    }
    return `${wardName} air quality is currently poor (AQI ${aqi}). Refrain from strenuous outdoor workouts. Ensure children and elderly avoid long exposure. Wear N95 respirator masks if traveling.`;
  };

  // Submit pollution report to Agent 5 / CPCB Control Room
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;

    setReportLoading(true);
    
    // Shift slightly off ward center coordinates for mapping
    const reportCoords: [number, number] = [
      selectedWard.center[0] + (Math.random() - 0.5) * 0.012,
      selectedWard.center[1] + (Math.random() - 0.5) * 0.012
    ];

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardId: selectedWard.id,
          type: reportType,
          locationName: selectedWard.name,
          coordinates: reportCoords,
          details: reportDetails,
          photo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
        }),
      });
      
      if (response.ok) {
        setReportSuccess(true);
        onNewReportSubmitted();
        // Clear fields
        setReportDetails('');
        setPhotoSelected(false);
        setTimeout(() => setReportSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Network issue. Submission simulation failed.');
    } finally {
      setReportLoading(false);
    }
  };

  const getAqiText = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 200) return 'Moderate';
    if (aqi <= 300) return 'Poor';
    if (aqi <= 400) return 'Very Poor';
    return 'Severe';
  };

  return (
    <div className="phone-mockup flex flex-col select-none">
      {/* Notch and status bar */}
      <div className="phone-status-bar">
        <div className="phone-notch"></div>
        <div className="flex justify-between w-full px-5 text-[9px] text-gray-400 font-mono mt-1">
          <span>4:21 PM</span>
          <div className="flex gap-1.5">
            <span>5G</span>
            <span>🔋 98%</span>
          </div>
        </div>
      </div>

      {/* Citizen app body header */}
      <div className="phone-app-header">
        <div className="flex items-center">
          <span className="phone-brand-title">AeroGuard</span>
          <span className="phone-brand-badge">CITIZEN</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="phone-close-btn">
            Close
          </button>
        )}
      </div>

      {/* Screen view content */}
      <div className="phone-screen-body">
        {currentScreen === 'home' && (
          <>
            {/* CURRENT LOCATION */}
            <div className="phone-location-section">
              <span className="phone-location-label">CURRENT LOCATION</span>
              <div className="phone-location-row">
                <span className="phone-location-name">{selectedWard.name}</span>
                <span className="phone-location-badge">
                  {getAqiText(selectedWard.currentAQI)}
                </span>
              </div>
            </div>

            {/* AQI Score Card */}
            <div className="phone-aqi-card">
              <div className="phone-aqi-row">
                <span className="phone-aqi-val">{selectedWard.currentAQI}</span>
                <span className="phone-aqi-lbl">AQI</span>
              </div>
              <span className="phone-aqi-desc">Refreshed: Live updates from municipal sensors.</span>
            </div>

            {/* Health warnings summary card */}
            <div className="phone-advisory-card">
              <div className="phone-advisory-header">
                <span className="phone-advisory-title">
                  <Heart size={10} /> HEALTH ADVISORY
                </span>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="phone-advisory-select"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi (हिन्दी)</option>
                  <option value="telugu">Telugu (తెలుగు)</option>
                  <option value="tamil">Tamil (தமிழ்)</option>
                  <option value="kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="bengali">Bengali (বাংলা)</option>
                </select>
              </div>

              <div className="phone-advisory-text">
                {getTranslation(selectedLang, selectedWard.name, selectedWard.currentAQI)}
              </div>
            </div>

            {/* Quick action shortcuts */}
            <div className="phone-shortcuts-grid">
              <button onClick={() => setCurrentScreen('health')} className="phone-shortcut-btn">
                <Heart size={18} className="text-rose-400" />
                <span className="phone-shortcut-lbl">AI Health Advisor</span>
              </button>
              <button onClick={() => setCurrentScreen('report')} className="phone-shortcut-btn">
                <AlertTriangle size={18} className="text-amber-400" />
                <span className="phone-shortcut-lbl">Report Pollution</span>
              </button>
            </div>
          </>
        )}

        {currentScreen === 'forecast' && (
          <>
            <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-cyan-400" />
              Multi-Day Predictive Trends
            </h3>
            <div className="phone-hotspot-list">
              <div className="phone-forecast-row">
                <div className="phone-forecast-info">
                  <span className="phone-forecast-time">Tomorrow (24h)</span>
                  <span className="phone-forecast-label">Dispersion Pattern</span>
                </div>
                <span className="phone-forecast-value text-rose-400">AQI {Math.round(selectedWard.currentAQI * 1.05)}</span>
              </div>
              <div className="phone-forecast-row">
                <div className="phone-forecast-info">
                  <span className="phone-forecast-time">2 Days Later (48h)</span>
                  <span className="phone-forecast-label">Atmospheric Dispersion</span>
                </div>
                <span className="phone-forecast-value text-amber-400">AQI {Math.round(selectedWard.currentAQI * 0.95)}</span>
              </div>
              <div className="phone-forecast-row">
                <div className="phone-forecast-info">
                  <span className="phone-forecast-time">3 Days Later (72h)</span>
                  <span className="phone-forecast-label">Mixing Height Growth</span>
                </div>
                <span className="phone-forecast-value text-emerald-400">AQI {Math.round(selectedWard.currentAQI * 0.88)}</span>
              </div>
            </div>
          </>
        )}

        {currentScreen === 'health' && (
          <>
            <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
              <Heart size={14} className="text-rose-400" />
              Personalized AI Advisor (Agent 4)
            </h3>
            <div className="phone-advisory-card">
              <div className="phone-advisory-header">
                <span className="phone-advisory-title">ADVISOR DIAGNOSTICS</span>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="phone-advisory-select"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi (हिन्दी)</option>
                  <option value="telugu">Telugu (తెలుగు)</option>
                  <option value="tamil">Tamil (தமிழ்)</option>
                  <option value="kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="bengali">Bengali (বাংলা)</option>
                </select>
              </div>
              <div className="phone-advisory-text">
                {getTranslation(selectedLang, selectedWard.name, selectedWard.currentAQI)}
              </div>
            </div>
          </>
        )}

        {currentScreen === 'map' && (
          <>
            <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              Nearby Pollution Hotspots
            </h3>
            <div className="phone-hotspot-list" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {wards.map((w) => (
                <div
                  key={w.id}
                  onClick={() => onSelectWard(w.id)}
                  className={`phone-hotspot-item ${w.id === selectedWard.id ? 'active' : ''}`}
                >
                  <div>
                    <span className="phone-hotspot-name">{w.name}</span>
                    <div className="phone-hotspot-meta">
                      Hosp: {w.vulnerability.hospitals} • Sch: {w.vulnerability.schools}
                    </div>
                  </div>
                  <span
                    className="phone-hotspot-aqi"
                    style={{
                      background: w.currentAQI > 250 ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: w.currentAQI > 250 ? '#ef4444' : '#f59e0b',
                    }}
                  >
                    {w.currentAQI}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {currentScreen === 'report' && (
          <>
            <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-400" />
              Report Local Emission Source
            </h3>

            {reportSuccess ? (
              <div className="phone-success-card">
                <CheckCircle size={32} className="text-emerald-400" />
                <h4 className="phone-success-title">Report Transmitted</h4>
                <p className="phone-success-desc">
                  Incident registered on the Control Room Dashboard. Mobile inspectors alerted.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="phone-form">
                <div className="phone-form-group">
                  <label className="phone-form-label">Incident Category</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="phone-form-select"
                  >
                    <option value="Waste Burning">🔥 Open Waste Burning</option>
                    <option value="Stubble Burning">🚜 Stubble Burning</option>
                    <option value="Construction Dust">🚧 Construction Dust Plume</option>
                    <option value="Industrial Flare">🏭 Industrial Stack Emissions</option>
                    <option value="Heavy Congestion">🚗 Extreme Vehicular Gridlock</option>
                  </select>
                </div>

                <div className="phone-form-group">
                  <label className="phone-form-label">Description</label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Type details (e.g. Garbage fire behind apartment block)..."
                    rows={3}
                    className="phone-form-textarea"
                  />
                </div>

                {/* Upload Image Simulator */}
                <div className="phone-form-group">
                  <button
                    type="button"
                    onClick={() => setPhotoSelected(true)}
                    className={`phone-file-btn ${photoSelected ? 'attached' : ''}`}
                  >
                    {photoSelected ? (
                      <>
                        <CheckCircle size={12} />
                        photo_emission_capture.jpg (Attached)
                      </>
                    ) : (
                      <>
                        <Upload size={12} />
                        Attach Camera Photo
                      </>
                    )}
                  </button>
                </div>

                <div className="phone-form-actions">
                  <button type="button" className="phone-action-btn secondary">
                    📍 Tap Map Location
                  </button>
                  <button type="submit" disabled={reportLoading} className="phone-action-btn primary">
                    {reportLoading ? 'Sending...' : 'Submit Incident Report'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Citizen app navigation menu */}
      <nav className="phone-nav-bar">
        <button
          onClick={() => setCurrentScreen('home')}
          className={`phone-nav-btn ${currentScreen === 'home' ? 'active' : ''}`}
        >
          <Home size={16} />
          <span className="phone-nav-btn-lbl">Home</span>
        </button>
        <button
          onClick={() => setCurrentScreen('forecast')}
          className={`phone-nav-btn ${currentScreen === 'forecast' ? 'active' : ''}`}
        >
          <Calendar size={16} />
          <span className="phone-nav-btn-lbl">Prediction</span>
        </button>
        <button
          onClick={() => setCurrentScreen('health')}
          className={`phone-nav-btn ${currentScreen === 'health' ? 'active' : ''}`}
        >
          <Heart size={16} />
          <span className="phone-nav-btn-lbl">Health AI</span>
        </button>
        <button
          onClick={() => setCurrentScreen('map')}
          className={`phone-nav-btn ${currentScreen === 'map' ? 'active' : ''}`}
        >
          <MapPin size={16} />
          <span className="phone-nav-btn-lbl">Hotspots</span>
        </button>
        <button
          onClick={() => setCurrentScreen('report')}
          className={`phone-nav-btn ${currentScreen === 'report' ? 'active' : ''}`}
        >
          <AlertTriangle size={16} />
          <span className="phone-nav-btn-lbl">Report</span>
        </button>
      </nav>

      {/* Android bottom system nav buttons */}
      <div className="phone-system-nav">
        <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-gray-600 transform -rotate-45 block cursor-pointer select-none"></span>
        <span className="w-3 h-3 border-2 border-gray-600 rounded-full block cursor-pointer select-none"></span>
        <span className="w-2.5 h-2.5 bg-gray-600 rounded-sm block cursor-pointer select-none"></span>
      </div>
    </div>
  );
};
