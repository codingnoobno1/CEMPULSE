'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, Stack } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Box as BoxIcon, ArrowDown, ArrowUp, Thermometer, Droplets, AlertTriangle } from 'lucide-react';
import cementStorageData from '../processData/cementStorageData';

const generateSampleData = () => ({
    silos: [
        {
            id: 1,
            type: 'OPC',
            capacity: 5000,
            currentLevel: 3850,
            temperature: 28,
            humidity: 0.5,
            lastRefilled: '2025-09-02T08:30:00',
            status: 'operational'
        },
        {
            id: 2,
            type: 'PPC',
            capacity: 4000,
            currentLevel: 2100,
            temperature: 29,
            humidity: 0.6,
            lastRefilled: '2025-09-02T06:15:00',
            status: 'operational'
        },
        {
            id: 3,
            type: 'PSC',
            capacity: 3000,
            currentLevel: 450,
            temperature: 27,
            humidity: 0.7,
            lastRefilled: '2025-09-01T22:45:00',
            status: 'low_inventory'
        }
    ],
    materialMovement: {
        inflow: Array.from({ length: 12 }, (_, i) => ({
            hour: `${i*2}:00`,
            OPC: Math.floor(80 + Math.random() * 40),
            PPC: Math.floor(60 + Math.random() * 30),
            PSC: Math.floor(40 + Math.random() * 20)
        })),
        outflow: Array.from({ length: 12 }, (_, i) => ({
            hour: `${i*2}:00`,
            OPC: Math.floor(70 + Math.random() * 40),
            PPC: Math.floor(50 + Math.random() * 30),
            PSC: Math.floor(30 + Math.random() * 20)
        }))
    },
    environmentalConditions: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        temperature: 25 + Math.random() * 5,
        humidity: 0.4 + Math.random() * 0.3
    })),
    alerts: [
        {
            severity: 'warning',
            message: 'Silo 3 (PSC) inventory below 20% capacity'
        },
        {
            severity: 'info',
            message: 'Scheduled maintenance for Silo 2 conveyor system tomorrow'
        }
    ]
});

const SiloStatus = ({ silo }) => {
    const fillPercentage = (silo.currentLevel / silo.capacity) * 100;
    const getStatusColor = () => {
        if (fillPercentage < 20) return 'error';
        if (fillPercentage < 40) return 'warning';
        return 'success';
    };

    return (
        <Paper elevation={0} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2">
                    Silo {silo.id} - {silo.type}
                </Typography>
                <Chip
                    size="small"
                    label={silo.status === 'operational' ? 'Operational' : 'Low Inventory'}
                    color={silo.status === 'operational' ? 'success' : 'warning'}
                />
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption">Storage Level</Typography>
                        <Typography variant="caption">
                            {silo.currentLevel}t / {silo.capacity}t
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={fillPercentage}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: theme => theme.palette[getStatusColor()].main
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Thermometer size={16} />
                        <Typography variant="body2">
                            {silo.temperature}°C
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Droplets size={16} />
                        <Typography variant="body2">
                            {(silo.humidity * 100).toFixed(1)}%
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

const CementStorageContent = ({ data }) => {
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || cementStorageData || generateSampleData();

    return (
        <Grid container spacing={2}>
            {/* Silo Status Section */}
            <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                    Storage Silos Status
                </Typography>
                <Grid container spacing={2}>
                    {sampleData.silos.map(silo => (
                        <Grid item xs={12} md={4} key={silo.id}>
                            <SiloStatus silo={silo} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* Material Movement */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <ArrowUp size={20} color="#4caf50" />
                        <Typography variant="subtitle2">
                            Material Inflow
                        </Typography>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sampleData.materialMovement.inflow}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="OPC" stackId="a" fill="#2196f3" />
                                <Bar dataKey="PPC" stackId="a" fill="#4caf50" />
                                <Bar dataKey="PSC" stackId="a" fill="#ff9800" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <ArrowDown size={20} color="#f44336" />
                        <Typography variant="subtitle2">
                            Material Outflow
                        </Typography>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sampleData.materialMovement.outflow}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="OPC" stackId="a" fill="#2196f3" />
                                <Bar dataKey="PPC" stackId="a" fill="#4caf50" />
                                <Bar dataKey="PSC" stackId="a" fill="#ff9800" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Environmental Conditions */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Thermometer size={20} color="#9c27b0" />
                        <Typography variant="subtitle2">
                            Environmental Conditions
                        </Typography>
                    </Box>
                    <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleData.environmentalConditions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis yAxisId="temp" orientation="left" />
                                <YAxis yAxisId="humidity" orientation="right" />
                                <Tooltip />
                                <Line
                                    yAxisId="temp"
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="#9c27b0"
                                    name="Temperature (°C)"
                                />
                                <Line
                                    yAxisId="humidity"
                                    type="monotone"
                                    dataKey="humidity"
                                    stroke="#00bcd4"
                                    name="Humidity"
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

export default function CementStorageCard({ process }) {
    const fetchStorageData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('cement-storage');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={CementStorageContent}
            fetchProcessSpecificData={fetchStorageData}
        />
    );
}
