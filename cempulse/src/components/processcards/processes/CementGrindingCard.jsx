'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, CircularProgress, Stack } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Cog, Zap, Scale, Activity, Target } from 'lucide-react';
import cementGrindingData from '../processData/cementGrindingData';

const generateSampleData = () => ({
    millPerformance: {
        speed: 85,
        load: 78,
        powerDraw: 4200,
        temperature: 95,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            speed: 80 + Math.random() * 10,
            load: 75 + Math.random() * 10,
            temperature: 90 + Math.random() * 10
        }))
    },
    fineness: {
        current: 380,
        target: 375,
        distribution: [
            { size: '<32μm', percentage: 35 },
            { size: '32-45μm', percentage: 40 },
            { size: '45-63μm', percentage: 20 },
            { size: '>63μm', percentage: 5 }
        ],
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            value: 370 + Math.random() * 20,
            target: 375
        }))
    },
    additives: {
        gypsum: { target: 5, current: 4.8 },
        limestone: { target: 8, current: 7.9 },
        pozzolana: { target: 12, current: 11.8 },
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            gypsum: 4.5 + Math.random() * 0.6,
            limestone: 7.5 + Math.random() * 0.8,
            pozzolana: 11.5 + Math.random() * 1
        }))
    },
    energyEfficiency: {
        current: 52,
        target: 50,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            value: 48 + Math.random() * 8
        }))
    },
    productionRate: {
        current: 95,
        target: 100,
        hourly: Array.from({ length: 12 }, (_, i) => ({
            hour: `${i*2}:00`,
            value: 90 + Math.random() * 20
        }))
    },
    alerts: [
        {
            severity: 'warning',
            message: 'Mill temperature approaching upper limit'
        },
        {
            severity: 'info',
            message: 'Gypsum feed rate optimization recommended'
        }
    ]
});

const FINENESS_COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];

const CementGrindingContent = ({ data }) => {
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || cementGrindingData || generateSampleData();

    const getPerformanceStatus = (value, target, tolerance = 0.1) => {
        const diff = Math.abs(value - target) / target;
        if (diff > tolerance) return 'error';
        if (diff > tolerance / 2) return 'warning';
        return 'success';
    };

    return (
        <Grid container spacing={2}>
            {/* Mill Performance Overview */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Cog size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Mill Performance
                            </Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Mill Speed</Typography>
                                <CircularProgress 
                                    variant="determinate" 
                                    value={sampleData.millPerformance.speed} 
                                    size={80}
                                    sx={{ color: '#2196f3' }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.millPerformance.speed}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Mill Load</Typography>
                                <CircularProgress 
                                    variant="determinate" 
                                    value={sampleData.millPerformance.load} 
                                    size={80}
                                    sx={{ color: '#4caf50' }}
                                />
                                <Typography variant="body2" mt={1}>
                                    {sampleData.millPerformance.load}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Power Draw</Typography>
                                <Typography variant="h6" color="primary">
                                    {sampleData.millPerformance.powerDraw} kW
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="caption" gutterBottom>Temperature</Typography>
                                <Typography 
                                    variant="h6" 
                                    color={sampleData.millPerformance.temperature > 100 ? 'error' : 'primary'}
                                >
                                    {sampleData.millPerformance.temperature}°C
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Fineness Control */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Target size={20} color="#4caf50" />
                            <Typography variant="subtitle2">
                                Fineness Control
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.fineness.current} cm²/g`}
                            color={getPerformanceStatus(sampleData.fineness.current, sampleData.fineness.target, 0.05)}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sampleData.fineness.distribution}
                                    dataKey="percentage"
                                    nameKey="size"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
                                    label
                                >
                                    {sampleData.fineness.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={FINENESS_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Additives Control */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Scale size={20} color="#9c27b0" />
                        <Typography variant="subtitle2">
                            Additives Control
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        {Object.entries(sampleData.additives).filter(([key]) => key !== 'history').map(([name, data]) => (
                            <Box key={name}>
                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="caption">
                                        {name.charAt(0).toUpperCase() + name.slice(1)}
                                    </Typography>
                                    <Typography variant="caption">
                                        {data.current}% / {data.target}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(data.current / data.target) * 100}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getPerformanceStatus(data.current, data.target, 0.05) === 'success' 
                                                ? 'success.main' 
                                                : 'warning.main'
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </Grid>

            {/* Energy Efficiency */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Zap size={20} color="#ff9800" />
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
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[40, 60]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#ff9800"
                                    fill="#ff9800"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Production Rate */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Activity size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Production Rate
                            </Typography>
                        </Box>
                        <Chip
                            label={`${sampleData.productionRate.current} t/h`}
                            color={getPerformanceStatus(sampleData.productionRate.current, sampleData.productionRate.target)}
                        />
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleData.productionRate.hourly}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis domain={[80, 120]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2196f3"
                                    dot={false}
                                />
                            </LineChart>
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

export default function CementGrindingCard({ process }) {
    const fetchGrindingData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('cement-grinding');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={CementGrindingContent}
            fetchProcessSpecificData={fetchGrindingData}
        />
    );
}
