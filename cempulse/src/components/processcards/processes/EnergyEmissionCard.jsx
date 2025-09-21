'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, Stack, CircularProgress } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Zap, Wind, Gauge, Factory, Leaf, AlertTriangle, ThermometerSun, Battery } from 'lucide-react';
import energyEmissionData from '../processData/energyEmissionData';

const generateSampleData = () => ({
    powerConsumption: {
        current: {
            total: 42500,
            breakdown: [
                { name: 'Grinding', value: 18500 },
                { name: 'Kiln', value: 15000 },
                { name: 'Packing', value: 4500 },
                { name: 'Others', value: 4500 }
            ]
        },
        historical: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            consumption: 38000 + Math.random() * 9000,
            target: 45000
        }))
    },
    emissions: {
        current: {
            co2: 785,
            nox: 380,
            sox: 95,
            dust: 28
        },
        limits: {
            co2: 800,
            nox: 400,
            sox: 100,
            dust: 30
        },
        historical: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            co2: 750 + Math.random() * 100,
            nox: 360 + Math.random() * 80,
            sox: 90 + Math.random() * 20,
            dust: 25 + Math.random() * 10
        }))
    },
    energyEfficiency: {
        current: 108,
        target: 112,
        history: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            value: 105 + Math.random() * 10
        }))
    },
    environmentalMetrics: {
        temperature: 38,
        humidity: 45,
        windSpeed: 12,
        windDirection: 'NW',
        pressure: 1013
    },
    carbonCredit: {
        current: 2850,
        target: 3000,
        history: Array.from({ length: 12 }, (_, i) => ({
            month: `${i+1}`,
            value: 2700 + Math.random() * 500
        }))
    },
    alerts: [
        {
            severity: 'warning',
            message: 'NOx emissions approaching limit'
        },
        {
            severity: 'info',
            message: 'Energy efficiency above target'
        }
    ]
});

const CONSUMPTION_COLORS = ['#2196f3', '#f44336', '#4caf50', '#ff9800'];

const getEmissionStatus = (current, limit) => {
    const ratio = current / limit;
    if (ratio > 0.95) return 'error';
    if (ratio > 0.8) return 'warning';
    return 'success';
};

const EnergyEmissionContent = ({ data }) => {
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || energyEmissionData || generateSampleData();

    return (
        <Grid container spacing={2}>
            {/* Power Consumption Overview */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Zap size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Power Consumption
                            </Typography>
                        </Box>
                        <Chip
                            label={`${(sampleData.powerConsumption.current.total / 1000).toFixed(1)} MW`}
                            color={sampleData.powerConsumption.current.total > 45000 ? 'warning' : 'success'}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box height={200}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sampleData.powerConsumption.current.breakdown}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            label
                                        >
                                            {sampleData.powerConsumption.current.breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CONSUMPTION_COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                {sampleData.powerConsumption.current.breakdown.map((item, index) => (
                                    <Box key={item.name}>
                                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="caption">{item.name}</Typography>
                                            <Typography variant="caption">{(item.value / 1000).toFixed(1)} MW</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(item.value / sampleData.powerConsumption.current.total) * 100}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: 'grey.200',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: CONSUMPTION_COLORS[index]
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Energy Efficiency */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Battery size={20} color="#4caf50" />
                            <Typography variant="subtitle2">
                                Energy Efficiency
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.energyEfficiency.current} kWh/t`}
                            color={sampleData.energyEfficiency.current <= sampleData.energyEfficiency.target ? 'success' : 'warning'}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleData.energyEfficiency.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis domain={[95, 120]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4caf50"
                                    fill="#4caf50"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Emissions Monitoring */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Factory size={20} color="#f44336" />
                        <Typography variant="subtitle2">
                            Emissions Monitoring
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Box textAlign="center">
                                <Typography variant="caption" gutterBottom>CO₂ (kg/t)</Typography>
                                <CircularProgress
                                    variant="determinate"
                                    value={(sampleData.emissions.current.co2 / sampleData.emissions.limits.co2) * 100}
                                    size={100}
                                    sx={{
                                        color: theme => theme.palette[getEmissionStatus(
                                            sampleData.emissions.current.co2,
                                            sampleData.emissions.limits.co2
                                        )].main
                                    }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.emissions.current.co2} / {sampleData.emissions.limits.co2}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box textAlign="center">
                                <Typography variant="caption" gutterBottom>NOx (mg/Nm³)</Typography>
                                <CircularProgress
                                    variant="determinate"
                                    value={(sampleData.emissions.current.nox / sampleData.emissions.limits.nox) * 100}
                                    size={100}
                                    sx={{
                                        color: theme => theme.palette[getEmissionStatus(
                                            sampleData.emissions.current.nox,
                                            sampleData.emissions.limits.nox
                                        )].main
                                    }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.emissions.current.nox} / {sampleData.emissions.limits.nox}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box textAlign="center">
                                <Typography variant="caption" gutterBottom>SOx (mg/Nm³)</Typography>
                                <CircularProgress
                                    variant="determinate"
                                    value={(sampleData.emissions.current.sox / sampleData.emissions.limits.sox) * 100}
                                    size={100}
                                    sx={{
                                        color: theme => theme.palette[getEmissionStatus(
                                            sampleData.emissions.current.sox,
                                            sampleData.emissions.limits.sox
                                        )].main
                                    }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.emissions.current.sox} / {sampleData.emissions.limits.sox}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box textAlign="center">
                                <Typography variant="caption" gutterBottom>Dust (mg/Nm³)</Typography>
                                <CircularProgress
                                    variant="determinate"
                                    value={(sampleData.emissions.current.dust / sampleData.emissions.limits.dust) * 100}
                                    size={100}
                                    sx={{
                                        color: theme => theme.palette[getEmissionStatus(
                                            sampleData.emissions.current.dust,
                                            sampleData.emissions.limits.dust
                                        )].main
                                    }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.emissions.current.dust} / {sampleData.emissions.limits.dust}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Environmental Conditions */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <ThermometerSun size={20} color="#9c27b0" />
                        <Typography variant="subtitle2">
                            Environmental Conditions
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Temperature</Typography>
                                <Typography variant="h6" color="primary">
                                    {sampleData.environmentalMetrics.temperature}°C
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Humidity</Typography>
                                <Typography variant="h6" color="primary">
                                    {sampleData.environmentalMetrics.humidity}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Wind Speed</Typography>
                                <Typography variant="h6" color="primary">
                                    {sampleData.environmentalMetrics.windSpeed} m/s
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Pressure</Typography>
                                <Typography variant="h6" color="primary">
                                    {sampleData.environmentalMetrics.pressure} hPa
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Carbon Credits */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Leaf size={20} color="#4caf50" />
                            <Typography variant="subtitle2">
                                Carbon Credits
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.carbonCredit.current} credits`}
                            color={sampleData.carbonCredit.current >= sampleData.carbonCredit.target ? 'success' : 'warning'}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleData.carbonCredit.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[2500, 3500]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
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

export default function EnergyEmissionCard({ process }) {
    const fetchEnergyData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('energy-emission');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={EnergyEmissionContent}
            fetchProcessSpecificData={fetchEnergyData}
        />
    );
}
