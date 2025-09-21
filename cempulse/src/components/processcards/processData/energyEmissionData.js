const energyEmissionData = {
    powerConsumption: { current: { total: 42000, breakdown: [ { name: 'Grinding', value: 18500 }, { name: 'Kiln', value: 15000 }, { name: 'Packing', value: 4500 }, { name: 'Others', value: 4000 } ] }, historical: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, consumption: 38000 + Math.random() * 9000, target: 45000 })) },
    emissions: { current: { co2: 780, nox: 370, sox: 92, dust: 26 }, limits: { co2: 800, nox: 400, sox: 100, dust: 30 }, historical: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, co2: 750 + Math.random() * 100, nox: 360 + Math.random() * 80, sox: 90 + Math.random() * 20, dust: 25 + Math.random() * 10 })) },
    energyEfficiency: { current: 107, target: 112, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 105 + Math.random() * 10 })) },
    environmentalMetrics: { temperature: 37, humidity: 44, windSpeed: 11, windDirection: 'NW', pressure: 1012 },
    carbonCredit: { current: 2800, target: 3000, history: Array.from({ length: 12 }, (_, i) => ({ month: `${i+1}`, value: 2700 + Math.random() * 500 })) },
    alerts: [ { severity: 'warning', message: 'NOx emissions approaching limit' }, { severity: 'info', message: 'Energy efficiency above target' } ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Honeywell', model: 'Experion', ip: '192.168.10.20' }, scada: { hmiScreens: ['Energy & Emission'], historianTagPrefix: 'ene.' }, controlTags: { 'Power Consumption': 'ene.power.total', 'CO₂ Emissions': 'ene.emissions.co2' } },
    gemniAI: { enabled: true, defaultMode: 'monitor', modes: ['monitor', 'recommend'], modelHints: ['energy-optimizer', 'emissions-forecaster'] }
};

export default energyEmissionData;
