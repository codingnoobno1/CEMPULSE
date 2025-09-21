const cementStorageData = {
    silos: [
        { id: 1, type: 'OPC', capacity: 5000, currentLevel: 3950, temperature: 28, humidity: 0.45, lastRefilled: '2025-09-02T09:15:00', status: 'operational' },
        { id: 2, type: 'PPC', capacity: 4000, currentLevel: 2300, temperature: 29, humidity: 0.55, lastRefilled: '2025-09-02T07:00:00', status: 'operational' },
        { id: 3, type: 'PSC', capacity: 3000, currentLevel: 600, temperature: 27, humidity: 0.65, lastRefilled: '2025-09-01T23:00:00', status: 'low_inventory' }
    ],
    materialMovement: {
        inflow: Array.from({ length: 12 }, (_, i) => ({ hour: `${i*2}:00`, OPC: Math.floor(80 + Math.random() * 40), PPC: Math.floor(60 + Math.random() * 30), PSC: Math.floor(40 + Math.random() * 20) })),
        outflow: Array.from({ length: 12 }, (_, i) => ({ hour: `${i*2}:00`, OPC: Math.floor(70 + Math.random() * 40), PPC: Math.floor(50 + Math.random() * 30), PSC: Math.floor(30 + Math.random() * 20) }))
    },
    environmentalConditions: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, temperature: 25 + Math.random() * 5, humidity: 0.4 + Math.random() * 0.3 })),
    alerts: [ { severity: 'warning', message: 'Silo 3 (PSC) inventory below 20% capacity' }, { severity: 'info', message: 'Scheduled maintenance for Silo 2 conveyor system tomorrow' } ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Allen-Bradley', model: 'CompactLogix', ip: '192.168.10.18' }, scada: { hmiScreens: ['Cement Storage'], historianTagPrefix: 'cst.' }, controlTags: { 'Bin Level': 'cst.bin.level' } },
    gemniAI: { enabled: true, defaultMode: 'monitor', modes: ['monitor', 'recommend'], modelHints: ['inventory-forecast'] }
};

export default cementStorageData;
