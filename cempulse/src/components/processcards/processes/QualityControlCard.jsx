'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { FileSpreadsheet, Activity, Microscope } from 'lucide-react';
import qualityControlData from '../processData/qualityControlData';

const QualityContent = ({ data }) => {
    if (data === undefined) return <LinearProgress />;
    const displayData = data || qualityControlData;

    const getQualityStatus = (value, threshold) => {
        const percentage = (value / threshold) * 100;
        if (percentage >= 98) return 'success';
        if (percentage >= 90) return 'warning';
        return 'error';
    };

    return (
        <Grid container spacing={2}>
            {/* Compressive Strength Section */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Activity size={20} color="#2196f3" />
                            <Typography variant="subtitle2">
                                Compressive Strength Analysis
                            </Typography>
                        </Box>
                            <Chip
                                label={`${displayData.currentStrength} MPa`}
                                color={getQualityStatus(displayData.currentStrength, 42)}
                            />
                    </Box>
                    <Box height={150}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="time" 
                                    type="number" 
                                    domain={[0, 24]} 
                                    label={{ value: 'Time (hours)', position: 'bottom' }} 
                                />
                                <YAxis 
                                    dataKey="strength" 
                                    domain={[30, 60]} 
                                    label={{ value: 'MPa', angle: -90, position: 'insideLeft' }} 
                                />
                                <Tooltip />
                                <Scatter 
                                    data={displayData.strengthTests} 
                                    fill="#2196f3" 
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* X-Ray Analysis Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Microscope size={20} color="#9c27b0" />
                        <Typography variant="subtitle2">
                            X-Ray Analysis
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Component</TableCell>
                                    <TableCell align="right">Value (%)</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayData.xrayAnalysis.map((component) => (
                                    <TableRow key={component.name}>
                                        <TableCell>{component.name}</TableCell>
                                        <TableCell align="right">{component.value.toFixed(2)}%</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                size="small"
                                                label={component.status}
                                                color={component.status === 'optimal' ? 'success' : 'warning'}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            {/* Test Results Log */}
            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <FileSpreadsheet size={20} color="#ff9800" />
                        <Typography variant="subtitle2">
                            Recent Test Results
                        </Typography>
                    </Box>
                    <TableContainer sx={{ maxHeight: 200 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell align="right">Setting (min)</TableCell>
                                    <TableCell align="right">Strength (MPa)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayData.recentTests.map((test, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{test.time}</TableCell>
                                        <TableCell align="right">{test.settingTime}</TableCell>
                                        <TableCell align="right">{test.strength}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default function QualityControlCard({ process }) {
    const fetchQualityData = async () => {
        return await fetchProcessData('quality-control');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={QualityContent}
            fetchProcessSpecificData={fetchQualityData}
        />
    );
}
