export interface Ward {
  id: string;
  name: string;
  center: [number, number];
  coordinates: [number, number][];
  currentAQI: number;
  currentPM25: number;
  currentPM10: number;
  currentNO2: number;
  currentSO2: number;
  currentCO: number;
  currentO3: number;
  sourceAttribution: {
    vehicular: number;
    industrial: number;
    constructionDust: number;
    biomassBurning: number;
    domesticOthers: number;
    confidence: number; // 0 to 100
  };
  vulnerability: {
    hospitals: number;
    schools: number;
    outdoorWorkersDensity: number; // index 1-10
    vulnerablePopulation: number; // in thousands
  };
  advisories: {
    en: string;
    hi?: string;
    kn?: string;
    ta?: string;
    mr?: string;
    bn?: string;
  };
}

export interface CAAQMSStation {
  id: string;
  name: string;
  coordinates: [number, number];
  liveAQI: number;
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'SO2';
  history24h: { time: string; aqi: number }[];
}

export interface ThermalAnomaly {
  id: string;
  coordinates: [number, number];
  intensity: number; // FRP (Fire Radiative Power) in MW
  type: 'Stubble Burning' | 'Waste Burning' | 'Industrial Flare';
  timestamp: string;
}

export interface MeteorologicalData {
  temp: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees (0 = North, 90 = East, etc.)
  mixingHeight: number; // meters
}

export interface GridCell {
  id: string;
  coordinates: [number, number][]; // 4 points of a 1km grid square
  aqi: number;
}

export interface CityData {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  wards: Ward[];
  stations: CAAQMSStation[];
  thermalAnomalies: ThermalAnomaly[];
  meteorology: MeteorologicalData;
  gridForecast: GridCell[];
}

