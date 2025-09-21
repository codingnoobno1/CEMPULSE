'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, Stack } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Thermometer, Flame, Wind, Zap } from 'lucide-react';
import preheaterPrecalcinerData from '../processData/preheaterPrecalcinerData';

const generateSampleData = () => ({
    currentTemps: {
        cyclone1: 380,
        cyclone2: 540,
        cyclone3: 720,
        cyclone4: 840,
        precalciner: 880
    },
    energyUsage: {
        current: 3250,
        target: 3000,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            usage: 3000 + Math.random() * 500,
            target: 3000
        }))
    },
    gasFlow: {
        current: 425,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            flow: 400 + Math.random() * 50
        }))
    },
    temperatureProfile: Array.from({ length: 24 }, (_, i) => ({
        timestamp: `${i}:00`,
        cyclone1: 350 + Math.random() * 60,
        cyclone2: 520 + Math.random() * 40,
        cyclone3: 700 + Math.random() * 40,
        cyclone4: 820 + Math.random() * 40,
        precalciner: 860 + Math.random() * 40
    })),
    emissions: {
        co2: 825,
        nox: 450,
        so2: 200,
        history: Array.from({ length: 12 }, (_, i) => ({
            hour: `${i*2}:00`,
            CO2: 800 + Math.random() * 50,
            NOx: 440 + Math.random() * 20,
            SO2: 190 + Math.random() * 20
        }))
    },
    alerts: [
        {
            severity: 'warning',
            message: 'Cyclone 3 temperature approaching upper limit'
        },
        {
            severity: 'info',
            message: 'Energy consumption above target threshold'
        }
    ]
});

const PreheaterContent = ({ data }) => {
    // Show loader only when data is undefined (still loading). If API returns null,
    // fall back to local sample/process data so UI still renders.
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || preheaterPrecalcinerData || generateSampleData();

    const getTemperatureStatus = (temp, max) => {
        const percentage = (temp / max) * 100;
        if (percentage > 95) return 'error';
        if (percentage > 90) return 'warning';
        return 'success';
    };

    return (
        <Grid container spacing={2}>
            {/* Temperature Profile */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Thermometer size={20} color="#ff4444" />
                            <Typography variant="subtitle2">
                                Temperature Profile
                            </Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={2} mb={2}>
                        {Object.entries(sampleData.currentTemps).map(([key, value], index) => (
                            <Grid item xs={12} sm={6} md={2.4} key={key}>
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 1.5, 
                                        bgcolor: 'grey.50',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="caption" display="block" gutterBottom>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Typography>
                                    <Chip
                                        label={`${value}°C`}
                                        color={getTemperatureStatus(value, 1000)}
                                        size="small"
                                    />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleData.temperatureProfile}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[300, 1000]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="cyclone1" stroke="#2196f3" name="Cyclone 1" />
                                <Line type="monotone" dataKey="cyclone2" stroke="#4caf50" name="Cyclone 2" />
                                <Line type="monotone" dataKey="cyclone3" stroke="#ff9800" name="Cyclone 3" />
                                <Line type="monotone" dataKey="cyclone4" stroke="#f44336" name="Cyclone 4" />
                                <Line type="monotone" dataKey="precalciner" stroke="#9c27b0" name="Precalciner" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Energy Usage Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Zap size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Energy Usage
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.energyUsage.current} kWh/t`}
                            color={sampleData.energyUsage.current > sampleData.energyUsage.target ? 'warning' : 'success'}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleData.energyUsage.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[2500, 4000]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="usage"
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

            {/* Gas Flow Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Wind size={20} color="#4caf50" />
                            <Typography variant="subtitle2">
                                Gas Flow Rate
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.gasFlow.current} m³/min`}
                            color="primary"
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleData.gasFlow.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[350, 500]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="flow"
                                    stroke="#4caf50"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Emissions Monitoring */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Flame size={20} color="#ff9800" />
                            <Typography variant="subtitle2">
                                Emissions Monitoring
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Chip size="small" label={`CO₂: ${sampleData.emissions.co2} mg/m³`} color="default" />
                            <Chip size="small" label={`NOx: ${sampleData.emissions.nox} mg/m³`} color="default" />
                            <Chip size="small" label={`SO₂: ${sampleData.emissions.so2} mg/m³`} color="default" />
                        </Stack>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sampleData.emissions.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="CO2" fill="#ff9800" />
                                <Bar dataKey="NOx" fill="#f44336" />
                                <Bar dataKey="SO2" fill="#9c27b0" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
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

export default function PreheaterPrecalcinerCard({ process }) {
    const fetchPreheaterData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('preheater-precalciner');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={PreheaterContent}
            fetchProcessSpecificData={fetchPreheaterData}
        />
    );
}
