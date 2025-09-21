export const processData = [
  {
    id: 'raw-material-extraction',
    stage: 1,
    name: 'Raw Material Extraction',
    image: '/processes/raw-material.jpg',
    description: 'Extraction and primary handling of raw materials from quarry to plant feed.',
    samplingIntervalSeconds: 60,
    parameters: [
      { name: 'Conveyor Speed', unit: 'm/s', minValue: 0, maxValue: 5 },
      { name: 'Material Tonnage', unit: 'tonnes/h', minValue: 0, maxValue: 200 }
    ],
    sensors: [
      { id: 'conv-1-speed', name: 'Conveyor 1 Speed', type: 'speed', unit: 'm/s', location: 'conv-1' },
      { id: 'weigh-feeder-1', name: 'Weigh Feeder', type: 'weight', unit: 'tonnes/h', location: 'feeder' }
    ],
    targets: { feedTph: { target: 120, tolerance: 20 } },
    alerts: [
      { metric: 'Material Tonnage', level: 'warning', operator: '<', threshold: 40, message: 'Low feed to plant' }
    ],
    recommendedActions: [
      'Investigate upstream feed issues.',
      'Check conveyors and feeders for blockages.'
    ],
    plcScada: {
      controlEnabled: true,
      plcController: { vendor: 'Siemens', model: 'S7-1500', ip: '192.168.10.10', rack: 0, slot: 1 },
      scada: { hmiScreens: ['Extraction Overview', 'Conveyor Status'], historianTagPrefix: 'rmx.' },
      controlTags: { 'Conveyor Speed': 'rmx.conv1.speed.setpoint', 'Material Tonnage': 'rmx.feeder.tonnage' }
    },
    gemniAI: { enabled: true, defaultMode: 'monitor', modes: ['monitor', 'recommend', 'autotune'], modelHints: ['feed-rate-predictor', 'belt-wear-detector'] }
  },
  {
    id: 'crushing-homogenization',
    stage: 2,
    name: 'Crushing & Pre-Homogenization',
    image: '/processes/crushing.jpg',
    description: 'Primary crushing and size reduction followed by pre-homogenization prior to grinding.',
    samplingIntervalSeconds: 30,
    parameters: [
      { name: 'Crusher Vibration', unit: 'Hz', minValue: 10, maxValue: 50 },
      { name: 'Feed Rate', unit: 'tonnes/h', minValue: 0, maxValue: 150 }
    ],
    sensors: [
      { id: 'crusher-vib-1', name: 'Crusher Vibration', type: 'vibration', unit: 'mm/s', location: 'crusher' },
      { id: 'feed-belt-1', name: 'Feed Belt Tonnage', type: 'weight', unit: 'tonnes/h', location: 'feed' }
    ],
    targets: { maxVibration: 8 },
    alerts: [
      { metric: 'Crusher Vibration', level: 'error', operator: '>', threshold: 8, message: 'Excessive crusher vibration' }
    ],
    recommendedActions: [
      'Schedule maintenance on crusher bearings.',
      'Reduce feed rate if vibration persists.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Allen-Bradley', model: 'ControlLogix', ip: '192.168.10.11' }, scada: { hmiScreens: ['Crusher Panel', 'Feed Control'], historianTagPrefix: 'crh.' }, controlTags: { 'Feed Rate': 'crh.feed.rate.setpoint' } },
    gemniAI: { enabled: true, defaultMode: 'recommend', modes: ['monitor', 'recommend'] }
  },
  {
    id: 'raw-meal-grinding',
    stage: 3,
    name: 'Raw Meal Grinding',
    image: '/processes/grinding.jpg',
    description: 'Grinding the raw meal into a fine powder suitable for homogenization and heating.',
    samplingIntervalSeconds: 15,
    parameters: [
      { name: 'Mill Speed', unit: 'rpm', minValue: 0, maxValue: 1000 },
      { name: 'Grinding Pressure', unit: 'bar', minValue: 0, maxValue: 100 }
    ],
    sensors: [
      { id: 'mill-speed', name: 'Mill Speed', type: 'speed', unit: 'rpm', location: 'mill' },
      { id: 'grind-press', name: 'Grinding Pressure', type: 'pressure', unit: 'bar', location: 'hydraulic' }
    ],
    targets: { speed: { target: 850, tolerance: 50 }, pressure: { target: 75, tolerance: 10 } },
    alerts: [
      { metric: 'Grinding Pressure', level: 'warning', operator: '>', threshold: 90, message: 'High grinding pressure' }
    ],
    recommendedActions: [
      'Check hydraulic system and filters.',
      'Adjust mill speed gradually to maintain pressure setpoint.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Siemens', model: 'S7-1500', ip: '192.168.10.12' }, scada: { hmiScreens: ['Mill Control'], historianTagPrefix: 'rmg.' }, controlTags: { 'Mill Speed': 'rmg.mill.speed.setpoint', 'Grinding Pressure': 'rmg.grind.pressure' } },
    gemniAI: { enabled: true, defaultMode: 'autotune', modes: ['monitor', 'recommend', 'autotune'], modelHints: ['mill-tuning'] }
  },
  {
    id: 'raw-meal-homogenization',
    stage: 4,
    name: 'Raw Meal Homogenization',
    image: '/processes/homogenization.jpg',
    description: 'Final blending and homogenization of raw meal to achieve consistent chemical composition before heating.',
    samplingIntervalSeconds: 300,
    parameters: [
      { name: 'Blending Ratio', unit: '%', minValue: 0, maxValue: 100 },
      { name: 'Moisture Content', unit: '%', minValue: 0, maxValue: 15 }
    ],
    sensors: [
      { id: 'silo-1-level', name: 'Silo 1 Level', type: 'level', unit: 'm', location: 'silo-1' },
      { id: 'moisture-probe-1', name: 'Moisture Probe', type: 'moisture', unit: '%', location: 'blend-bed' },
      { id: 'xrf-1', name: 'XRF Analyzer', type: 'composition', unit: '%', location: 'discharge' }
    ],
    targets: { chemicalConsistency: { targetSpreadPct: 1.5 }, moisture: { target: 6, tolerance: 2 } },
    alerts: [
      { metric: 'Moisture Content', level: 'warning', operator: '>', threshold: 9, message: 'Moisture above recommended range' },
      { metric: 'Blending Ratio', level: 'error', operator: 'variance>', threshold: 3, message: 'Blending ratio variance exceeded' }
    ],
    recommendedActions: [
      'Adjust feeder speeds to re-balance blending ratios.',
      'Divert material to recirculation if XRF variance persists.',
      'Schedule probe clean/check if moisture readings drift.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Yokogawa', model: 'FA-M3', ip: '192.168.10.13' }, scada: { hmiScreens: ['Homogenization Overview'], historianTagPrefix: 'rmh.' }, controlTags: { 'Blending Ratio': 'rmh.blend.ratio', 'Moisture Content': 'rmh.moisture' } },
    gemniAI: { enabled: true, defaultMode: 'recommend', modes: ['monitor', 'recommend'] }
  },
  {
    id: 'preheater-precalciner',
    stage: 5,
    name: 'Preheater & Precalciner',
    image: '/processes/preheater.jpg',
    description: 'Heat the raw meal and begin calcination reactions using staged cyclones and precalciner burner control.',
    samplingIntervalSeconds: 60,
    parameters: [
      { name: 'Temperature', unit: '°C', minValue: 0, maxValue: 900 },
      { name: 'Energy Usage', unit: 'kWh/t', minValue: 0, maxValue: 500 }
    ],
    sensors: [
      { id: 'cyclone-1-temp', name: 'Cyclone 1 Temp', type: 'temperature', unit: '°C', location: 'cyclone-1' },
      { id: 'calciner-o2', name: 'Calciner O₂', type: 'gas', unit: '%', location: 'precalciner' },
      { id: 'fuel-flow-precalciner', name: 'Precalciner Fuel Flow', type: 'flow', unit: 'kg/h', location: 'burner' }
    ],
    targets: { cycloneTemp: { target: 540, tolerance: 40 }, o2: { target: 3.5, tolerance: 1.5 } },
    alerts: [
      { metric: 'Temperature', level: 'warning', operator: '>', threshold: 750, message: 'High preheater temperature' },
      { metric: 'O₂', level: 'error', operator: '<', threshold: 1.5, message: 'O₂ too low - combustion risk' }
    ],
    recommendedActions: [
      'Reduce fuel feed and increase tertiary air to lower temperature.',
      'Inspect precalciner burner if O₂ falls persistently.',
      'Check heat exchanger surfaces for blockage if temperatures spike.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Siemens', model: 'S7-400', ip: '192.168.10.14' }, scada: { hmiScreens: ['Preheater Cyclone'], historianTagPrefix: 'php.' }, controlTags: { 'Temperature': 'php.cyclone.temp', 'Energy Usage': 'php.energy.kwht' } },
    gemniAI: { enabled: true, defaultMode: 'monitor', modes: ['monitor', 'recommend'] }
  },
  {
    id: 'kiln-operation',
    stage: 6,
    name: 'Kiln Operation',
    image: '/processes/kiln.jpg',
    description: 'Primary clinker production stage: maintain kiln temperature profile, kiln speed, and fuel balance to form clinker nodules.',
    samplingIntervalSeconds: 30,
    parameters: [
      { name: 'Kiln Temperature', unit: '°C', minValue: 0, maxValue: 1500 },
      { name: 'Rotation Speed', unit: 'rpm', minValue: 0, maxValue: 5 },
      { name: 'Fuel Feed Rate', unit: 'kg/h', minValue: 0, maxValue: 2000 }
    ],
    sensors: [
      { id: 'kiln-tail-temp', name: 'Kiln Tail Temp', type: 'temperature', unit: '°C', location: 'tail' },
      { id: 'kiln-mid-temp', name: 'Kiln Mid Temp', type: 'temperature', unit: '°C', location: 'mid' },
      { id: 'burner-fuel', name: 'Burner Fuel Flow', type: 'flow', unit: 'm³/h', location: 'burner' }
    ],
    targets: { burningZoneTemp: { target: 1450, tolerance: 25 }, clinkerQuality: { caosi: 1.5, tolerance: 0.1 } },
    alerts: [
      { metric: 'Kiln Temperature', level: 'error', operator: '<', threshold: 1350, message: 'Under-temperature in burning zone' },
      { metric: 'Rotation Speed', level: 'warning', operator: '>', threshold: 4, message: 'Kiln rotation above recommended speed' }
    ],
    recommendedActions: [
      'Increase fuel feed if burning zone below target and oxygen allows.',
      'Reduce kiln speed to increase residence time for undersized clinker.',
      'Check refractory integrity when temperature profile fluctuates.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Emerson', model: 'DeltaV', ip: '192.168.10.15' }, scada: { hmiScreens: ['Kiln Control', 'Burner Tuning'], historianTagPrefix: 'kiln.' }, controlTags: { 'Kiln Temperature': 'kiln.temp.setpoint', 'Rotation Speed': 'kiln.speed.setpoint' } },
    gemniAI: { enabled: true, defaultMode: 'autotune', modes: ['monitor', 'recommend', 'autotune'], modelHints: ['combustion-optimizer'] }
  },
  {
    id: 'clinker-cooling',
    stage: 7,
    name: 'Clinker Cooling',
    image: '/processes/cooling.jpg',
    description: 'Rapidly cool clinker to preserve mineral phases and recover waste heat via cooler fans and ducts.',
    samplingIntervalSeconds: 60,
    parameters: [
      { name: 'Cooler Pressure', unit: 'bar', minValue: 0, maxValue: 10 },
      { name: 'Cooling Air Flow', unit: 'm³/h', minValue: 0, maxValue: 10000 }
    ],
    sensors: [
      { id: 'cooler-inlet-temp', name: 'Cooler Inlet Temp', type: 'temperature', unit: '°C', location: 'inlet' },
      { id: 'fan-speed-cooler', name: 'Cooler Fan Speed', type: 'speed', unit: 'rpm', location: 'fans' },
      { id: 'cooler-pressure-sensor', name: 'Cooler Pressure', type: 'pressure', unit: 'bar', location: 'duct' }
    ],
    targets: { outletTemp: { target: 120, tolerance: 40 }, coolingEfficiency: { targetPct: 85 } },
    alerts: [
      { metric: 'Outlet Temp', level: 'warning', operator: '>', threshold: 200, message: 'Clinker outlet temp high - slow cooling' },
      { metric: 'Fan Speed', level: 'error', operator: '<', threshold: 50, message: 'Cooler fan speed below safe level' }
    ],
    recommendedActions: [
      'Increase fan speed or check fan drives when cooling drops.',
      'Inspect grate and chutes for clinker build-up if pressure rises.',
      'Verify heat recovery ducting if outlet temps remain high.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Schneider', model: 'Modicon M580', ip: '192.168.10.16' }, scada: { hmiScreens: ['Cooler Control'], historianTagPrefix: 'clk.' }, controlTags: { 'Cooling Air Flow': 'clk.fan.flow.setpoint', 'Cooler Pressure': 'clk.pressure' } },
    gemniAI: { enabled: true, defaultMode: 'recommend', modes: ['monitor', 'recommend'] }
  },
  {
    id: 'clinker-storage',
    stage: 8,
    name: 'Clinker Storage',
    image: '/processes/storage.jpg',
    description: 'Temporary storage of clinker with environmental monitoring to avoid hydration and quality loss.',
    samplingIntervalSeconds: 600,
    parameters: [
      { name: 'Stock Level', unit: 'tonnes', minValue: 0, maxValue: 5000 },
      { name: 'Humidity', unit: '%', minValue: 0, maxValue: 100 }
    ],
    sensors: [
      { id: 'stock-probe-1', name: 'Stock Probe 1', type: 'level', unit: 'm', location: 'bunker-1' },
      { id: 'storage-humidity', name: 'Storage Humidity', type: 'humidity', unit: '%', location: 'silo' }
    ],
    targets: { maxResidenceHours: 72, humidity: { target: 35, tolerance: 10 } },
    alerts: [
      { metric: 'Humidity', level: 'warning', operator: '>', threshold: 50, message: 'High storage humidity - risk of hydration' },
      { metric: 'Stock Level', level: 'info', operator: '<', threshold: 200, message: 'Low clinker stock - plan production' }
    ],
    recommendedActions: [
      'Activate dehumidifiers or ventilation if humidity rises.',
      'Prioritize older clinker for dispatch to avoid long residence.'
    ],
    plcScada: { controlEnabled: false, plcController: { vendor: 'None', model: 'n/a' }, scada: { hmiScreens: ['Storage Overview'], historianTagPrefix: 'stg.' }, controlTags: {} },
    gemniAI: { enabled: true, defaultMode: 'monitor', modes: ['monitor'] }
  },
  {
    id: 'cement-grinding',
    stage: 9,
    name: 'Cement Grinding',
    image: '/processes/cement-grinding.jpg',
    description: 'Grinding clinker with additives to produce cement with required physical and chemical properties.',
    samplingIntervalSeconds: 60,
    parameters: [
      { name: 'Mill Load', unit: '%', minValue: 0, maxValue: 100 },
      { name: 'Motor Power', unit: 'kW', minValue: 0, maxValue: 1000 },
      { name: 'Fineness', unit: 'cm²/g', minValue: 2500, maxValue: 4500 }
    ],
    sensors: [
      { id: 'separator-eff', name: 'Separator Efficiency', type: 'efficiency', unit: '%', location: 'separator' },
      { id: 'mill-vibration', name: 'Mill Vibration', type: 'vibration', unit: 'mm/s', location: 'mill' },
      { id: 'power-meter-mill', name: 'Mill Power', type: 'power', unit: 'kW', location: 'motor' }
    ],
    targets: { fineness: { target: 3200, tolerance: 100 }, throughput: { targetTph: 100 } },
    alerts: [
      { metric: 'Mill Vibration', level: 'error', operator: '>', threshold: 6, message: 'High mill vibration - check bearings' },
      { metric: 'Fineness', level: 'warning', operator: '<', threshold: 3000, message: 'Fineness below target' }
    ],
    recommendedActions: [
      'Adjust separator speed and air flow to meet fineness target.',
      'Inspect grinding media and liners if power draw increases.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Siemens', model: 'S7-1500', ip: '192.168.10.17' }, scada: { hmiScreens: ['Grinding Line'], historianTagPrefix: 'cgr.' }, controlTags: { 'Mill Load': 'cgr.mill.load', 'Fineness': 'cgr.fineness' } },
    gemniAI: { enabled: true, defaultMode: 'autotune', modes: ['monitor', 'recommend', 'autotune'], modelHints: ['separator-tuner', 'fineness-predictor'] }
  },
  {
    id: 'cement-storage',
    stage: 10,
    name: 'Cement Storage',
    image: '/processes/cement-storage.jpg',
    description: 'Storage of finished cement with environmental controls and quality monitoring to maintain product integrity.',
    samplingIntervalSeconds: 600,
    parameters: [
      { name: 'Bin Level', unit: '%', minValue: 0, maxValue: 100 },
      { name: 'Dust Control', unit: 'mg/m³', minValue: 0, maxValue: 50 }
    ],
    sensors: [
      { id: 'baghouse-ddp', name: 'Baghouse ΔP', type: 'pressure', unit: 'Pa', location: 'baghouse' },
      { id: 'storage-moisture', name: 'Storage Moisture', type: 'moisture', unit: '%', location: 'silos' }
    ],
    targets: { maxMoisture: 0.5, dustEmission: { target: 10 } },
    alerts: [
      { metric: 'Dust Control', level: 'error', operator: '>', threshold: 25, message: 'Dust emission above limits' },
      { metric: 'Bin Level', level: 'info', operator: '>', threshold: 95, message: 'Storage near full - prepare dispatch' }
    ],
    recommendedActions: [
      'Inspect baghouse filters if ΔP rises.',
      'Reduce silo filling if moisture increases.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Allen-Bradley', model: 'CompactLogix', ip: '192.168.10.18' }, scada: { hmiScreens: ['Cement Storage'], historianTagPrefix: 'cst.' }, controlTags: { 'Bin Level': 'cst.bin.level' } },
    gemniAI: { enabled: true, defaultMode: 'monitor', modes: ['monitor', 'recommend'] }
  },
  {
    id: 'packing-dispatch',
    stage: 11,
    name: 'Packing & Dispatch',
    image: '/processes/packing.jpg',
    description: 'Automatic packing lines, weighing and dispatch scheduling with quality checks on bag weight and seal integrity.',
    samplingIntervalSeconds: 15,
    parameters: [
      { name: 'Packing Speed', unit: 'bags/h', minValue: 0, maxValue: 3000 },
      { name: 'Bag Weight', unit: 'kg', minValue: 49.5, maxValue: 50.5 }
    ],
    sensors: [
      { id: 'weigh-belt-1', name: 'Weigh Belt 1', type: 'weight', unit: 'kg', location: 'line-1' },
      { id: 'seal-check-1', name: 'Seal Integrity Camera', type: 'vision', unit: 'boolean', location: 'packer' }
    ],
    targets: { bagWeight: { target: 50, tolerance: 0.3 }, dispatchOnTimePct: 98 },
    alerts: [
      { metric: 'Bag Weight', level: 'warning', operator: 'variance>', threshold: 0.5, message: 'Bag weight variance high' },
      { metric: 'Packing Speed', level: 'info', operator: '<', threshold: 300, message: 'Packing line running slow' }
    ],
    recommendedActions: [
      'Calibrate weighers if weight variance exceeds tolerance.',
      'Switch to backup packing line if line downtime increases.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Omron', model: 'NJ-Series', ip: '192.168.10.19' }, scada: { hmiScreens: ['Packing Lines'], historianTagPrefix: 'pkg.' }, controlTags: { 'Packing Speed': 'pkg.line.speed', 'Bag Weight': 'pkg.weigher.weight' } },
    gemniAI: { enabled: true, defaultMode: 'recommend', modes: ['monitor', 'recommend'] }
  },
  {
    id: 'quality-control',
    stage: 12,
    name: 'Quality Control',
    image: '/processes/quality.jpg',
    description: 'Laboratory and inline quality checks to ensure product meets standards (strength, setting time, chemical composition).',
    samplingIntervalSeconds: 3600,
    parameters: [
      { name: 'Compressive Strength', unit: 'MPa', minValue: 30, maxValue: 60 },
      { name: 'Setting Time', unit: 'min', minValue: 45, maxValue: 375 }
    ],
    sensors: [
      { id: 'lab-cullet-strength', name: 'Lab Cure Strength', type: 'lab', unit: 'MPa', location: 'lab' },
      { id: 'inline-fineness', name: 'Inline Fineness', type: 'fineness', unit: 'cm²/g', location: 'process' }
    ],
    targets: { strength7d: { target: 35 }, strength28d: { target: 42 } },
    alerts: [
      { metric: 'Compressive Strength', level: 'error', operator: '<', threshold: 30, message: 'Product failing strength tests' }
    ],
    recommendedActions: [
      'Investigate grind/fineness and clinker quality if strength fails.',
      'Hold shipments until QC passes for the batch.'
    ],
    plcScada: { controlEnabled: false, plcController: { vendor: 'None', model: 'n/a' }, scada: { hmiScreens: ['QC Dashboard'], historianTagPrefix: 'qc.' }, controlTags: {} },
    gemniAI: { enabled: true, defaultMode: 'recommend', modes: ['monitor', 'recommend'], modelHints: ['strength-predictor'] }
  },
  {
    id: 'energy-emission',
    stage: 13,
    name: 'Energy & Emission',
    image: '/processes/emissions.jpg',
    description: 'Plant-wide energy monitoring and emissions tracking to meet performance targets and environmental regulations.',
    samplingIntervalSeconds: 60,
    parameters: [
      { name: 'Power Consumption', unit: 'kWh/t', minValue: 0, maxValue: 150 },
      { name: 'CO₂ Emissions', unit: 'kg/t', minValue: 0, maxValue: 900 }
    ],
    sensors: [
      { id: 'main-meter', name: 'Main Power Meter', type: 'power', unit: 'kW', location: 'substation' },
      { id: 'stack-co2', name: 'Stack CO₂ Monitor', type: 'gas', unit: 'mg/m³', location: 'stack' }
    ],
    targets: { specificEnergy: { target: 85, tolerance: 10 }, co2PerTonne: { target: 650 } },
    alerts: [
      { metric: 'Power Consumption', level: 'warning', operator: '>', threshold: 120, message: 'High specific energy consumption' },
      { metric: 'CO₂ Emissions', level: 'error', operator: '>', threshold: 800, message: 'Emissions exceed permit' }
    ],
    recommendedActions: [
      'Run energy efficiency checks and balance loads to reduce peak consumption.',
      'Investigate combustion tuning and fuel mix if CO₂ trends upward.'
    ],
    plcScada: { controlEnabled: true, plcController: { vendor: 'Honeywell', model: 'Experion', ip: '192.168.10.20' }, scada: { hmiScreens: ['Energy & Emission'], historianTagPrefix: 'ene.' }, controlTags: { 'Power Consumption': 'ene.power.total', 'CO₂ Emissions': 'ene.emissions.co2' } },
    gemniAI: { enabled: true, defaultMode: 'monitor', modes: ['monitor', 'recommend'], modelHints: ['energy-optimizer', 'emissions-forecaster'] }
  }
];
