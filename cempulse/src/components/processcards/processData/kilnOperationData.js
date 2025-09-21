export const kilnOperationData = {
    currentTemp: 1420,
    temperatureHistory: Array.from({ length: 24 }).map((_, i) => ({ timestamp: `${i}:00`, temperature: 1320 + Math.round(Math.sin(i / 3) * 80) })),
    rotationHistory: Array.from({ length: 24 }).map((_, i) => ({ timestamp: `${i}:00`, rpm: +(2 + Math.sin(i / 4)).toFixed(2) })),
    fuelHistory: Array.from({ length: 24 }).map((_, i) => ({ timestamp: `${i}:00`, fuelRate: 1200 + Math.round(Math.cos(i / 5) * 200) })),
    alerts: [
        { severity: 'warning', message: 'Kiln temperature nearing upper threshold' },
    ],
    plcScada: {
        controlEnabled: true,
        plcController: { vendor: 'Siemens', model: 'S7-1500', ip: '192.168.10.12' },
        scada: { hmiScreens: ['Kiln Overview', 'Temperature Control', 'Fuel Management'], historianTagPrefix: 'PLANT.KILN' },
        controlTags: ['KILN_SPEED', 'FUEL_FEED_RATE', 'BURNER_POWER']
    },
    gemniAI: {
        enabled: true,
        defaultMode: 'predictive-stability',
        modes: [
            { id: 'predictive-stability', description: 'Predict kiln instability and recommend setpoint adjustments' },
            { id: 'fuel-optimization', description: 'Recommend fuel feed and burner trim to minimize consumption' }
        ],
        modelHints: ['monitor temperature ramp rates', 'compare rotation vs temp drift']
    }
};
