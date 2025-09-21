'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Droplets, Scale, Wind, Thermometer } from 'lucide-react';
import rawMealHomogenizationData from '../processData/rawMealHomogenizationData';

const generateSampleData = () => ({
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
        {
            severity: 'success',
            message: 'Blending efficiency within optimal range'
        },
        {
            severity: 'info',
            message: 'Silo 3 level below 70% - Consider refilling'
        }
    ]
});

const RawMealHomogenizationContent = ({ data }) => {
    // When `data` is undefined we show a loader; when `data` is null we intentionally
    // use the sample/local fallback so UI shows process details even if API returns null.
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || rawMealHomogenizationData || generateSampleData();

    const getCompositionStatus = (current, min, max) => {
        if (current < min || current > max) return 'error';
        if (current === min || current === max) return 'warning';
        return 'success';
    };

    const getSiloLevelStatus = (level) => {
        if (level < 30) return 'error';
        if (level < 50) return 'warning';
        return 'success';
    };

    return (
        <Grid container spacing={2}>
            {/* Chemical Composition Section */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Chemical Composition Analysis
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parameter</TableCell>
                                    <TableCell align="right">Current</TableCell>
                                    <TableCell align="right">Range</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sampleData.chemicalComposition.current.map((param) => (
                                    <TableRow key={param.parameter}>
                                        <TableCell>{param.parameter}</TableCell>
                                        <TableCell align="right">{param.value.toFixed(2)}%</TableCell>
                                        <TableCell align="right">{param.min}-{param.max}%</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                size="small"
                                                label={param.value.toFixed(2)}
                                                color={getCompositionStatus(param.value, param.min, param.max)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            {/* Moisture Content Monitoring */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Droplets size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Moisture Content
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.currentMoisture}%`}
                            color={sampleData.currentMoisture > 8 ? 'warning' : 'success'}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleData.moistureHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[6, 8]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="moisture"
                                    stroke="#2196f3"
                                    fill="#2196f3"
                                    fillOpacity={0.2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="target"
                                    stroke="#ff9800"
                                    strokeDasharray="5 5"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Blending Quality Radar */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Wind size={20} color="#4caf50" />
                        <Typography variant="subtitle2">
                            Blending Quality Metrics
                        </Typography>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={sampleData.blendingData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="axis" />
                                <PolarRadiusAxis domain={[0, 100]} />
                                <Radar
                                    name="Quality"
                                    dataKey="value"
                                    stroke="#4caf50"
                                    fill="#4caf50"
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Silo Levels */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Scale size={20} color="#9c27b0" />
                        <Typography variant="subtitle2">
                            Storage Silo Levels
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {sampleData.siloLevels.map((silo, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 2, 
                                        bgcolor: 'grey.50',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1
                                    }}
                                >
                                    <Typography variant="subtitle2">{silo.name}</Typography>
                                    <Box position="relative" display="flex" alignItems="center" justifyContent="center" py={1}>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={silo.level}
                                            sx={{ 
                                                width: '100%',
                                                height: 20,
                                                borderRadius: 1,
                                                bgcolor: 'grey.200',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getSiloLevelStatus(silo.level) === 'success' ? 'success.main' : 'warning.main'
                                                }
                                            }}
                                        />
                                        <Typography 
                                            variant="caption" 
                                            position="absolute"
                                            color="white"
                                        >
                                            {silo.level}%
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {silo.material}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>

            {/* Alerts Section */}
            {sampleData.alerts && (
                <Grid item xs={12}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        {sampleData.alerts.map((alert, index) => (
                            <Alert key={index} severity={alert.severity}>
                                {alert.message}
                            </Alert>
                        ))}
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default function RawMealHomogenizationCard({ process }) {
    const fetchHomogenizationData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('raw-meal-homogenization');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={RawMealHomogenizationContent}
            fetchProcessSpecificData={fetchHomogenizationData}
        />
    );
}
