'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, CircularProgress } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { RotateCw, Gauge, Cpu, Droplets } from 'lucide-react';

const generateSampleData = () => ({
    millSpeed: 850,
    grindingPressure: 75,
    temperature: 95,
    motorLoad: 82,
    powerConsumption: 2800,
    speedHistory: Array.from({ length: 24 }, (_, i) => ({
        timestamp: `${i}:00`,
        speed: 840 + Math.random() * 20
    })),
    pressureHistory: Array.from({ length: 24 }, (_, i) => ({
        timestamp: `${i}:00`,
        pressure: 70 + Math.random() * 10
    })),
    materialComposition: [
        { name: 'Limestone', value: 65 },
        { name: 'Clay', value: 20 },
        { name: 'Sand', value: 10 },
        { name: 'Iron Ore', value: 5 }
    ],
    fineness: {
        current: 92,
        target: 95,
        history: Array.from({ length: 12 }, (_, i) => ({
            timestamp: `${i*2}:00`,
            value: 90 + Math.random() * 5
        }))
    },
    alerts: [
        {
            severity: 'info',
            message: 'Mill performance optimal'
        }
    ]
});

const COMPOSITION_COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336'];

const RawMealGrindingContent = ({ data }) => {
    const displayData = data || generateSampleData();

    const getLoadStatus = (value) => {
        if (value > 90) return 'error';
        if (value > 85) return 'warning';
        return 'success';
    };

    return (
        <Grid container spacing={2}>
            {/* Mill Speed and Motor Load Section */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="subtitle2" gutterBottom>
                                    Motor Load
                                </Typography>
                                <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                                    <CircularProgress 
                                        variant="determinate" 
                                        value={displayData.motorLoad} 
                                        size={100}
                                        sx={{
                                            color: getLoadStatus(displayData.motorLoad) === 'success' ? 'success.main' : 'warning.main'
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        position="absolute"
                                    >
                                        {displayData.motorLoad}%
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <RotateCw size={20} color="#2196f3" />
                                <Typography variant="subtitle2">
                                    Mill Speed Trend
                                </Typography>
                            </Box>
                            <Box height={120}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={displayData.speedHistory}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="timestamp" />
                                        <YAxis domain={[800, 900]} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="speed"
                                            stroke="#2196f3"
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Grinding Pressure Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Gauge size={20} color="#4caf50" />
                        <Typography variant="subtitle2">
                            Grinding Pressure
                        </Typography>
                    </Box>
                    <Box height={150}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayData.pressureHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="pressure"
                                    stroke="#4caf50"
                                    fill="#4caf50"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Material Composition Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Droplets size={20} color="#ff9800" />
                        <Typography variant="subtitle2">
                            Material Composition
                        </Typography>
                    </Box>
                    <Box height={150} display="flex" alignItems="center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={displayData.materialComposition}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    fill="#8884d8"
                                    label
                                >
                                    {displayData.materialComposition.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COMPOSITION_COLORS[index % COMPOSITION_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Fineness Monitoring */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Cpu size={20} color="#9c27b0" />
                            <Typography variant="subtitle2">
                                Product Fineness Monitoring
                            </Typography>
                        </Box>
                        <Chip
                            label={`Current: ${displayData.fineness.current}%`}
                            color={displayData.fineness.current >= displayData.fineness.target ? 'success' : 'warning'}
                        />
                    </Box>
                    <Box height={120}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayData.fineness.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[85, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#9c27b0"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="target"
                                    stroke="#ff9800"
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Alerts Section */}
            {displayData.alerts && (
                <Grid item xs={12}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        {displayData.alerts.map((alert, index) => (
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

export default function RawMealGrindingCard({ process }) {
    const fetchGrindingData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('raw-meal-grinding');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={RawMealGrindingContent}
            fetchProcessSpecificData={fetchGrindingData}
        />
    );
}
