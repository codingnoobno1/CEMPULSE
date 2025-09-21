'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Database, Droplets, ThermometerIcon, Scale } from 'lucide-react';
import clinkerStorageData from '../processData/clinkerStorageData';

const generateSampleData = () => ({
    siloStatus: {
        totalCapacity: 50000,
        currentStock: 35000,
        silos: [
            { id: 1, capacity: 15000, current: 12000, type: 'Fresh Clinker' },
            { id: 2, capacity: 15000, current: 9000, type: 'Fresh Clinker' },
            { id: 3, capacity: 20000, current: 14000, type: 'Aged Clinker' }
        ]
    },
    environmental: {
        temperature: 45,
        humidity: 35,
        pressure: 1.01,
        history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: `${i}:00`,
            temperature: 40 + Math.random() * 10,
            humidity: 30 + Math.random() * 10,
            pressure: 1 + Math.random() * 0.1
        }))
    },
    quality: {
        samples: Array.from({ length: 10 }, (_, i) => ({
            time: `${i*2}:00`,
            moisture: (2 + Math.random()).toFixed(2),
            size: (25 + Math.random() * 10).toFixed(1),
            temperature: (40 + Math.random() * 5).toFixed(1)
        })),
        distribution: [
            { name: 'Premium', value: 60 },
            { name: 'Standard', value: 30 },
            { name: 'Under Review', value: 10 }
        ]
    },
    stockMovement: {
        incoming: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000 + 500)),
        outgoing: Array.from({ length: 12 }, () => Math.floor(Math.random() * 800 + 400)),
        times: Array.from({ length: 12 }, (_, i) => `${i*2}:00`)
    },
    alerts: [
        {
            severity: 'warning',
            message: 'Silo 2 stock level below 70%'
        },
        {
            severity: 'info',
            message: 'Temperature variation detected in Silo 1'
        }
    ]
});

const QUALITY_COLORS = ['#4caf50', '#2196f3', '#ff9800'];

const ClinkerStorageContent = ({ data }) => {
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || clinkerStorageData || generateSampleData();

    const getSiloLevelStatus = (current, capacity) => {
        const percentage = (current / capacity) * 100;
        if (percentage < 30) return 'error';
        if (percentage < 50) return 'warning';
        return 'success';
    };

    return (
        <Grid container spacing={2}>
            {/* Silo Status Overview */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Database size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Silo Status Overview
                            </Typography>
                        </Box>
                        <Chip
                            label={`Total Stock: ${sampleData.siloStatus.currentStock.toLocaleString()} tonnes`}
                            color="primary"
                        />
                    </Box>
                    <Grid container spacing={2}>
                        {sampleData.siloStatus.silos.map((silo) => (
                            <Grid item xs={12} md={4} key={silo.id}>
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 2, 
                                        bgcolor: 'grey.50'
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="subtitle2">
                                            Silo {silo.id}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {silo.type}
                                        </Typography>
                                    </Box>
                                    <Box position="relative" mb={1}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(silo.current / silo.capacity) * 100}
                                            sx={{
                                                height: 20,
                                                borderRadius: 1,
                                                bgcolor: 'grey.200',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getSiloLevelStatus(silo.current, silo.capacity) === 'success' 
                                                        ? 'success.main' 
                                                        : 'warning.main'
                                                }
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            position="absolute"
                                            width="100%"
                                            textAlign="center"
                                            color="white"
                                            sx={{ top: 2 }}
                                        >
                                            {Math.round((silo.current / silo.capacity) * 100)}%
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {silo.current.toLocaleString()} / {silo.capacity.toLocaleString()} tonnes
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>

            {/* Environmental Monitoring */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <ThermometerIcon size={20} color="#ff4444" />
                            <Typography variant="subtitle2">
                                Environmental Conditions
                            </Typography>
                        </Box>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleData.environmental.history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis yAxisId="temp" domain={[0, 60]} />
                                <YAxis yAxisId="humid" orientation="right" domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    yAxisId="temp"
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="#ff4444"
                                    name="Temperature (°C)"
                                />
                                <Line
                                    yAxisId="humid"
                                    type="monotone"
                                    dataKey="humidity"
                                    stroke="#2196f3"
                                    name="Humidity (%)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Quality Distribution */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Scale size={20} color="#4caf50" />
                            <Typography variant="subtitle2">
                                Quality Distribution
                            </Typography>
                        </Box>
                    </Box>
                    <Box height={200} display="flex" alignItems="center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sampleData.quality.distribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {sampleData.quality.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={QUALITY_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Stock Movement */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle2">
                            Stock Movement (Last 24 Hours)
                        </Typography>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sampleData.stockMovement.times.map((time, index) => ({
                                time,
                                incoming: sampleData.stockMovement.incoming[index],
                                outgoing: sampleData.stockMovement.outgoing[index]
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="incoming"
                                    stackId="1"
                                    stroke="#4caf50"
                                    fill="#4caf50"
                                    name="Incoming"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="outgoing"
                                    stackId="2"
                                    stroke="#ff9800"
                                    fill="#ff9800"
                                    name="Outgoing"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Quality Samples */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Droplets size={20} color="#9c27b0" />
                            <Typography variant="subtitle2">
                                Recent Quality Samples
                            </Typography>
                        </Box>
                    </Box>
                    <TableContainer sx={{ maxHeight: 200 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell align="right">Moisture (%)</TableCell>
                                    <TableCell align="right">Size (mm)</TableCell>
                                    <TableCell align="right">Temp (°C)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sampleData.quality.samples.map((sample, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sample.time}</TableCell>
                                        <TableCell align="right">{sample.moisture}</TableCell>
                                        <TableCell align="right">{sample.size}</TableCell>
                                        <TableCell align="right">{sample.temperature}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export default function ClinkerStorageCard({ process }) {
    const fetchStorageData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('clinker-storage');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={ClinkerStorageContent}
            fetchProcessSpecificData={fetchStorageData}
        />
    );
}
