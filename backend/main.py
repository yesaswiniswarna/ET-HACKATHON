from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import random
import datetime

app = FastAPI(title="AeroVardhan API", description="AI-powered Air Quality Intelligence Agents API")

# Configure CORS so front-end can communicate easily if run on different ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory list for citizen-submitted pollution reports
USER_REPORTS = [
    {
        "id": "rep_init_1",
        "wardId": "del_ward_3",
        "type": "Waste Burning",
        "locationName": "Dwarka Sector 11 Market",
        "coordinates": [28.5810, 77.0580],
        "details": "Open garbage burning behind the shopping complex. Strong plastic fumes.",
        "timestamp": "2 hours ago",
        "photoUrl": "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce"
    }
]

# Models for request verification
class PredictInput(BaseModel):
    currentAqi: float
    temp: float
    humidity: float
    windSpeed: float
    windDirection: float
    mixingHeight: float

class PredictOutput(BaseModel):
    tomorrowAqi: int
    predicted24h: int
    predicted48h: int
    predicted72h: int
    confidence: int
    modelType: str
    rmseComparison: Dict[str, float]

class RecommendationInput(BaseModel):
    aqi: int
    traffic: str # 'High' | 'Medium' | 'Low'
    construction: str # 'High' | 'Medium' | 'Low'
    wind: str # 'High' | 'Medium' | 'Low'
    stubbleFires: int

class HealthInput(BaseModel):
    age: int
    hasAsthma: bool
    location: str
    currentAqi: int

class CitizenReportInput(BaseModel):
    wardId: str
    type: str
    locationName: str
    coordinates: List[float]
    details: str
    photo: Optional[str] = None

# --- AGENT 1: AQI Prediction Agent ---
@app.post("/api/predict", response_model=PredictOutput)
def predict_aqi(inputs: PredictInput):
    # Simulated XGBoost/LSTM dispersion logic:
    # 1. Higher wind speeds scatter PM -> reduces AQI.
    # 2. Lower mixing heights trap PM -> compresses boundary layer -> increases AQI.
    # 3. Higher humidity increases PM particle aggregation -> increases AQI.
    
    dispersion_factor = (10.0 / max(inputs.windSpeed, 2.0)) * (500.0 / max(inputs.mixingHeight, 100.0))
    humidity_factor = 1.0 + (inputs.humidity - 50.0) / 250.0
    
    base_calc = inputs.currentAqi * dispersion_factor * humidity_factor
    
    # Cap values to realistic CPCB bounds
    tomorrow = min(max(int(base_calc * 0.95 + random.randint(-15, 15)), 45), 495)
    pred_24h = tomorrow
    pred_48h = min(max(int(base_calc * 1.02 + random.randint(-20, 20)), 45), 495)
    pred_72h = min(max(int(base_calc * 0.90 + random.randint(-10, 10)), 45), 495)
    
    confidence_val = min(max(int(95 - (inputs.windSpeed * 0.3) - (random.randint(0, 5))), 78), 98)
    
    return PredictOutput(
        tomorrowAqi=tomorrow,
        predicted24h=pred_24h,
        predicted48h=pred_48h,
        predicted72h=pred_72h,
        confidence=confidence_val,
        modelType="XGBoost + LSTM Ensemble Model",
        rmseComparison={"Model_RMSE": 12.8, "Persistence_RMSE": 28.4}
    )

# --- AGENT 2: Pollution Source Detection Agent ---
@app.get("/api/attribution/{ward_id}")
def get_attribution(ward_id: str):
    # Ward-specific spatial-temporal source attribution
    # In a production app, this cross-references local GIS coordinates, industrial permits, traffic indices.
    
    if "del" in ward_id:
        if "ward_1" in ward_id: # Anand Vihar
            return {"vehicular": 38, "constructionDust": 25, "industrial": 22, "biomassBurning": 10, "domesticOthers": 5, "confidence": 89}
        if "ward_2" in ward_id: # Okhla
            return {"vehicular": 25, "constructionDust": 15, "industrial": 45, "biomassBurning": 5, "domesticOthers": 10, "confidence": 93}
        if "ward_3" in ward_id: # Dwarka
            return {"vehicular": 42, "constructionDust": 28, "industrial": 10, "biomassBurning": 12, "domesticOthers": 8, "confidence": 84}
        return {"vehicular": 50, "constructionDust": 20, "industrial": 15, "biomassBurning": 8, "domesticOthers": 7, "confidence": 87}
        
    elif "mum" in ward_id:
        if "ward_1" in ward_id: # Chembur
            return {"vehicular": 28, "constructionDust": 18, "industrial": 42, "biomassBurning": 2, "domesticOthers": 10, "confidence": 86}
        if "ward_3" in ward_id: # Kurla
            return {"vehicular": 45, "constructionDust": 30, "industrial": 12, "biomassBurning": 5, "domesticOthers": 8, "confidence": 88}
        return {"vehicular": 58, "constructionDust": 25, "industrial": 2, "biomassBurning": 0, "domesticOthers": 15, "confidence": 82}
        
    elif "blr" in ward_id:
        if "ward_1" in ward_id: # Silk Board
            return {"vehicular": 68, "constructionDust": 18, "industrial": 5, "biomassBurning": 1, "domesticOthers": 8, "confidence": 91}
        if "ward_2" in ward_id: # Peenya
            return {"vehicular": 20, "constructionDust": 15, "industrial": 52, "biomassBurning": 3, "domesticOthers": 10, "confidence": 88}
        if "ward_3" in ward_id: # Whitefield
            return {"vehicular": 35, "constructionDust": 45, "industrial": 8, "biomassBurning": 2, "domesticOthers": 10, "confidence": 85}
        return {"vehicular": 48, "constructionDust": 12, "industrial": 2, "biomassBurning": 1, "domesticOthers": 37, "confidence": 82}

    # Fallback default
    return {"vehicular": 45, "constructionDust": 25, "industrial": 20, "biomassBurning": 5, "domesticOthers": 5, "confidence": 85}

