const qualityControlData = {
    currentStrength: 43,
    strengthTests: Array.from({ length: 24 }, (_, i) => ({ time: i, strength: 32 + Math.random() * 30 })),
    xrayAnalysis: [
        { name: 'CaO', value: 63.4, status: 'optimal' },
        { name: 'SiO2', value: 21.1, status: 'optimal' },
        { name: 'Al2O3', value: 5.7, status: 'optimal' }
    ],
    recentTests: Array.from({ length: 10 }, (_, i) => ({ time: `${i*2}:00`, settingTime: 120 + Math.floor(Math.random() * 60), strength: 30 + Math.round(Math.random() * 15) })),
    plcScada: { controlEnabled: false, plcController: { vendor: 'None', model: 'n/a' }, scada: { hmiScreens: ['QC Dashboard'], historianTagPrefix: 'qc.' }, controlTags: {} },
    gemniAI: { enabled: true, defaultMode: 'recommend', modes: ['monitor', 'recommend'], modelHints: ['strength-predictor'] }
};

export default qualityControlData;