export const METROS: Record<string, CityData> = {
  delhi: {
    id: 'delhi',
    name: 'Delhi (NCT)',
    center: [28.6139, 77.2090],
    zoom: 11,
    meteorology: {
      temp: 34.5,
      humidity: 62,
      windSpeed: 8,
      windDirection: 290, // WNW
      mixingHeight: 450
    },
    stations: [
      {
        id: 'del_st_1',
        name: 'Anand Vihar CAAQMS',
        coordinates: [28.6468, 77.3160],
        liveAQI: 312,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 280 }, { time: '15:00', aqi: 295 },
          { time: '18:00', aqi: 310 }, { time: '21:00', aqi: 340 },
          { time: '00:00', aqi: 350 }, { time: '03:00', aqi: 330 },
          { time: '06:00', aqi: 320 }, { time: '09:00', aqi: 312 }
        ]
      },
      {
        id: 'del_st_2',
        name: 'Okhla Phase 3 CAAQMS',
        coordinates: [28.5355, 77.2631],
        liveAQI: 276,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 240 }, { time: '15:00', aqi: 250 },
          { time: '18:00', aqi: 270 }, { time: '21:00', aqi: 285 },
          { time: '00:00', aqi: 295 }, { time: '03:00', aqi: 290 },
          { time: '06:00', aqi: 280 }, { time: '09:00', aqi: 276 }
        ]
      },
      {
        id: 'del_st_3',
        name: 'Dwarka Sector 8 CAAQMS',
        coordinates: [28.5700, 77.0712],
        liveAQI: 218,
        dominantPollutant: 'PM10',
        history24h: [
          { time: '12:00', aqi: 190 }, { time: '15:00', aqi: 195 },
          { time: '18:00', aqi: 205 }, { time: '21:00', aqi: 220 },
          { time: '00:00', aqi: 230 }, { time: '03:00', aqi: 225 },
          { time: '06:00', aqi: 220 }, { time: '09:00', aqi: 218 }
        ]
      },
      {
        id: 'del_st_4',
        name: 'Mandir Marg CAAQMS',
        coordinates: [28.6341, 77.2005],
        liveAQI: 185,
        dominantPollutant: 'NO2',
        history24h: [
          { time: '12:00', aqi: 165 }, { time: '15:00', aqi: 170 },
          { time: '18:00', aqi: 180 }, { time: '21:00', aqi: 195 },
          { time: '00:00', aqi: 190 }, { time: '03:00', aqi: 185 },
          { time: '06:00', aqi: 180 }, { time: '09:00', aqi: 185 }
        ]
      }
    ],
    thermalAnomalies: [
      { id: 'del_ta_1', coordinates: [28.6010, 77.0305], intensity: 48, type: 'Stubble Burning', timestamp: '2 hours ago' },
      { id: 'del_ta_2', coordinates: [28.6750, 77.1000], intensity: 12, type: 'Waste Burning', timestamp: '1 hour ago' },
      { id: 'del_ta_3', coordinates: [28.5150, 77.2900], intensity: 28, type: 'Industrial Flare', timestamp: '30 mins ago' }
    ],
    wards: [
      {
        id: 'del_ward_1',
        name: 'Anand Vihar',
        center: [28.6468, 77.3160],
        coordinates: [
          [28.6600, 77.3000],
          [28.6600, 77.3350],
          [28.6300, 77.3350],
          [28.6300, 77.3000]
        ],
        currentAQI: 320,
        currentPM25: 185,
        currentPM10: 310,
        currentNO2: 45,
        currentSO2: 12,
        currentCO: 2.1,
        currentO3: 56,
        sourceAttribution: {
          vehicular: 38,
          industrial: 22,
          constructionDust: 25,
          biomassBurning: 10,
          domesticOthers: 5,
          confidence: 89
        },
        vulnerability: {
          hospitals: 4,
          schools: 12,
          outdoorWorkersDensity: 9,
          vulnerablePopulation: 42.5
        },
        advisories: {
          en: 'AQI Critical. Avoid all outdoor activities. Outdoor workers must wear N95 masks. Schools advised to switch to remote learning.',
          hi: 'वायु गुणवत्ता सूचकांक अत्यंत गंभीर। सभी बाहरी गतिविधियों से बचें। बाहरी श्रमिकों को N95 मास्क पहनना अनिवार्य है। स्कूलों को ऑनलाइन पढ़ाई शुरू करने की सलाह दी जाती है।'
        }
      },
      {
        id: 'del_ward_2',
        name: 'Okhla Industrial Area',
        center: [28.5355, 77.2631],
        coordinates: [
          [28.5550, 77.2400],
          [28.5550, 77.2850],
          [28.5150, 77.2850],
          [28.5150, 77.2400]
        ],
        currentAQI: 285,
        currentPM25: 145,
        currentPM10: 240,
        currentNO2: 68,
        currentSO2: 24,
        currentCO: 3.2,
        currentO3: 40,
        sourceAttribution: {
          vehicular: 25,
          industrial: 45,
          constructionDust: 15,
          biomassBurning: 5,
          domesticOthers: 10,
          confidence: 93
        },
        vulnerability: {
          hospitals: 2,
          schools: 6,
          outdoorWorkersDensity: 10,
          vulnerablePopulation: 58.0
        },
        advisories: {
          en: 'Unhealthy AQI. High industrial emissions detected. Heavy workers should take frequent breaks in indoor ventilated spaces.',
          hi: 'अस्वस्थकर हवा। उच्च औद्योगिक उत्सर्जन दर्ज किया गया। बाहरी श्रम करने वाले श्रमिक हवादार कमरों में समय-समय पर विश्राम लें।'
        }
      },
      {
        id: 'del_ward_3',
        name: 'Dwarka',
        center: [28.5850, 77.0505],
        coordinates: [
          [28.6100, 77.0200],
          [28.6100, 77.0800],
          [28.5600, 77.0800],
          [28.5600, 77.0200]
        ],
        currentAQI: 215,
        currentPM25: 98,
        currentPM10: 180,
        currentNO2: 32,
        currentSO2: 8,
        currentCO: 1.4,
        currentO3: 48,
        sourceAttribution: {
          vehicular: 42,
          industrial: 10,
          constructionDust: 28,
          biomassBurning: 12,
          domesticOthers: 8,
          confidence: 84
        },
        vulnerability: {
          hospitals: 5,
          schools: 18,
          outdoorWorkersDensity: 6,
          vulnerablePopulation: 35.2
        },
        advisories: {
          en: 'Poor air quality. Restrict outdoor play for children and seniors. Construction dust reduction protocols are in effect.',
          hi: 'खराब वायु गुणवत्ता। बच्चों और बुजुर्गों के लिए बाहर घूमना सीमित करें। धूल नियंत्रण के कड़े नियम लागू किए जा रहे हैं।'
        }
      },
      {
        id: 'del_ward_4',
        name: 'Punjabi Bagh',
        center: [28.6678, 77.1264],
        coordinates: [
          [28.6850, 77.1000],
          [28.6850, 77.1500],
          [28.6500, 77.1500],
          [28.6500, 77.1000]
        ],
        currentAQI: 258,
        currentPM25: 124,
        currentPM10: 210,
        currentNO2: 44,
        currentSO2: 11,
        currentCO: 1.8,
        currentO3: 52,
        sourceAttribution: {
          vehicular: 50,
          industrial: 15,
          constructionDust: 20,
          biomassBurning: 8,
          domesticOthers: 7,
          confidence: 87
        },
        vulnerability: {
          hospitals: 3,
          schools: 14,
          outdoorWorkersDensity: 7,
          vulnerablePopulation: 29.8
        },
        advisories: {
          en: 'Unhealthy air. Heavy vehicular exhaust load. Sensitive groups should wear protective gear and avoid morning walks.',
          hi: 'अस्वस्थकर हवा। अत्यधिक वाहनों का धुआँ। संवेदनशील समूह सुबह की सैर से बचें और सुरक्षात्मक मास्क का उपयोग करें।'
        }
      },
      {
        id: 'del_ward_5',
        name: 'Connaught Place',
        center: [28.6304, 77.2177],
        coordinates: [
          [28.6450, 77.2000],
          [28.6450, 77.2350],
          [28.6150, 77.2350],
          [28.6150, 77.2000]
        ],
        currentAQI: 195,
        currentPM25: 78,
        currentPM10: 142,
        currentNO2: 56,
        currentSO2: 6,
        currentCO: 2.5,
        currentO3: 65,
        sourceAttribution: {
          vehicular: 65,
          industrial: 5,
          constructionDust: 10,
          biomassBurning: 2,
          domesticOthers: 18,
          confidence: 90
        },
        vulnerability: {
          hospitals: 6,
          schools: 8,
          outdoorWorkersDensity: 5,
          vulnerablePopulation: 12.0
        },
        advisories: {
          en: 'Moderate to Poor. Heavy commercial/traffic node. People with respiratory ailments should avoid congested roads.',
          hi: 'मध्यम से खराब हवा। अत्यधिक व्यापारिक यातायात। सांस के रोगी भीड़भाड़ वाले रास्तों पर जाने से बचें।'
        }
      }
    ],
    gridForecast: [] // Generated below
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    center: [19.0760, 72.8777],
    zoom: 11,
    meteorology: {
      temp: 31.0,
      humidity: 82,
      windSpeed: 18, // Sea breeze
      windDirection: 240, // WSW
      mixingHeight: 700
    },
    stations: [
      {
        id: 'mum_st_1',
        name: 'Chembur CAAQMS',
        coordinates: [19.0622, 72.8974],
        liveAQI: 168,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 155 }, { time: '15:00', aqi: 160 },
          { time: '18:00', aqi: 172 }, { time: '21:00', aqi: 185 },
          { time: '00:00', aqi: 180 }, { time: '03:00', aqi: 170 },
          { time: '06:00', aqi: 165 }, { time: '09:00', aqi: 168 }
        ]
      },
      {
        id: 'mum_st_2',
        name: 'Bandra CAAQMS',
        coordinates: [19.0596, 72.8295],
        liveAQI: 115,
        dominantPollutant: 'PM10',
        history24h: [
          { time: '12:00', aqi: 95 }, { time: '15:00', aqi: 102 },
          { time: '18:00', aqi: 110 }, { time: '21:00', aqi: 125 },
          { time: '00:00', aqi: 130 }, { time: '03:00', aqi: 120 },
          { time: '06:00', aqi: 112 }, { time: '09:00', aqi: 115 }
        ]
      },
      {
        id: 'mum_st_3',
        name: 'Kurla CAAQMS',
        coordinates: [19.0726, 72.8845],
        liveAQI: 184,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 160 }, { time: '15:00', aqi: 165 },
          { time: '18:00', aqi: 180 }, { time: '21:00', aqi: 195 },
          { time: '00:00', aqi: 200 }, { time: '03:00', aqi: 190 },
          { time: '06:00', aqi: 182 }, { time: '09:00', aqi: 184 }
        ]
      }
    ],
    thermalAnomalies: [
      { id: 'mum_ta_1', coordinates: [19.0700, 72.9300], intensity: 15, type: 'Waste Burning', timestamp: '1 hour ago' },
      { id: 'mum_ta_2', coordinates: [19.0950, 72.8650], intensity: 8, type: 'Waste Burning', timestamp: '4 hours ago' }
    ],
    wards: [
      {
        id: 'mum_ward_1',
        name: 'Chembur',
        center: [19.0622, 72.8974],
        coordinates: [
          [19.0800, 72.8750],
          [19.0800, 72.9200],
          [19.0400, 72.9200],
          [19.0400, 72.8750]
        ],
        currentAQI: 172,
        currentPM25: 78,
        currentPM10: 135,
        currentNO2: 52,
        currentSO2: 18,
        currentCO: 1.8,
        currentO3: 35,
        sourceAttribution: {
          vehicular: 28,
          industrial: 42,
          constructionDust: 18,
          biomassBurning: 2,
          domesticOthers: 10,
          confidence: 86
        },
        vulnerability: {
          hospitals: 5,
          schools: 11,
          outdoorWorkersDensity: 8,
          vulnerablePopulation: 49.5
        },
        advisories: {
          en: 'Moderate Air Pollution. Chembur industrial hub shows refinery fumes and dust. Cardiac/lung patients should limit outdoor heavy exercise.',
          mr: 'मध्यम वायु प्रदूषण। चेंबूर इंडस्ट्रियल हबमध्ये रिफायनरी वायू आणि धुळीचा प्रादुर्भाव आहे. हृदय व फुफ्फुसाच्या रुग्णांनी मैदानी कष्टाची कामे टाळावीत।'
        }
      },
      {
        id: 'mum_ward_2',
        name: 'Bandra West',
        center: [19.0596, 72.8295],
        coordinates: [
          [19.0700, 72.8100],
          [19.0700, 72.8500],
          [19.0400, 72.8500],
          [19.0400, 72.8100]
        ],
        currentAQI: 110,
        currentPM25: 42,
        currentPM10: 84,
        currentNO2: 28,
        currentSO2: 4,
        currentCO: 0.9,
        currentO3: 45,
        sourceAttribution: {
          vehicular: 58,
          industrial: 2,
          constructionDust: 25,
          biomassBurning: 0,
          domesticOthers: 15,
          confidence: 81
        },
        vulnerability: {
          hospitals: 3,
          schools: 9,
          outdoorWorkersDensity: 4,
          vulnerablePopulation: 18.2
        },
        advisories: {
          en: 'Acceptable Air Quality. Strong coastal dispersion present. Construction dust on Linking Road remains localized.',
          mr: 'समाधानकारक हवेची गुणवत्ता. सागरी वाऱ्यांमुळे प्रदूषके वाहून जात आहेत. लिंकिंग रोडवरील धुळीचा प्रभाव स्थानिक पातळीवर मर्यादित आहे।'
        }
      },
      {
        id: 'mum_ward_3',
        name: 'Kurla East',
        center: [19.0726, 72.8845],
        coordinates: [
          [19.0900, 72.8650],
          [19.0900, 72.9050],
          [19.0550, 72.9050],
          [19.0550, 72.8650]
        ],
        currentAQI: 185,
        currentPM25: 86,
        currentPM10: 150,
        currentNO2: 48,
        currentSO2: 9,
        currentCO: 2.3,
        currentO3: 31,
        sourceAttribution: {
          vehicular: 45,
          industrial: 12,
          constructionDust: 30,
          biomassBurning: 5,
          domesticOthers: 8,
          confidence: 88
        },
        vulnerability: {
          hospitals: 4,
          schools: 15,
          outdoorWorkersDensity: 9,
          vulnerablePopulation: 65.4
        },
        advisories: {
          en: 'Poor AQI. Heavy vehicle congestion and construction dust around Metro lines. Sensitive people should wear masks.',
          mr: 'खराब हवेची गुणवत्ता. मेट्रो रेषांच्या बांधकामामुळे आणि अवजड वाहनांमुळे प्रदूषण वाढले आहे. संवेदनशील व्यक्तींनी मुखवटा (मास्क) वापरावा।'
        }
      },
      {
        id: 'mum_ward_4',
        name: 'Colaba',
        center: [18.9067, 72.8147],
        coordinates: [
          [18.9300, 72.8000],
          [18.9300, 72.8350],
          [18.8900, 72.8350],
          [18.8900, 72.8000]
        ],
        currentAQI: 95,
        currentPM25: 35,
        currentPM10: 68,
        currentNO2: 22,
        currentSO2: 3,
        currentCO: 0.7,
        currentO3: 50,
        sourceAttribution: {
          vehicular: 60,
          industrial: 5,
          constructionDust: 10,
          biomassBurning: 0,
          domesticOthers: 25,
          confidence: 79
        },
        vulnerability: {
          hospitals: 2,
          schools: 5,
          outdoorWorkersDensity: 3,
          vulnerablePopulation: 14.5
        },
        advisories: {
          en: 'Good to Moderate air quality. Strong sea breeze keeps air clean. Suitable for outdoor sports.',
          mr: 'चांगली हवेची गुणवत्ता. समुद्रकिनाऱ्यावरील वाऱ्यांमुळे हवा स्वच्छ आहे. मैदानी खेळांसाठी उत्तम वातावरण।'
        }
      },
      {
        id: 'mum_ward_5',
        name: 'Andheri West',
        center: [19.1136, 72.8697],
        coordinates: [
          [19.1350, 72.8250],
          [19.1350, 72.8800],
          [19.0950, 72.8800],
          [19.0950, 72.8250]
        ],
        currentAQI: 148,
        currentPM25: 58,
        currentPM10: 110,
        currentNO2: 38,
        currentSO2: 6,
        currentCO: 1.5,
        currentO3: 42,
        sourceAttribution: {
          vehicular: 48,
          industrial: 10,
          constructionDust: 32,
          biomassBurning: 1,
          domesticOthers: 9,
          confidence: 83
        },
        vulnerability: {
          hospitals: 6,
          schools: 20,
          outdoorWorkersDensity: 7,
          vulnerablePopulation: 52.0
        },
        advisories: {
          en: 'Moderate AQI. Congestion peaks on Western Express Highway. Reduce continuous exposure near highway grids.',
          mr: 'मध्यम हवामान गुणवत्ता. वेस्टर्न एक्सप्रेस हायवेवर वाहनांची प्रचंड गर्दी. महामार्गालगत दीर्घकाळ थांबणे टाळावे।'
        }
      }
    ],
    gridForecast: []
  },
  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    center: [12.9716, 77.5946],
    zoom: 11,
    meteorology: {
      temp: 28.2,
      humidity: 55,
      windSpeed: 14,
      windDirection: 90, // East (Easterly)
      mixingHeight: 650
    },
    stations: [
      {
        id: 'blr_st_1',
        name: 'Silk Board CAAQMS',
        coordinates: [12.9176, 77.6244],
        liveAQI: 182,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 165 }, { time: '15:00', aqi: 170 },
          { time: '18:00', aqi: 195 }, { time: '21:00', aqi: 210 },
          { time: '00:00', aqi: 190 }, { time: '03:00', aqi: 175 },
          { time: '06:00', aqi: 170 }, { time: '09:00', aqi: 182 }
        ]
      },
      {
        id: 'blr_st_2',
        name: 'Peenya Industrial Area CAAQMS',
        coordinates: [13.0285, 77.5197],
        liveAQI: 164,
        dominantPollutant: 'PM10',
        history24h: [
          { time: '12:00', aqi: 140 }, { time: '15:00', aqi: 152 },
          { time: '18:00', aqi: 168 }, { time: '21:00', aqi: 175 },
          { time: '00:00', aqi: 170 }, { time: '03:00', aqi: 162 },
          { time: '06:00', aqi: 158 }, { time: '09:00', aqi: 164 }
        ]
      },
      {
        id: 'blr_st_3',
        name: 'City Railway Station CAAQMS',
        coordinates: [12.9780, 77.5695],
        liveAQI: 122,
        dominantPollutant: 'NO2',
        history24h: [
          { time: '12:00', aqi: 110 }, { time: '15:00', aqi: 112 },
          { time: '18:00', aqi: 125 }, { time: '21:00', aqi: 135 },
          { time: '00:00', aqi: 130 }, { time: '03:00', aqi: 122 },
          { time: '06:00', aqi: 118 }, { time: '09:00', aqi: 122 }
        ]
      }
    ],
    thermalAnomalies: [
      { id: 'blr_ta_1', coordinates: [13.0450, 77.4900], intensity: 10, type: 'Waste Burning', timestamp: '3 hours ago' }
    ],
    wards: [
      {
        id: 'blr_ward_1',
        name: 'Central Silk Board',
        center: [12.9176, 77.6244],
        coordinates: [
          [12.9350, 77.6000],
          [12.9350, 77.6450],
          [12.9000, 77.6450],
          [12.9000, 77.6000]
        ],
        currentAQI: 188,
        currentPM25: 84,
        currentPM10: 162,
        currentNO2: 58,
        currentSO2: 5,
        currentCO: 2.8,
        currentO3: 40,
        sourceAttribution: {
          vehicular: 68,
          industrial: 5,
          constructionDust: 18,
          biomassBurning: 1,
          domesticOthers: 8,
          confidence: 91
        },
        vulnerability: {
          hospitals: 6,
          schools: 14,
          outdoorWorkersDensity: 8,
          vulnerablePopulation: 34.0
        },
        advisories: {
          en: 'Unhealthy AQI. High vehicular emissions and gridlock around Silk Board junction. Commuters should wear masks, roll up car windows, and use recirculated air.',
          kn: 'ಅನಾರೋಗ್ಯಕರ ವಾಯು ಗುಣಮಟ್ಟ. ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಜಂಕ್ಷನ್ ಸುತ್ತಮುತ್ತ ವಾಹನಗಳ ಹೊಗೆ ಹೆಚ್ಚಾಗಿದೆ. ಪ್ರಯಾಣಿಕರು ಮಾಸ್ಕ್ ಧರಿಸಲು ಮತ್ತು ಕಾರಿನ ಕಿಟಕಿ ಮುಚ್ಚಲು ಸಲಹೆ ನೀಡಲಾಗಿದೆ.'
        }
      },
      {
        id: 'blr_ward_2',
        name: 'Peenya Industrial Layout',
        center: [13.0285, 77.5197],
        coordinates: [
          [13.0500, 77.4900],
          [13.0500, 77.5400],
          [13.0100, 77.5400],
          [13.0100, 77.4900]
        ],
        currentAQI: 162,
        currentPM25: 72,
        currentPM10: 145,
        currentNO2: 46,
        currentSO2: 16,
        currentCO: 1.9,
        currentO3: 32,
        sourceAttribution: {
          vehicular: 20,
          industrial: 52,
          constructionDust: 15,
          biomassBurning: 3,
          domesticOthers: 10,
          confidence: 88
        },
        vulnerability: {
          hospitals: 3,
          schools: 8,
          outdoorWorkersDensity: 9,
          vulnerablePopulation: 45.2
        },
        advisories: {
          en: 'Moderate to Poor. Peenya industrial zone emitting lead and heavy metals in dust. Sensitive individuals should avoid early morning physical activity.',
          kn: 'ಮಧ್ಯಮ ವಾಯು ಮಾಲಿನ್ಯ. ಪೀಣ್ಯ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶದಲ್ಲಿ ಧೂಳು ಅಧಿಕವಾಗಿದೆ. ಬೆಳಗಿನ ಜಾವ ಶ್ವಾಸಕೋಶದ ತೊಂದರೆ ಇರುವವರು ಹೊರಹೋಗುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿ.'
        }
      },
      {
        id: 'blr_ward_3',
        name: 'Whitefield',
        center: [12.9698, 77.7499],
        coordinates: [
          [12.9900, 77.7200],
          [12.9900, 77.7700],
          [12.9500, 77.7700],
          [12.9500, 77.7200]
        ],
        currentAQI: 156,
        currentPM25: 68,
        currentPM10: 130,
        currentNO2: 34,
        currentSO2: 4,
        currentCO: 1.2,
        currentO3: 38,
        sourceAttribution: {
          vehicular: 35,
          industrial: 8,
          constructionDust: 45,
          biomassBurning: 2,
          domesticOthers: 10,
          confidence: 85
        },
        vulnerability: {
          hospitals: 4,
          schools: 16,
          outdoorWorkersDensity: 7,
          vulnerablePopulation: 38.0
        },
        advisories: {
          en: 'Moderate AQI. High construction activity and unpaved roads in IT corridors. Speed limits on heavy vehicles enforced to settle dust.',
          kn: 'ಮಧ್ಯಮ ವಾಯು ಗುಣಮಟ್ಟ. ವೈಟ್‌ಫೀಲ್ಡ್ ಸುತ್ತಮುತ್ತ ರಸ್ತೆ ಮತ್ತು ಮೆಟ್ರೋ ಕಾಮಗಾರಿ ಧೂಳು ಹೆಚ್ಚಾಗಿದೆ. ನೀರು ಸಿಂಪಡಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ.'
        }
      },
      {
        id: 'blr_ward_4',
        name: 'Jayanagar',
        center: [12.9307, 77.5832],
        coordinates: [
          [12.9450, 77.5650],
          [12.9450, 77.6000],
          [12.9150, 77.6000],
          [12.9150, 77.5650]
        ],
        currentAQI: 98,
        currentPM25: 32,
        currentPM10: 64,
        currentNO2: 24,
        currentSO2: 2,
        currentCO: 0.8,
        currentO3: 42,
        sourceAttribution: {
          vehicular: 48,
          industrial: 2,
          constructionDust: 12,
          biomassBurning: 1,
          domesticOthers: 37,
          confidence: 82
        },
        vulnerability: {
          hospitals: 8,
          schools: 22,
          outdoorWorkersDensity: 3,
          vulnerablePopulation: 22.4
        },
        advisories: {
          en: 'Satisfactory AQI. Canopy cover of Jayanagar keeps local temperature and dust loads lower. Safe for outdoor walks.',
          kn: 'ತೃಪ್ತಿದಾಯಕ ವಾಯು ಗುಣಮಟ್ಟ. ಜಯನಗರದ ಹಸಿರು ವಾತಾವರಣವು ಮಾಲಿನ್ಯ ಮಟ್ಟವನ್ನು ಕಮ್ಮಿ ಇರಿಸಿದೆ. ವಾಕಿಂಗ್ ಮಾಡಲು ಸುರಕ್ಷಿತ.'
        }
      },
      {
        id: 'blr_ward_5',
        name: 'Electronic City Phase 1',
        center: [12.8487, 77.6747],
        coordinates: [
          [12.8700, 77.6500],
          [12.8700, 77.7000],
          [12.8200, 77.7000],
          [12.8200, 77.6500]
        ],
        currentAQI: 130,
        currentPM25: 52,
        currentPM10: 98,
        currentNO2: 30,
        currentSO2: 4,
        currentCO: 1.1,
        currentO3: 46,
        sourceAttribution: {
          vehicular: 55,
          industrial: 10,
          constructionDust: 20,
          biomassBurning: 2,
          domesticOthers: 13,
          confidence: 84
        },
        vulnerability: {
          hospitals: 2,
          schools: 10,
          outdoorWorkersDensity: 5,
          vulnerablePopulation: 28.5
        },
        advisories: {
          en: 'Moderate AQI. High traffic on flyover during office hours. Restrict long exposure near highway ramps.',
          kn: 'ಮಧ್ಯಮ ವಾಯು ಗುಣಮಟ್ಟ. ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಮೇಲ್ಸೇತುವೆಯ ಬಳಿ ವಾಹನ ದಟ್ಟಣೆ ಸಮಯದಲ್ಲಿ ಮಾಸ್ಕ್ ಬಳಸಿ.'
        }
      }
    ],
    gridForecast: []
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai',
    center: [13.0827, 80.2707],
    zoom: 11,
    meteorology: {
      temp: 32.5,
      humidity: 78,
      windSpeed: 16,
      windDirection: 120, // SE (Sea breeze)
      mixingHeight: 680
    },
    stations: [
      {
        id: 'chn_st_1',
        name: 'Ennore CAAQMS',
        coordinates: [13.2161, 80.3247],
        liveAQI: 185,
        dominantPollutant: 'SO2',
        history24h: [
          { time: '12:00', aqi: 160 }, { time: '15:00', aqi: 172 },
          { time: '18:00', aqi: 185 }, { time: '21:00', aqi: 195 },
          { time: '00:00', aqi: 200 }, { time: '03:00', aqi: 190 },
          { time: '06:00', aqi: 180 }, { time: '09:00', aqi: 185 }
        ]
      },
      {
        id: 'chn_st_2',
        name: 'T. Nagar CAAQMS',
        coordinates: [13.0418, 80.2341],
        liveAQI: 142,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 120 }, { time: '15:00', aqi: 125 },
          { time: '18:00', aqi: 138 }, { time: '21:00', aqi: 155 },
          { time: '00:00', aqi: 150 }, { time: '03:00', aqi: 140 },
          { time: '06:00', aqi: 135 }, { time: '09:00', aqi: 142 }
        ]
      },
      {
        id: 'chn_st_3',
        name: 'Adyar CAAQMS',
        coordinates: [13.0033, 80.2550],
        liveAQI: 96,
        dominantPollutant: 'NO2',
        history24h: [
          { time: '12:00', aqi: 80 }, { time: '15:00', aqi: 85 },
          { time: '18:00', aqi: 92 }, { time: '21:00', aqi: 105 },
          { time: '00:00', aqi: 100 }, { time: '03:00', aqi: 95 },
          { time: '06:00', aqi: 90 }, { time: '09:00', aqi: 96 }
        ]
      }
    ],
    thermalAnomalies: [
      { id: 'chn_ta_1', coordinates: [13.2300, 80.2900], intensity: 32, type: 'Industrial Flare', timestamp: '4 hours ago' }
    ],
    wards: [
      {
        id: 'chn_ward_1',
        name: 'Ennore Port Industrial',
        center: [13.2161, 80.3247],
        coordinates: [
          [13.2400, 80.2900],
          [13.2400, 80.3400],
          [13.1900, 80.3400],
          [13.1900, 80.2900]
        ],
        currentAQI: 192,
        currentPM25: 75,
        currentPM10: 155,
        currentNO2: 54,
        currentSO2: 45,
        currentCO: 2.0,
        currentO3: 30,
        sourceAttribution: {
          vehicular: 15,
          industrial: 62,
          constructionDust: 12,
          biomassBurning: 3,
          domesticOthers: 8,
          confidence: 94
        },
        vulnerability: {
          hospitals: 2,
          schools: 7,
          outdoorWorkersDensity: 9,
          vulnerablePopulation: 28.0
        },
        advisories: {
          en: 'Unhealthy air quality. High SO2 emissions. Residents should keep windows closed and avoid outdoor activities during periods of light onshore wind.',
          ta: 'ஆபத்தான காற்று தரம். அதிக சல்பர் டை ஆக்சைடு உமிழ்வு. கடற்கரை காற்று குறையும் போது ஜன்னல்களை மூடி வைக்கவும்.'
        }
      },
      {
        id: 'chn_ward_2',
        name: 'T. Nagar Commercial',
        center: [13.0418, 80.2341],
        coordinates: [
          [13.0550, 80.2150],
          [13.0550, 80.2500],
          [13.0250, 80.2500],
          [13.0250, 80.2150]
        ],
        currentAQI: 145,
        currentPM25: 56,
        currentPM10: 110,
        currentNO2: 42,
        currentSO2: 6,
        currentCO: 1.8,
        currentO3: 40,
        sourceAttribution: {
          vehicular: 65,
          industrial: 2,
          constructionDust: 18,
          biomassBurning: 1,
          domesticOthers: 14,
          confidence: 87
        },
        vulnerability: {
          hospitals: 4,
          schools: 12,
          outdoorWorkersDensity: 8,
          vulnerablePopulation: 36.4
        },
        advisories: {
          en: 'Moderate AQI. Major vehicular congestion in retail hub. Avoid active commute during peak evening shopping hours.',
          ta: 'மிதமான காற்று தரம். வாகன நெரிசல் அதிகம் உள்ள பகுதி. மாலை நேர நெரிசல் நேரங்களில் நடமாடுவதைத் தவிர்க்கவும்.'
        }
      },
      {
        id: 'chn_ward_3',
        name: 'Adyar Residential',
        center: [13.0033, 80.2550],
        coordinates: [
          [13.0200, 80.2350],
          [13.0200, 80.2750],
          [12.9850, 80.2750],
          [12.9850, 80.2350]
        ],
        currentAQI: 92,
        currentPM25: 28,
        currentPM10: 58,
        currentNO2: 20,
        currentSO2: 2,
        currentCO: 0.6,
        currentO3: 48,
        sourceAttribution: {
          vehicular: 45,
          industrial: 1,
          constructionDust: 14,
          biomassBurning: 0,
          domesticOthers: 40,
          confidence: 80
        },
        vulnerability: {
          hospitals: 3,
          schools: 15,
          outdoorWorkersDensity: 3,
          vulnerablePopulation: 19.8
        },
        advisories: {
          en: 'Satisfactory air quality. Strong oceanic dispersal. Suitable for morning exercise and children playing outdoor.',
          ta: 'திருப்திகரமான காற்று தரம். கடல் காற்று காரணமாக காற்று தூய்மையாக உள்ளது. உடற்பயிற்சி செய்ய ஏற்றது.'
        }
      },
      {
        id: 'chn_ward_4',
        name: 'Guindy Industrial Estate',
        center: [13.0067, 80.2206],
        coordinates: [
          [13.0250, 80.2000],
          [13.0250, 80.2350],
          [12.9900, 80.2350],
          [12.9900, 80.2000]
        ],
        currentAQI: 135,
        currentPM25: 50,
        currentPM10: 95,
        currentNO2: 38,
        currentSO2: 8,
        currentCO: 1.4,
        currentO3: 35,
        sourceAttribution: {
          vehicular: 40,
          industrial: 35,
          constructionDust: 15,
          biomassBurning: 2,
          domesticOthers: 8,
          confidence: 86
        },
        vulnerability: {
          hospitals: 5,
          schools: 10,
          outdoorWorkersDensity: 7,
          vulnerablePopulation: 25.6
        },
        advisories: {
          en: 'Moderate AQI. Local small scale industries and cargo logistics causing exhaust emissions. Ensure proper workshop ventilation.',
          ta: 'மிதமான காற்று தரம். தொழிற்சாலை மற்றும் கனரக வாகன உமிழ்வு. பட்டறைகளில் காற்று வசதியை உறுதி செய்யவும்.'
        }
      },
      {
        id: 'chn_ward_5',
        name: 'Royapuram Harbour',
        center: [13.1137, 80.2954],
        coordinates: [
          [13.1350, 80.2750],
          [13.1350, 80.3150],
          [13.0950, 80.3150],
          [13.0950, 80.2750]
        ],
        currentAQI: 165,
        currentPM25: 68,
        currentPM10: 140,
        currentNO2: 48,
        currentSO2: 12,
        currentCO: 2.2,
        currentO3: 38,
        sourceAttribution: {
          vehicular: 50,
          industrial: 20,
          constructionDust: 18,
          biomassBurning: 2,
          domesticOthers: 10,
          confidence: 89
        },
        vulnerability: {
          hospitals: 3,
          schools: 8,
          outdoorWorkersDensity: 9,
          vulnerablePopulation: 40.2
        },
        advisories: {
          en: 'Poor air quality. High concentration of shipping freight vehicles. Port workers are advised to carry filters.',
          ta: 'ஆபத்தான காற்று தரம். துறைமுக லாரி உமிழ்வு அதிகம். துறைமுக பணியாளர்கள் முகக்கவசம் அணிய வேண்டும்.'
        }
      }
    ],
    gridForecast: []
  },
  kolkata: {
    id: 'kolkata',
    name: 'Kolkata',
    center: [22.5726, 88.3639],
    zoom: 11,
    meteorology: {
      temp: 29.8,
      humidity: 70,
      windSpeed: 10,
      windDirection: 180, // South (Southerly)
      mixingHeight: 520
    },
    stations: [
      {
        id: 'kol_st_1',
        name: 'Howrah CAAQMS',
        coordinates: [22.5851, 88.3186],
        liveAQI: 196,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 175 }, { time: '15:00', aqi: 180 },
          { time: '18:00', aqi: 198 }, { time: '21:00', aqi: 215 },
          { time: '00:00', aqi: 210 }, { time: '03:00', aqi: 200 },
          { time: '06:00', aqi: 192 }, { time: '09:00', aqi: 196 }
        ]
      },
      {
        id: 'kol_st_2',
        name: 'Victoria Memorial CAAQMS',
        coordinates: [22.5448, 88.3425],
        liveAQI: 135,
        dominantPollutant: 'PM2.5',
        history24h: [
          { time: '12:00', aqi: 115 }, { time: '15:00', aqi: 120 },
          { time: '18:00', aqi: 132 }, { time: '21:00', aqi: 145 },
          { time: '00:00', aqi: 140 }, { time: '03:00', aqi: 132 },
          { time: '06:00', aqi: 128 }, { time: '09:00', aqi: 135 }
        ]
      },
      {
        id: 'kol_st_3',
        name: 'Salt Lake Sector 5 CAAQMS',
        coordinates: [22.5804, 88.4378],
        liveAQI: 154,
        dominantPollutant: 'PM10',
        history24h: [
          { time: '12:00', aqi: 130 }, { time: '15:00', aqi: 135 },
          { time: '18:00', aqi: 148 }, { time: '21:00', aqi: 165 },
          { time: '00:00', aqi: 160 }, { time: '03:00', aqi: 152 },
          { time: '06:00', aqi: 148 }, { time: '09:00', aqi: 154 }
        ]
      }
    ],
    thermalAnomalies: [
      { id: 'kol_ta_1', coordinates: [22.6100, 88.3000], intensity: 18, type: 'Waste Burning', timestamp: '2 hours ago' }
    ],
    wards: [
      {
        id: 'kol_ward_1',
        name: 'Howrah Junction Area',
        center: [22.5851, 88.3186],
        coordinates: [
          [22.6050, 88.2950],
          [22.6050, 88.3350],
          [22.5650, 88.3350],
          [22.5650, 88.2950]
        ],
        currentAQI: 202,
        currentPM25: 96,
        currentPM10: 175,
        currentNO2: 50,
        currentSO2: 10,
        currentCO: 2.6,
        currentO3: 35,
        sourceAttribution: {
          vehicular: 55,
          industrial: 25,
          constructionDust: 10,
          biomassBurning: 5,
          domesticOthers: 5,
          confidence: 90
        },
        vulnerability: {
          hospitals: 5,
          schools: 12,
          outdoorWorkersDensity: 9,
          vulnerablePopulation: 55.2
        },
        advisories: {
          en: 'Poor air quality. High soot and transport emissions. Elderly and children should avoid long exposures near Howrah station grids.',
          bn: 'বাজে বাতাস। হাওড়া স্টেশন চত্বরে সূক্ষ্ম ধূলিকণা ও পরিবহন ধোঁয়ার প্রকোপ বেশি। শিশু ও বয়স্কদের দীর্ঘক্ষণ বাইরে থাকা এড়ানোর পরামর্শ।'
        }
      },
      {
        id: 'kol_ward_2',
        name: 'Salt Lake Sector V',
        center: [22.5804, 88.4378],
        coordinates: [
          [22.6000, 88.4150],
          [22.6000, 88.4600],
          [22.5600, 88.4600],
          [22.5600, 88.4150]
        ],
        currentAQI: 158,
        currentPM25: 62,
        currentPM10: 125,
        currentNO2: 36,
        currentSO2: 5,
        currentCO: 1.1,
        currentO3: 44,
        sourceAttribution: {
          vehicular: 48,
          industrial: 8,
          constructionDust: 30,
          biomassBurning: 2,
          domesticOthers: 12,
          confidence: 86
        },
        vulnerability: {
          hospitals: 2,
          schools: 9,
          outdoorWorkersDensity: 5,
          vulnerablePopulation: 19.5
        },
        advisories: {
          en: 'Moderate AQI. Office traffic peaks and metro construction dust. Encourage use of green public transport.',
          bn: 'মাঝারি বায়ু দূষণ। অফিস সময়ের ট্রাফিক এবং মেট্রো নির্মাণের ধুলো বেশি। সরকারি পরিবহন ব্যবহারের পরামর্শ দেওয়া হচ্ছে।'
        }
      },
      {
        id: 'kol_ward_3',
        name: 'Ballygunge Park',
        center: [22.5290, 88.3695],
        coordinates: [
          [22.5450, 88.3500],
          [22.5450, 88.3900],
          [22.5100, 88.3900],
          [22.5100, 88.3500]
        ],
        currentAQI: 128,
        currentPM25: 48,
        currentPM10: 95,
        currentNO2: 28,
        currentSO2: 4,
        currentCO: 0.9,
        currentO3: 52,
        sourceAttribution: {
          vehicular: 58,
          industrial: 2,
          constructionDust: 15,
          biomassBurning: 3,
          domesticOthers: 22,
          confidence: 83
        },
        vulnerability: {
          hospitals: 4,
          schools: 15,
          outdoorWorkersDensity: 4,
          vulnerablePopulation: 16.8
        },
        advisories: {
          en: 'Moderate air quality. Traffic emissions around Gariahat corridor. People with asthma should carry inhalers.',
          bn: 'মাঝারি বাতাস। গড়িয়াহাট মোড়ের কাছে যানবাহনের ধোঁয়ার আধিক্য। হাঁপানি রোগীরা বাইরে বের হলে ইনহেলার সাথে রাখুন।'
        }
      },
      {
        id: 'kol_ward_4',
        name: 'Behala Residential',
        center: [22.4984, 88.3168],
        coordinates: [
          [22.5150, 88.2950],
          [22.5150, 88.3350],
          [22.4800, 88.3350],
          [22.4800, 88.2950]
        ],
        currentAQI: 165,
        currentPM25: 66,
        currentPM10: 135,
        currentNO2: 32,
        currentSO2: 6,
        currentCO: 1.4,
        currentO3: 39,
        sourceAttribution: {
          vehicular: 45,
          industrial: 10,
          constructionDust: 28,
          biomassBurning: 8,
          domesticOthers: 9,
          confidence: 85
        },
        vulnerability: {
          hospitals: 3,
          schools: 14,
          outdoorWorkersDensity: 7,
          vulnerablePopulation: 42.0
        },
        advisories: {
          en: 'Unhealthy for sensitive groups. Heavy construction dust. Anti-smog water sprinklers advised during dry hours.',
          bn: 'সংবেদনশীল ব্যক্তিদের জন্য বাতাস অস্বাস্থ্যকর। অতিরিক্ত ধুলোবালি। শুকনো আবহাওয়ায় জল ছিটানোর পরামর্শ।'
        }
      },
      {
        id: 'kol_ward_5',
        name: 'Bara Bazar Commercial',
        center: [22.5797, 88.3512],
        coordinates: [
          [22.5950, 88.3350],
          [22.5950, 88.3700],
          [22.5650, 88.3700],
          [22.5650, 88.3350]
        ],
        currentAQI: 198,
        currentPM25: 92,
        currentPM10: 168,
        currentNO2: 52,
        currentSO2: 9,
        currentCO: 2.9,
        currentO3: 33,
        sourceAttribution: {
          vehicular: 60,
          industrial: 12,
          constructionDust: 10,
          biomassBurning: 4,
          domesticOthers: 14,
          confidence: 88
        },
        vulnerability: {
          hospitals: 3,
          schools: 6,
          outdoorWorkersDensity: 10,
          vulnerablePopulation: 48.6
        },
        advisories: {
          en: 'Poor air quality. High concentration of commercial loading/unloading cargo vehicles. Wear mask in active market hours.',
          bn: 'বাজে বাতাস। পাইকারি বাজারের এলাকায় পণ্যবাহী লরির নির্গमन ও ভিড় বেশি। বাজারে কেনাকাটার সময় মাস্ক ব্যবহার করুন।'
        }
      }
    ],
    gridForecast: []
  }
};

