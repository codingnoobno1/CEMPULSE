'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Flame, Gauge, RotateCcw } from 'lucide-react';
import { kilnOperationData } from '../processData/kilnOperationData';

const KilnContent = ({ data }) => {
    // show loader only while data is undefined (still loading)
    if (data === undefined) return <LinearProgress />;

    const displayData = data || kilnOperationData;

    const getTemperatureStatus = (temp) => {
        if (temp > 1450) return 'error';
        if (temp > 1400) return 'warning';
        if (temp < 1300) return 'warning';
        return 'success';
    };

    return (
        <Grid container spacing={2}>
            {/* Temperature Section */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Flame size={20} color="#ff4444" />
                            <Typography variant="subtitle2">
                                Kiln Temperature
                            </Typography>
                        </Box>
                            <Chip
                                label={`${displayData.currentTemp}°C`}
                                color={getTemperatureStatus(displayData.currentTemp)}
                            />
                    </Box>
                    <Box height={150}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayData.temperatureHistory}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ff4444" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[1200, 1500]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="#ff4444"
                                    fill="url(#colorTemp)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Rotation Speed & Fuel Feed Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <RotateCcw size={20} color="#2196f3" />
                        <Typography variant="subtitle2">
                            Rotation Speed
                        </Typography>
                    </Box>
                    <Box height={120}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayData.rotationHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="rpm"
                                    stroke="#2196f3"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Gauge size={20} color="#4caf50" />
                        <Typography variant="subtitle2">
                            Fuel Feed Rate
                        </Typography>
                    </Box>
                    <Box height={120}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayData.fuelHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[0, 2000]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="fuelRate"
                                    stroke="#4caf50"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Alerts Section */}
            {displayData.alerts && displayData.alerts.length > 0 && (
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

export default function KilnOperationCard({ process }) {
    const fetchKilnData = async () => {
        return await fetchProcessData('kiln-operation');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={KilnContent}
            fetchProcessSpecificData={fetchKilnData}
        />
    );
}
