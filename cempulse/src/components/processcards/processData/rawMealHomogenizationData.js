const rawMealHomogenizationData = {
  currentMoisture: 7.2,
  blendingEfficiency: 94,
  airFlow: 850,
  temperature: 65,
  chemicalComposition: {
    current: [
      { parameter: 'CaO', value: 63.5, min: 62, max: 65 },
      { parameter: 'SiO2', value: 21.2, min: 20, max: 22 },
      { parameter: 'Al2O3', value: 5.8, min: 5, max: 6.5 },
      { parameter: 'Fe2O3', value: 3.2, min: 2.5, max: 3.5 },
      { parameter: 'MgO', value: 2.1, min: 1.5, max: 2.5 }
    ],
    history: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      CaO: 63 + Math.random() * 2,
      SiO2: 21 + Math.random(),
      Al2O3: 5.5 + Math.random(),
      Fe2O3: 3 + Math.random() * 0.5,
      MgO: 2 + Math.random() * 0.5
    }))
  },
  moistureHistory: Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    moisture: 7 + Math.random() * 0.5,
    target: 7.2
  })),
  blendingData: [
    { axis: 'Uniformity', value: 94 },
    { axis: 'Mix Quality', value: 92 },
    { axis: 'Particle Size', value: 88 },
    { axis: 'Flow Rate', value: 95 },
    { axis: 'Density', value: 91 }
  ],
  siloLevels: [
    { name: 'Silo 1', level: 85, material: 'High CaO' },
    { name: 'Silo 2', level: 72, material: 'High SiO2' },
    { name: 'Silo 3', level: 64, material: 'High Al2O3' },
    { name: 'Silo 4', level: 91, material: 'Standard Mix' }
  ],
  alerts: [
    { severity: 'success', message: 'Blending efficiency within optimal range' },
    { severity: 'info', message: 'Silo 3 level below 70% - Consider refilling' }
  ]
};

export default rawMealHomogenizationData;