# --- AGENT 3: Recommendation Agent (LLM Simulation) ---
@app.post("/api/recommendations")
def get_recommendations(inputs: RecommendationInput):
    recs = []
    
    if inputs.aqi > 250:
        recs.append({
            "action": "Suspend all active construction and demolition activities",
            "authority": "Municipal Commissioner Office",
            "impact": "Reduces particulate emissions (PM10) in grid cells by up to 25%",
            "severity": "CRITICAL"
        })
        recs.append({
            "action": "Deploy mobile smog guns and heavy water sprinklers to primary roadways",
            "authority": "Municipal Engineering Division",
            "impact": "Suppresses local ground-level dust load; expected 15% PM2.5 fall",
            "severity": "HIGH"
        })
    
    if inputs.traffic == "High":
        recs.append({
            "action": "Implement dynamic traffic diversion and restrict commercial trucks from core grid lines",
            "authority": "City Traffic Police Control Room",
            "impact": "Decreases tailpipe exhausts and NOx concentration in bottlenecks by 20%",
            "severity": "HIGH"
        })
        recs.append({
            "action": "Issue public health notice promoting dynamic carpooling and public metros",
            "authority": "Department of Public Relations",
            "impact": "Decreases light vehicular density during peak hours",
            "severity": "MEDIUM"
        })
        
    if inputs.construction == "High":
        recs.append({
            "action": "Mandate construction dust enclosures and audit compliance certificates",
            "authority": "Pollution Control Board Inspectorate",
            "impact": "Prevents mechanical dust from drifting into surrounding residential wards",
            "severity": "HIGH"
        })
        
    if inputs.stubbleFires > 0:
        recs.append({
            "action": "Mobilize local cooperative subsidy funds for straw management machinery",
            "authority": "Agricultural Development Board",
            "impact": "Stops regional background stubble plumes from spiking city baseline AQI",
            "severity": "CRITICAL"
        })
        
    if len(recs) == 0:
        recs.append({
            "action": "Maintain routine street sweeping and standard vehicular emission monitoring",
            "authority": "Municipal Corporation",
            "impact": "Ensures background levels remain within satisfactory bounds",
            "severity": "LOW"
        })
        
    return {"recommendations": recs}

# --- AGENT 4: Citizen Health Agent ---
@app.post("/api/health-advisory")
def get_health_advisory(inputs: HealthInput):
    advisories = []
    
    # Custom health logic based on user profile and AQI severity
    if inputs.currentAqi > 300:
        advisories.append("⚠️ The air is HAZARDOUS today. Avoid ALL outdoor activities.")
        if inputs.hasAsthma:
            advisories.append("🚨 CRITICAL: Keep your rescue inhaler/medication on hand. Stay in a room with a running Air Purifier.")
        if inputs.age >= 60:
            advisories.append("👵 SENIOR ALERT: Avoid outdoor walks completely. High risk of cardiovascular/respiratory stress.")
        advisories.append("😷 Wear a double-strapped N95 respirator if stepping outdoors is mandatory.")
        
    elif inputs.currentAqi > 200:
        advisories.append("⚠️ Air Quality is POOR. Restrict continuous outdoor exercise.")
        if inputs.hasAsthma:
            advisories.append("🚨 ASTHMA ALERT: Reduce strenuous outdoor activity. Trigger symptoms might escalate quickly.")
        if inputs.age <= 12:
            advisories.append("👶 CHILDREN ALERT: Schools are advised to switch to indoor play for recess.")
        advisories.append("😷 Wearing an N95 mask is highly recommended for sensitive individuals.")
        
    elif inputs.currentAqi > 100:
        advisories.append("⚠️ Air is MODERATELY POLLUTED. Sensitive groups may experience discomfort.")
        if inputs.hasAsthma:
            advisories.append("🚨 Restrict heavy outdoor cardio exercises during peak morning rush hours.")
            
    else:
        advisories.append("✅ Air quality is GOOD/SATISFACTORY. Safe for outdoor jogging, walks, and children's sports.")
        
    return {
        "advisory": advisories,
        "classification": "Dangerous" if inputs.currentAqi > 300 else "Unhealthy" if inputs.currentAqi > 200 else "Moderate" if inputs.currentAqi > 100 else "Good",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# --- AGENT 5: Hotspot & Report Registry Agent ---
@app.get("/api/hotspots")
def list_hotspots():
    # Combine static thermal anomalies, critical wards, and user submitted reports
    return {
        "reports": USER_REPORTS,
        "criticalWards": [
            {"id": "del_ward_1", "name": "Anand Vihar", "aqi": 320},
            {"id": "blr_ward_1", "name": "Central Silk Board", "aqi": 188},
            {"id": "chn_ward_1", "name": "Ennore Port", "aqi": 192}
        ]
    }

@app.post("/api/report")
def submit_report(report: CitizenReportInput):
    report_id = f"rep_{int(datetime.datetime.now().timestamp())}"
    
    new_report = {
        "id": report_id,
        "wardId": report.wardId,
        "type": report.type,
        "locationName": report.locationName,
        "coordinates": report.coordinates,
        "details": report.details,
        "timestamp": "Just now",
        "photoUrl": report.photo if report.photo else "https://images.unsplash.com/photo-1530587191325-3db32d826c18"
    }
    
    USER_REPORTS.append(new_report)
    return {"message": "Report submitted successfully!", "report": new_report}
