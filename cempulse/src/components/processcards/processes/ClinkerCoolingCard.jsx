'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, Stack, CircularProgress } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Thermometer, Wind, Gauge, Activity, AlertTriangle } from 'lucide-react';
import clinkerCoolingData from '../processData/clinkerCoolingData';

const generateSampleData = () => ({
    coolerTemperatures: {
        inlet: 1350,
        midSection: 850,
        outlet: 180,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            inlet: 1300 + Math.random() * 100,
            midSection: 800 + Math.random() * 100,
            outlet: 150 + Math.random() * 60
        }))
    },
    airFlow: {
        primary: 85,
        secondary: 65,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            primary: 80 + Math.random() * 10,
            secondary: 60 + Math.random() * 10
        }))
    },
    pressure: {
        current: 1.2,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            value: 1.1 + Math.random() * 0.2,
            threshold: 1.4
        }))
    },
    clinkerQuality: {
        temperature: 185,
        size: Array.from({ length: 20 }, () => ({
            size: Math.random() * 50 + 20,
            temperature: Math.random() * 50 + 160
        }))
    },
    coolingEfficiency: {
        current: 88,
        target: 90,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            efficiency: 85 + Math.random() * 8
        }))
    },
    alerts: [
        {
            severity: 'warning',
            message: 'Inlet temperature fluctuation detected'
        },
        {
            severity: 'info',
            message: 'Cooling efficiency slightly below target'
        }
    ]
});

const ClinkerCoolingContent = ({ data }) => {
    // only show loader while data is undefined (loading)
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || clinkerCoolingData || generateSampleData();

    const getTemperatureStatus = (temp, threshold) => {
        const diff = Math.abs(temp - threshold);
        const percentage = (diff / threshold) * 100;
        if (percentage > 10) return 'error';
        if (percentage > 5) return 'warning';
        return 'success';
    };

    return (
        <Grid container spacing={2}>
            {/* Temperature Profile Section */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Thermometer size={20} color="#ff4444" />
                            <Typography variant="subtitle2">
                                Temperature Profile
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Chip 
                                label={`Inlet: ${sampleData.coolerTemperatures.inlet}°C`}
                                color={getTemperatureStatus(sampleData.coolerTemperatures.inlet, 1350)}
                            />
                            <Chip 
                                label={`Mid: ${sampleData.coolerTemperatures.midSection}°C`}
                                color={getTemperatureStatus(sampleData.coolerTemperatures.midSection, 850)}
                            />
                            <Chip 
                                label={`Outlet: ${sampleData.coolerTemperatures.outlet}°C`}
                                color={getTemperatureStatus(sampleData.coolerTemperatures.outlet, 180)}
                            />
                        </Stack>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleData.coolerTemperatures.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[0, 1500]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="inlet" stroke="#ff4444" name="Inlet" />
                                <Line type="monotone" dataKey="midSection" stroke="#ff9800" name="Mid Section" />
                                <Line type="monotone" dataKey="outlet" stroke="#2196f3" name="Outlet" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Air Flow Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Wind size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Cooling Air Flow
                            </Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={6}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>
                                    Primary Air Flow
                                </Typography>
                                <CircularProgress 
                                    variant="determinate" 
                                    value={sampleData.airFlow.primary} 
                                    size={80}
                                    sx={{ color: '#2196f3' }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.airFlow.primary}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>
                                    Secondary Air Flow
                                </Typography>
                                <CircularProgress 
                                    variant="determinate" 
                                    value={sampleData.airFlow.secondary} 
                                    size={80}
                                    sx={{ color: '#4caf50' }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.airFlow.secondary}%
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box height={150}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleData.airFlow.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[50, 100]} />
                                <Tooltip />
                                <Area 
                                    type="monotone" 
                                    dataKey="primary" 
                                    stroke="#2196f3" 
                                    fill="#2196f3" 
                                    fillOpacity={0.2}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="secondary" 
                                    stroke="#4caf50" 
                                    fill="#4caf50" 
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Pressure Monitoring */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Gauge size={20} color="#9c27b0" />
                            <Typography variant="subtitle2">
                                Cooler Pressure
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.pressure.current} bar`}
                            color={sampleData.pressure.current > 1.4 ? 'error' : 'success'}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleData.pressure.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[0.8, 1.6]} />
                                <Tooltip />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#9c27b0" 
                                    dot={false}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="threshold" 
                                    stroke="#ff9800" 
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Clinker Quality Analysis */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Activity size={20} color="#ff9800" />
                            <Typography variant="subtitle2">
                                Clinker Size vs Temperature
                            </Typography>
                        </Box>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="size" 
                                    type="number" 
                                    name="Size" 
                                    unit="mm"
                                    domain={[0, 80]}
                                />
                                <YAxis 
                                    dataKey="temperature" 
                                    type="number" 
                                    name="Temperature" 
                                    unit="°C"
                                    domain={[150, 220]}
                                />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter 
                                    name="Clinker Particles" 
                                    data={sampleData.clinkerQuality.size} 
                                    fill="#ff9800"
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Cooling Efficiency */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <AlertTriangle size={20} color="#4caf50" />
                            <Typography variant="subtitle2">
                                Cooling Efficiency
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.coolingEfficiency.current}%`}
                            color={sampleData.coolingEfficiency.current >= sampleData.coolingEfficiency.target ? 'success' : 'warning'}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleData.coolingEfficiency.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[80, 100]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="efficiency"
                                    stroke="#4caf50"
                                    fill="#4caf50"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
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

export default function ClinkerCoolingCard({ process }) {
    const fetchCoolingData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('clinker-cooling');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={ClinkerCoolingContent}
            fetchProcessSpecificData={fetchCoolingData}
        />
    );
}
