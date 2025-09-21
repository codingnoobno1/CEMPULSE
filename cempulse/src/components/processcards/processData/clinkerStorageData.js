const clinkerStorageData = {
    siloStatus: {
        totalCapacity: 50000,
        currentStock: 36000,
        silos: [
            { id: 1, capacity: 15000, current: 12500, type: 'Fresh Clinker' },
            { id: 2, capacity: 15000, current: 9500, type: 'Fresh Clinker' },
            { id: 3, capacity: 20000, current: 14000, type: 'Aged Clinker' }
        ]
    },
    environmental: {
        temperature: 46,
        humidity: 36,
        pressure: 1.02,
        history: Array.from({ length: 24 }, (_, i) => ({ timestamp: `${i}:00`, temperature: 40 + Math.random() * 10, humidity: 30 + Math.random() * 10, pressure: 1 + Math.random() * 0.1 }))
    },
    quality: {
        samples: Array.from({ length: 10 }, (_, i) => ({ time: `${i*2}:00`, moisture: (2 + Math.random()).toFixed(2), size: (25 + Math.random() * 10).toFixed(1), temperature: (40 + Math.random() * 5).toFixed(1) })),
        distribution: [ { name: 'Premium', value: 60 }, { name: 'Standard', value: 30 }, { name: 'Under Review', value: 10 } ]
    },
    stockMovement: {
        incoming: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000 + 500)),
        outgoing: Array.from({ length: 12 }, () => Math.floor(Math.random() * 800 + 400)),
        times: Array.from({ length: 12 }, (_, i) => `${i*2}:00`)
    },
    alerts: [
        { severity: 'warning', message: 'Silo 2 stock level below 70%' },
        { severity: 'info', message: 'Temperature variation detected in Silo 1' }
    ],
    plcScada: {
        controlEnabled: false,
        plcController: { vendor: 'None', model: 'n/a' },
        scada: { hmiScreens: ['Storage Overview'], historianTagPrefix: 'stg.' },
        controlTags: {}
    },
    gemniAI: {
        enabled: true,
        defaultMode: 'monitor',
        modes: [{ id: 'monitor', description: 'Monitor storage conditions and suggest dispatch scheduling' }],
        modelHints: ['stock-depletion-prediction']
    }
};

export default clinkerStorageData;
