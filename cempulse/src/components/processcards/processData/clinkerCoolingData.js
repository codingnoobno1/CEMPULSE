const random = (min, max) => Math.round(min + Math.random() * (max - min));

const historySeries = (len, fn) => Array.from({ length: len }, (_, i) => ({ timestamp: `${i}:00`, ...fn(i) }));

const clinkerCoolingData = {
    coolerTemperatures: {
        inlet: 1320,
        midSection: 820,
        outlet: 160,
        history: historySeries(24, (i) => ({ inlet: 1250 + random(0, 160), midSection: 760 + random(0, 140), outlet: 130 + random(0, 60) }))
    },
    airFlow: {
        primary: 82,
        secondary: 68,
        history: historySeries(24, (i) => ({ primary: 78 + random(0, 12), secondary: 60 + random(0, 14) }))
    },
    pressure: {
        current: 1.18,
        history: historySeries(24, (i) => ({ value: +(1.05 + Math.random() * 0.3).toFixed(2), threshold: 1.4 }))
    },
    clinkerQuality: {
        temperature: 182,
        size: Array.from({ length: 20 }, () => ({ size: random(20, 70), temperature: random(150, 210) }))
    },
    coolingEfficiency: {
        current: 87,
        target: 90,
        history: historySeries(24, (i) => ({ efficiency: 84 + Math.random() * 8 }))
    },
    alerts: [
        { severity: 'warning', message: 'Inlet temperature fluctuation detected' },
        { severity: 'info', message: 'Cooling efficiency slightly below target' }
    ],
    plcScada: {
        controlEnabled: true,
        plcController: { vendor: 'Schneider', model: 'Modicon M580', ip: '192.168.10.16' },
        scada: { hmiScreens: ['Cooler Control', 'Fan Management'], historianTagPrefix: 'clk.' },
        controlTags: ['COOLER_FAN_SPEED', 'COOLER_AIR_FLOW']
    },
    gemniAI: {
        enabled: true,
        defaultMode: 'recommend',
        modes: [{ id: 'recommend', description: 'Suggest fan and grate adjustments to improve cooling efficiency' }],
        modelHints: ['fan-efficiency', 'clinker-size-impact']
    }
};

export default clinkerCoolingData;