// Generates a grid of 64 cells (8x8) representing 1km grid squares centered around coordinates.
// We model a slight dispersion gradient influenced by prevailing wind directions in mock calculations.
function generateGrid(
  minBound: [number, number],
  maxBound: [number, number],
  minAqi: number,
  maxAqi: number
): GridCell[] {
  const cells: GridCell[] = [];
  const latStep = (maxBound[0] - minBound[0]) / 8;
  const lonStep = (maxBound[1] - minBound[1]) / 8;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const latStart = minBound[0] + i * latStep;
      const latEnd = latStart + latStep;
      const lonStart = minBound[1] + j * lonStep;
      const lonEnd = lonStart + lonStep;

      // Create a slight dispersion effect (e.g. higher in the NE or center)
      const distFromCenter = Math.sqrt(Math.pow(i - 3.5, 2) + Math.pow(j - 3.5, 2));
      const centerFactor = 1 - (distFromCenter / 5);
      const cellAqi = Math.max(
        Math.floor(minAqi + (maxAqi - minAqi) * Math.max(0, centerFactor) + Math.random() * 20),
        minAqi
      );

      cells.push({
        id: `grid_${i}_${j}`,
        coordinates: [
          [latStart, lonStart],
          [latStart, lonEnd],
          [latEnd, lonEnd],
          [latEnd, lonStart]
        ],
        aqi: cellAqi
      });
    }
  }

  return cells;
}

