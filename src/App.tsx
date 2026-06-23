import { useState, useEffect } from 'react';
import { METROS, type Ward, type MeteorologicalData } from './data/mockData';
import { AeroMap } from './components/AeroMap';
import { CitizenApp } from './components/CitizenApp';
import { Shield, Smartphone } from 'lucide-react';
import './styles/dashboard.css';

interface EnforcementAction {
  id: string;
  wardId: string;
  wardName: string;
  actionType: string;
  timestamp: string;
  status: 'Pending' | 'Active' | 'Resolved';
  responseTimeMin: number;
}

interface CitizenReport {
  id: string;
  wardId: string;
  type: string;
  locationName: string;
  coordinates: [number, number];
  details: string;
  timestamp: string;
}

interface ApiRecommendation {
  action: string;
  authority: string;
  impact: string;
  severity: string;
}

function App() {
  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const [selectedWardId, setSelectedWardId] = useState<string>('del_ward_1');
  const [showCitizen, setShowCitizen] = useState<boolean>(true);
  
  // Map toggles check state
  const [mapFilters] = useState({
    traffic: true,
    industries: true,
    construction: true,
    hospitals: false,
    schools: false,
  });

  // Dynamic state
  const [dynamicWards, setDynamicWards] = useState<Ward[]>(METROS.delhi.wards);
  const [meteorologyState, setMeteorologyState] = useState<MeteorologicalData>(METROS.delhi.meteorology);
  const [activeInterventions, setActiveInterventions] = useState<EnforcementAction[]>([]);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>([]);

  // Selected ward source attribution state
  const [sourceAttribution, setSourceAttribution] = useState({
    vehicular: 45,
    industrial: 25,
    constructionDust: 20,
    biomassBurning: 5,
    domesticOthers: 5,
    confidence: 85
  });

  // API prediction state
  const [apiPrediction, setApiPrediction] = useState<{
    tomorrowAqi: number;
    predicted24h: number;
    predicted48h: number;
    predicted72h: number;
    confidence: number;
    modelType: string;
  } | null>(null);
  
  const [apiRecommendations, setApiRecommendations] = useState<ApiRecommendation[]>([]);

  // Reload data when the city changes
  useEffect(() => {
    const city = METROS[selectedCityId];
    setDynamicWards(city.wards);
    setMeteorologyState(city.meteorology);
    if (city.wards.length > 0) {
      setSelectedWardId(city.wards[0].id);
    }
  }, [selectedCityId]);

  const activeCity = METROS[selectedCityId];
  const selectedWard = dynamicWards.find((w) => w.id === selectedWardId) || dynamicWards[0];

  // Fetch dynamic source attributions (Agent 2)
  const fetchSourceAttribution = async () => {
    try {
      const res = await fetch(`/api/attribution/${selectedWardId}`);
      if (res.ok) {
        const data = await res.json();
        setSourceAttribution({
          vehicular: data.vehicular,
          industrial: data.industrial,
          constructionDust: data.constructionDust,
          biomassBurning: data.biomassBurning,
          domesticOthers: data.domesticOthers,
          confidence: data.confidence
        });
      }
    } catch (err) {
      setSourceAttribution({
        vehicular: selectedWard.sourceAttribution.vehicular,
        industrial: selectedWard.sourceAttribution.industrial,
        constructionDust: selectedWard.sourceAttribution.constructionDust,
        biomassBurning: selectedWard.sourceAttribution.biomassBurning,
        domesticOthers: selectedWard.sourceAttribution.domesticOthers,
        confidence: selectedWard.sourceAttribution.confidence
      });
    }
  };

  // Fetch predictions and recommendations from Python FastAPI backend
  const fetchPredictionAndRecs = async () => {
    try {
      // Fetch prediction (Agent 1)
      const predRes = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAqi: selectedWard.currentAQI,
          temp: meteorologyState.temp,
          humidity: meteorologyState.humidity,
          windSpeed: meteorologyState.windSpeed,
          windDirection: meteorologyState.windDirection,
          mixingHeight: meteorologyState.mixingHeight,
        }),
      });
      if (predRes.ok) {
        const predData = await predRes.json();
        setApiPrediction({
          tomorrowAqi: predData.tomorrowAqi,
          predicted24h: predData.predicted24h,
          predicted48h: predData.predicted48h,
          predicted72h: predData.predicted72h,
          confidence: predData.confidence,
          modelType: predData.modelType,
        });
      }

      // Fetch recommendations (Agent 3)
      const recsRes = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aqi: selectedWard.currentAQI,
          traffic: mapFilters.traffic ? 'High' : 'Low',
          construction: mapFilters.construction ? 'High' : 'Low',
          wind: meteorologyState.windSpeed < 10 ? 'Low' : 'High',
          stubbleFires: activeCity.thermalAnomalies.length,
        }),
      });
      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setApiRecommendations(recsData.recommendations);
      }
    } catch (err) {
      console.warn('FastAPI backend offline, running in offline fallback mode.');
      // Fallback local calculations
      setApiPrediction({
        tomorrowAqi: Math.round(selectedWard.currentAQI * 1.05),
        predicted24h: Math.round(selectedWard.currentAQI * 1.05),
        predicted48h: Math.round(selectedWard.currentAQI * 0.95),
        predicted72h: Math.round(selectedWard.currentAQI * 0.88),
        confidence: 91,
        modelType: "XGBoost Client Engine"
      });
      setApiRecommendations([
        {
          action: `Deploy road sweepers to ${selectedWard.name}`,
          authority: "Municipal Enforcement Squad",
          impact: "Audit construction screens",
          severity: "HIGH"
        },
        {
          action: "Increase mechanical water sprinkling near major intersections",
          authority: "Ward Road Maintenance",
          impact: "Settles local PM10 dust",
          severity: "MEDIUM"
        }
      ]);
    }
  };

  // Fetch citizen reports (Agent 5)
  const fetchCitizenReports = async () => {
    try {
      const res = await fetch('/api/hotspots');
      if (res.ok) {
        const data = await res.json();
        setCitizenReports(data.reports);
      }
    } catch (err) {
      console.warn('Error fetching citizen reports, running offline.');
    }
  };

  useEffect(() => {
    fetchSourceAttribution();
  }, [selectedWardId]);

  useEffect(() => {
    fetchPredictionAndRecs();
  }, [selectedWardId, selectedCityId, meteorologyState, mapFilters]);

  useEffect(() => {
    fetchCitizenReports();
    // Poll hotspots periodically
    const interval = setInterval(fetchCitizenReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCity = (cityId: string) => {
    setSelectedCityId(cityId);
  };

  const handleSelectWard = (wardId: string) => {
    setSelectedWardId(wardId);
  };

  // Simulated dispatcher action triggers
  const handleExecuteAction = (wardId: string, actionType: string) => {
    const targetWard = dynamicWards.find((w) => w.id === wardId);
    if (!targetWard) return;

    const exists = activeInterventions.some(
      (act) => act.wardId === wardId && act.actionType === actionType && act.status !== 'Resolved'
    );
    if (exists) return;

    const actionId = `act_${Date.now()}`;
    const newAction: EnforcementAction = {
      id: actionId,
      wardId,
      wardName: targetWard.name,
      actionType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'Pending',
      responseTimeMin: 0,
    };

    setActiveInterventions((prev) => [...prev, newAction]);

    // Dispatch cycle: Pending -> Active -> Resolved
    setTimeout(() => {
      setActiveInterventions((prev) =>
        prev.map((act) => (act.id === actionId ? { ...act, status: 'Active' } : act))
      );
    }, 1500);

    setTimeout(() => {
      const actualResponseTime = Math.floor(Math.random() * 8) + 8;
      setActiveInterventions((prev) =>
        prev.map((act) =>
          act.id === actionId
            ? { ...act, status: 'Resolved', responseTimeMin: actualResponseTime }
            : act
        )
      );

      // Reduce ward AQI dynamically based on action
      setDynamicWards((prevWards) =>
        prevWards.map((w) => {
          if (w.id === wardId) {
            let reductionFactor = 0.90;
            if (actionType.includes('Sprinkler') || actionType.includes('sweepers')) reductionFactor = 0.85;
            if (actionType.includes('Subsidies')) reductionFactor = 0.80;
            if (actionType.includes('Bans') || actionType.includes('construction')) reductionFactor = 0.78;

            const newAqi = Math.max(Math.round(w.currentAQI * reductionFactor), 45);
            return {
              ...w,
              currentAQI: newAqi,
              currentPM25: Math.max(Math.round(w.currentPM25 * reductionFactor), 15),
              currentPM10: Math.max(Math.round(w.currentPM10 * reductionFactor), 30),
            };
          }
          return w;
        })
      );
    }, 6000);
  };

  const getAqiBadgeClass = (aqi: number) => {
    if (aqi <= 50) return 'badge-good';
    if (aqi <= 100) return 'badge-satisfactory';
    if (aqi <= 200) return 'badge-moderate';
    if (aqi <= 300) return 'badge-poor';
    if (aqi <= 400) return 'badge-very-poor';
    return 'badge-severe';
  };

  const getAqiText = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 200) return 'Moderate';
    if (aqi <= 300) return 'Poor';
    if (aqi <= 400) return 'Very Poor';
    return 'Severe';
  };

  // Derive mini-chart values
  const currentVal = selectedWard.currentAQI;
  const val24h = apiPrediction ? apiPrediction.predicted24h : Math.round(currentVal * 1.05);
  const val48h = apiPrediction ? apiPrediction.predicted48h : Math.round(currentVal * 0.95);
  const val72h = apiPrediction ? apiPrediction.predicted72h : Math.round(currentVal * 0.88);

  const maxVal = Math.max(currentVal, val24h, val48h, val72h, 100);

  return (
    <div className="app-container">
      {/* 1. Left Sidebar */}
      <aside className="left-sidebar">
        <div className="logo-section">
          <Shield className="logo-icon" size={22} />
          <div>
            <h1 className="logo-title">AeroGuard AI</h1>
            <p className="logo-subtitle">Smart City Intervention Engine</p>
          </div>
        </div>

        {/* City Wards Monitoring Center */}
        <div className="left-section">
          <h3 className="section-title">Monitoring Centre</h3>
          <div className="city-list">
            {Object.values(METROS).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectCity(m.id)}
                className={`city-list-btn ${selectedCityId === m.id ? 'active' : ''}`}
              >
                <span>{m.name}</span>
                <span className="city-count">{m.wards.length} Wards</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Meteorology Parameters */}
        <div className="left-section">
          <h3 className="section-title">⚡ Live Meteorology</h3>
          <div className="met-grid">
            <div className="met-item">
              <span className="met-label">Wind Velocity</span>
              <span className="met-value">{meteorologyState.windSpeed} km/h</span>
            </div>
            <div className="met-item">
              <span className="met-label">Wind Direction</span>
              <span className="met-value">{meteorologyState.windDirection}° N</span>
            </div>
            <div className="met-item">
              <span className="met-label">Temperature</span>
              <span className="met-value">{meteorologyState.temp}°C</span>
            </div>
            <div className="met-item">
              <span className="met-label">Inversion Trapping</span>
              <span className="met-value">0.9x</span>
            </div>
          </div>
        </div>

        {/* Receptor Vulnerability Details */}
        <div className="left-section">
          <h3 className="section-title">🏥 Receptor Vulnerability</h3>
          <div className="vuln-details">
            <div className="vuln-row">
              <span>🏥 Hospital Safety Grids:</span>
              <strong>{selectedWard.vulnerability.hospitals} Areas</strong>
            </div>
            <div className="vuln-row">
              <span>🏫 School Buffer Zones:</span>
              <strong>{selectedWard.vulnerability.schools} Areas</strong>
            </div>
            <p className="vuln-hint">
              Enforcement priorities increase when hotspots intersect these buffer boundaries.
            </p>
          </div>
        </div>

        {/* Active Dispatches Enforcement logs */}
        <div className="left-section flex-1 overflow-hidden flex flex-col">
          <h3 className="section-title">📋 Enforcement Log ({activeInterventions.length})</h3>
          <div className="flex-1 overflow-y-auto pr-1 mt-2">
            {activeInterventions.length === 0 ? (
              <div className="text-[10px] text-gray-500 italic text-center py-4">
                No active dispatches logged.
              </div>
            ) : (
              [...activeInterventions].reverse().map((act) => (
                <div key={act.id} className="enforcement-log-item">
                  <div className="log-info">
                    <span className="log-action">{act.actionType}</span>
                    <span className="log-ward">Ward: {act.wardName} • {act.timestamp}</span>
                  </div>
                  <span className={`log-badge ${act.status.toLowerCase()}`}>{act.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Toggle Citizen Companion simulation */}
        <div className="left-footer">
          <button className="citizen-toggle-btn" onClick={() => setShowCitizen(!showCitizen)}>
            <Smartphone size={14} />
            {showCitizen ? 'Hide Citizen App' : 'Show Citizen App'}
          </button>
        </div>
      </aside>

      {/* 2. Central GIS Map Area */}
      <div className="map-area">
        {/* Top left overlay banner */}
        <div className="map-title-overlay">
          <h2>{activeCity.name} Air Quality Grid</h2>
          <span className="hotspot-badge">
            {activeCity.thermalAnomalies.length + citizenReports.length} Hotspots Active
          </span>
        </div>

        {/* Top right colors legend */}
        <div className="map-legend-overlay">
          <div className="legend-item">
            <span className="dot dot-good"></span> Good / Satisfactory
          </div>
          <div className="legend-item">
            <span className="dot dot-moderate"></span> Moderate
          </div>
          <div className="legend-item">
            <span className="dot dot-poor"></span> Poor
          </div>
          <div className="legend-item">
            <span className="dot dot-severe"></span> Severe
          </div>
        </div>

        {/* The leaflet map core element */}
        <AeroMap
          cityData={{ ...activeCity, wards: dynamicWards, meteorology: meteorologyState }}
          selectedWardId={selectedWardId}
          onSelectWard={handleSelectWard}
          activeLayer={activeCity.thermalAnomalies.length > 0 ? 'hotspots' : 'standard'}
          activeInterventions={activeInterventions}
          filters={mapFilters}
          citizenReports={citizenReports}
        />

        {/* Bottom overlays row */}
        <div className="map-bottom-overlays">
          {/* Bottom Left: Horizontal citizen reports slider */}
          <div className="bottom-left-overlay">
            <h3>🚨 Citizen Pollution Reports ({citizenReports.length})</h3>
            <div className="reports-container">
              {citizenReports.length === 0 ? (
                <p className="no-reports-text">
                  No reports submitted yet. Open the Citizen Simulator on the bottom-left to test submissions.
                </p>
              ) : (
                [...citizenReports].reverse().map((rep) => (
                  <div key={rep.id} className="report-overlay-card">
                    <div className="report-card-header">
                      <span className="report-card-type">{rep.type}</span>
                      <button
                        className="dispatch-action-btn"
                        onClick={() => handleExecuteAction(rep.wardId, `Audit ${rep.type}`)}
                      >
                        Dispatcher
                      </button>
                    </div>
                    <p className="report-card-details">"{rep.details}"</p>
                    <span className="report-card-loc">Near {rep.locationName}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Right: Scrollable grid of ward AQI standings */}
          <div className="bottom-right-overlay">
            <h3>📊 Hyperlocal Ward AQI Standings</h3>
            <div className="standings-container">
              {dynamicWards.map((w) => (
                <div
                  key={w.id}
                  onClick={() => handleSelectWard(w.id)}
                  className={`standing-row ${w.id === selectedWardId ? 'border-cyan-500/40 bg-white/5' : ''}`}
                >
                  <span className="standing-name">{w.name}</span>
                  <div className="standing-aqi-group">
                    <span className="standing-aqi">{w.currentAQI} AQI</span>
                    <span className={`standing-badge ${getAqiBadgeClass(w.currentAQI)}`}>
                      {getAqiText(w.currentAQI)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Citizen App Smartphone Frame */}
        {showCitizen && (
          <div className="citizen-app-floater">
            <CitizenApp
              currentCityName={activeCity.name}
              wards={dynamicWards}
              selectedWardId={selectedWardId}
              onSelectWard={handleSelectWard}
              onNewReportSubmitted={fetchCitizenReports}
              onClose={() => setShowCitizen(false)}
            />
          </div>
        )}
      </div>

      {/* 3. Right Sidebar Source Analysis */}
      <aside className="right-sidebar">
        <div className="right-section-title">📊 Hyperlocal Source Analysis</div>
        
        {/* Ward overview header */}
        <div className="right-card">
          <div className="ward-header">
            <div>
              <h2>{selectedWard.name}</h2>
              <span className="ward-subtitle">Type: Residential/Commercial</span>
            </div>
            <span className={`aqi-badge-large ${getAqiBadgeClass(selectedWard.currentAQI)}`}>
              {selectedWard.currentAQI} {getAqiText(selectedWard.currentAQI)}
            </span>
          </div>

          {/* PM level blocks */}
          <div className="pm-grid">
            <div className="pm-box">
              <span className="pm-val">{selectedWard.currentPM25}</span>
              <span className="pm-label">PM2.5</span>
            </div>
            <div className="pm-box">
              <span className="pm-val">{selectedWard.currentPM10}</span>
              <span className="pm-label">PM10</span>
            </div>
            <div className="pm-box">
              <span className="pm-val">33</span>
              <span className="pm-label">SO2</span>
            </div>
            <div className="pm-box">
              <span className="pm-val">{selectedWard.currentNO2}</span>
              <span className="pm-label">NO2</span>
            </div>
          </div>
        </div>

        {/* Live Source Attribution */}
        <div className="right-section">
          <h3 className="right-sub-title">🔄 Live Source Attribution</h3>
          <div className="attribution-bars">
            <div className="bar-row">
              <div className="bar-label-group">
                <span>Traffic</span>
                <span>{sourceAttribution.vehicular}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-cyan" style={{ width: `${sourceAttribution.vehicular}%` }}></div>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-label-group">
                <span>Industry</span>
                <span>{sourceAttribution.industrial}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-purple" style={{ width: `${sourceAttribution.industrial}%` }}></div>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-label-group">
                <span>Construction</span>
                <span>{sourceAttribution.constructionDust}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-amber" style={{ width: `${sourceAttribution.constructionDust}%` }}></div>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-label-group">
                <span>Waste Burning</span>
                <span>{sourceAttribution.biomassBurning}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-rose" style={{ width: `${sourceAttribution.biomassBurning}%` }}></div>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-label-group">
                <span>Background / Transboundary</span>
                <span>{sourceAttribution.domesticOthers}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bg-gray" style={{ width: `${sourceAttribution.domesticOthers}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 24-72h Predictive Forecast columns simulation */}
        <div className="right-section">
          <h3 className="right-sub-title">📅 24-72h Predictive Forecast</h3>
          <div className="forecast-mini-chart">
            <div className="forecast-col">
              <div className="forecast-col-bar" style={{ height: `${Math.min((currentVal / maxVal) * 70, 70)}px` }}>
                <span className="forecast-col-bar-value">{currentVal}</span>
              </div>
              <span className="forecast-col-time">Current</span>
            </div>
            <div className="forecast-col">
              <div className="forecast-col-bar" style={{ height: `${Math.min((val24h / maxVal) * 70, 70)}px` }}>
                <span className="forecast-col-bar-value text-[#f59e0b]">{val24h}</span>
              </div>
              <span className="forecast-col-time">+24h</span>
            </div>
            <div className="forecast-col">
              <div className="forecast-col-bar" style={{ height: `${Math.min((val48h / maxVal) * 70, 70)}px` }}>
                <span className="forecast-col-bar-value">{val48h}</span>
              </div>
              <span className="forecast-col-time">+48h</span>
            </div>
            <div className="forecast-col">
              <div className="forecast-col-bar" style={{ height: `${Math.min((val72h / maxVal) * 70, 70)}px` }}>
                <span className="forecast-col-bar-value">{val72h}</span>
              </div>
              <span className="forecast-col-time">+72h</span>
            </div>
          </div>
          
          <div className="forecast-checkbox-row mt-2">
            <input type="checkbox" id="inversion_check" defaultChecked readOnly />
            <label htmlFor="inversion_check" className="cursor-pointer">
              High morning inversion: dynamic traps detected at +24h forecast window
            </label>
          </div>
        </div>

        {/* AI Enforcement Directives */}
        <div className="right-section flex-1 overflow-hidden flex flex-col">
          <div className="directives-header">
            <h3 className="right-sub-title">🛡️ AI Enforcement Directives</h3>
            <button className="query-agent-btn" onClick={fetchPredictionAndRecs}>Query Agent</button>
          </div>

          <div className="directives-list flex-1 overflow-y-auto pr-1">
            {apiRecommendations.length > 0 ? (
              apiRecommendations.map((rec, i) => (
                <div key={i} className="directive-item">
                  <span className="dir-num">{i + 1}.</span>
                  <span className="dir-text">{rec.action} ({rec.severity})</span>
                </div>
              ))
            ) : (
              <>
                <div className="directive-item">
                  <span className="dir-num">1.</span>
                  <span className="dir-text">Increase roadside sweeping frequency in {selectedWard.name}.</span>
                </div>
                <div className="directive-item">
                  <span className="dir-num">2.</span>
                  <span className="dir-text">Issue warnings to construction project managers regarding uncovered raw materials.</span>
                </div>
                <div className="directive-item">
                  <span className="dir-num">3.</span>
                  <span className="dir-text">Increase inspection frequency of local diesel generator installations.</span>
                </div>
                <div className="directive-item">
                  <span className="dir-num">4.</span>
                  <span className="dir-text">Encourage public transport utilization via municipal announcements.</span>
                </div>
                <div className="directive-item">
                  <span className="dir-num">5.</span>
                  <span className="dir-text">Ensure waste sorting compliance to stop open garbage incineration.</span>
                </div>
              </>
            )}
          </div>

          <button
            className="dispatch-cta-btn"
            onClick={() => handleExecuteAction(selectedWard.id, `Dispatch inspector force`)}
          >
            ⚡ Dispatch Enforcement Inspector
          </button>
        </div>
      </aside>
    </div>
  );
}

export default App;
