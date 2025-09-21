const packingDispatchData = {
    packingLines: [
        { id: 1, type: '50kg Bags', status: 'operational', efficiency: 95, currentSpeed: 2800, targetSpeed: 3000, rejects: 0.5, downtime: 15 },
        { id: 2, type: 'Jumbo Bags', status: 'maintenance', efficiency: 0, currentSpeed: 0, targetSpeed: 120, rejects: 0, downtime: 180 },
        { id: 3, type: 'Bulk Loading', status: 'operational', efficiency: 88, currentSpeed: 180, targetSpeed: 200, rejects: 0.2, downtime: 30 }
    ],
    dispatchQueue: [
        { id: 'TRK-2025-089', type: 'Bulk Tanker', quantity: 30, destination: 'Site A Construction', status: 'loading', arrivalTime: '08:30', expectedDispatch: '09:15' },
        { id: 'TRK-2025-090', type: '50kg Bags', quantity: 800, destination: 'Distributor B', status: 'waiting', arrivalTime: '08:45', expectedDispatch: '09:30' },
        { id: 'TRK-2025-091', type: 'Jumbo Bags', quantity: 40, destination: 'Project Site C', status: 'documentation', arrivalTime: '08:15', expectedDispatch: '09:00' }
    ],
    hourlyDispatch: Array.from({ length: 12 }, (_, i) => ({ hour: `${i*2}:00`, bags: Math.floor(2500 + Math.random() * 1000), bulk: Math.floor(150 + Math.random() * 100), jumbo: Math.floor(80 + Math.random() * 40) })),
    qualityMetrics: { bagWeight: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 50 + (Math.random() * 0.4 - 0.2), upper: 50.2, lower: 49.8 })), tearRate: 0.3, printQuality: 99.2, moistureContent: 0.4 },
    packingMaterial: { bags: { current: 25000, minimum: 15000 }, pallets: { current: 450, minimum: 300 }, shrinkWrap: { current: 15, minimum: 10 } },
    alerts: [ { severity: 'warning', message: 'Packing Line 2 under maintenance - ETA 2 hours' }, { severity: 'info', message: 'Bag inventory approaching minimum threshold' } ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Omron', model: 'NJ-Series', ip: '192.168.10.19' }, scada: { hmiScreens: ['Packing Lines'], historianTagPrefix: 'pkg.' }, controlTags: { 'Packing Speed': 'pkg.line.speed', 'Bag Weight': 'pkg.weigher.weight' } },
    gemniAI: { enabled: true, defaultMode: 'recommend', modes: ['monitor', 'recommend'], modelHints: ['line-efficiency', 'rejects-forecaster'] }
};

export default packingDispatchData;