// Generate grids for all cities
METROS.delhi.gridForecast = generateGrid([28.5000, 77.0000], [28.7000, 77.3500], 210, 330);
METROS.mumbai.gridForecast = generateGrid([19.0000, 72.7500], [19.1800, 72.9800], 90, 190);
METROS.bengaluru.gridForecast = generateGrid([12.8000, 77.4500], [13.0800, 77.7800], 95, 190);
METROS.chennai.gridForecast = generateGrid([12.9500, 80.1500], [13.2500, 80.3500], 90, 195);
METROS.kolkata.gridForecast = generateGrid([22.4500, 88.2500], [22.6500, 88.4800], 120, 210);

export const COMPARATIVE_METRICS = {
  averageAqi: [
    { city: 'Delhi', aqi: 218, pm25: 125, pm10: 220, no2: 44 },
    { city: 'Mumbai', aqi: 138, pm25: 58, pm10: 105, no2: 32 },
    { city: 'Bengaluru', aqi: 125, pm25: 48, pm10: 98, no2: 38 },
    { city: 'Chennai', aqi: 122, pm25: 45, pm10: 92, no2: 24 },
    { city: 'Kolkata', aqi: 168, pm25: 75, pm10: 135, no2: 36 }
  ],
  interventionEffectiveness: [
    { name: 'Water Sprinklers', cost: 'Low', impact: 'High (PM10)', delay: 'Immediate', rating: 85, desc: 'Suppresses road dust locally; extremely effective during dry seasons.' },
    { name: 'Traffic Restrictions (Odd-Even)', cost: 'High', impact: 'Moderate (NO2)', delay: '24 Hours', rating: 68, desc: 'Reduces peak tailpipe emissions; needs high administrative overhead.' },
    { name: 'Construction Bans', cost: 'High', impact: 'Critical (PM10/2.5)', delay: '12 Hours', rating: 78, desc: 'Halts local particulate dispersion; immediate local improvements.' },
    { name: 'Stubble Burn Subsidies', cost: 'Medium', impact: 'Critical (Regional)', delay: 'Seasonal', rating: 92, desc: 'Prevents massive regional background AQI spikes in northern cities.' },
    { name: 'Industrial Emission Caps', cost: 'Medium', impact: 'High (SO2/NO2)', delay: '48 Hours', rating: 82, desc: 'Auditing combustion stacks; reduces chemical background smog.' }
  ]
};
