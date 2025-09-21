const preheaterPrecalcinerData = {
  currentTemps: {
    cyclone1: 380,
    cyclone2: 540,
    cyclone3: 720,
    cyclone4: 840,
    precalciner: 880
  },
  energyUsage: {
    current: 3250,
    target: 3000,
    history: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, usage: 3000 + Math.random() * 500, target: 3000 }))
  },
  gasFlow: {
    current: 425,
    history: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, flow: 400 + Math.random() * 50 }))
  },
  temperatureProfile: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, cyclone1: 350 + Math.random() * 60, cyclone2: 520 + Math.random() * 40, cyclone3: 700 + Math.random() * 40, cyclone4: 820 + Math.random() * 40, precalciner: 860 + Math.random() * 40 })),
  emissions: {
    co2: 825,
    nox: 450,
    so2: 200,
    history: Array.from({ length: 12 }, (_, i) => ({ hour: `${i*2}:00`, CO2: 800 + Math.random() * 50, NOx: 440 + Math.random() * 20, SO2: 190 + Math.random() * 20 }))
  },
  alerts: [
    { severity: 'warning', message: 'Cyclone 3 temperature approaching upper limit' },
    { severity: 'info', message: 'Energy consumption above target threshold' }
  ]
};

export default preheaterPrecalcinerData;
