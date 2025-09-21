const cementGrindingData = {
    millPerformance: {
        speed: 86,
        load: 79,
        powerDraw: 4300,
        temperature: 96,
        history: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, speed: 80 + Math.random() * 10, load: 75 + Math.random() * 12, temperature: 90 + Math.random() * 12 }))
    },
    fineness: {
        current: 382,
        target: 375,
        distribution: [ { size: '<32μm', percentage: 36 }, { size: '32-45μm', percentage: 39 }, { size: '45-63μm', percentage: 20 }, { size: '>63μm', percentage: 5 } ],
        history: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, value: 370 + Math.random() * 25, target: 375 }))
    },
    additives: {
        gypsum: { target: 5, current: 4.9 },
        limestone: { target: 8, current: 7.95 },
        pozzolana: { target: 12, current: 11.7 },
        history: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, gypsum: 4.5 + Math.random() * 0.6, limestone: 7.5 + Math.random() * 0.8, pozzolana: 11.5 + Math.random() * 1 }))
    },
    energyEfficiency: { current: 51, target: 50, history: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, value: 48 + Math.random() * 8 })) },
    productionRate: { current: 96, target: 100, hourly: Array.from({ length: 12 }, (_, i) => ({ hour: `${i*2}:00`, value: 90 + Math.random() * 20 })) },
    alerts: [ { severity: 'warning', message: 'Mill temperature approaching upper limit' }, { severity: 'info', message: 'Gypsum feed rate optimization recommended' } ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Siemens', model: 'S7-1500', ip: '192.168.10.17' }, scada: { hmiScreens: ['Grinding Line'], historianTagPrefix: 'cgr.' }, controlTags: { 'Mill Load': 'cgr.mill.load', 'Fineness': 'cgr.fineness' } },
    gemniAI: { enabled: true, defaultMode: 'autotune', modes: ['monitor', 'recommend', 'autotune'], modelHints: ['separator-tuner', 'fineness-predictor'] }
};

export default cementGrindingData;
