'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Package, Truck, ClipboardCheck, Timer, BoxSelect, BarChart3 } from 'lucide-react';
import packingDispatchData from '../processData/packingDispatchData';

const generateSampleData = () => ({
    packingLines: [
        {
            id: 1,
            type: '50kg Bags',
            status: 'operational',
            efficiency: 95,
            currentSpeed: 2800,
            targetSpeed: 3000,
            rejects: 0.5,
            downtime: 15
        },
        {
            id: 2,
            type: 'Jumbo Bags',
            status: 'maintenance',
            efficiency: 0,
            currentSpeed: 0,
            targetSpeed: 120,
            rejects: 0,
            downtime: 180
        },
        {
            id: 3,
            type: 'Bulk Loading',
            status: 'operational',
            efficiency: 88,
            currentSpeed: 180,
            targetSpeed: 200,
            rejects: 0.2,
            downtime: 30
        }
    ],
    dispatchQueue: [
        {
            id: 'TRK-2025-089',
            type: 'Bulk Tanker',
            quantity: 30,
            destination: 'Site A Construction',
            status: 'loading',
            arrivalTime: '08:30',
            expectedDispatch: '09:15'
        },
        {
            id: 'TRK-2025-090',
            type: '50kg Bags',
            quantity: 800,
            destination: 'Distributor B',
            status: 'waiting',
            arrivalTime: '08:45',
            expectedDispatch: '09:30'
        },
        {
            id: 'TRK-2025-091',
            type: 'Jumbo Bags',
            quantity: 40,
            destination: 'Project Site C',
            status: 'documentation',
            arrivalTime: '08:15',
            expectedDispatch: '09:00'
        }
    ],
    hourlyDispatch: Array.from({ length: 12 }, (_, i) => ({
        hour: `${i*2}:00`,
        bags: Math.floor(2500 + Math.random() * 1000),
        bulk: Math.floor(150 + Math.random() * 100),
        jumbo: Math.floor(80 + Math.random() * 40)
    })),
    qualityMetrics: {
        bagWeight: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            value: 50 + (Math.random() * 0.4 - 0.2),
            upper: 50.2,
            lower: 49.8
        })),
        tearRate: 0.3,
        printQuality: 99.2,
        moistureContent: 0.4
    },
    packingMaterial: {
        bags: { current: 25000, minimum: 15000 },
        pallets: { current: 450, minimum: 300 },
        shrinkWrap: { current: 15, minimum: 10 }
    },
    alerts: [
        {
            severity: 'warning',
            message: 'Packing Line 2 under maintenance - ETA 2 hours'
        },
        {
            severity: 'info',
            message: 'Bag inventory approaching minimum threshold'
        }
    ]
});

const DISPATCH_STATUS_COLORS = {
    loading: 'primary',
    waiting: 'warning',
    documentation: 'info',
    completed: 'success'
};

const PackingDispatchContent = ({ data }) => {
    if (data === undefined) return <LinearProgress />;
    const sampleData = data || packingDispatchData || generateSampleData();

    return (
        <Grid container spacing={2}>
            {/* Packing Lines Status */}
            <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                    Packing Lines Status
                </Typography>
                <Grid container spacing={2}>
                    {sampleData.packingLines.map(line => (
                        <Grid item xs={12} md={4} key={line.id}>
                            <Paper elevation={0} sx={{ p: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Package size={20} />
                                        <Typography variant="subtitle2">
                                            Line {line.id} - {line.type}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        size="small"
                                        label={line.status.charAt(0).toUpperCase() + line.status.slice(1)}
                                        color={line.status === 'operational' ? 'success' : 'warning'}
                                    />
                                </Box>
                                <Stack spacing={2}>
                                    <Box>
                                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="caption">Efficiency</Typography>
                                            <Typography variant="caption">{line.efficiency}%</Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={line.efficiency}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Speed</Typography>
                                        <Typography variant="body2">
                                            {line.currentSpeed}/{line.targetSpeed} units/hr
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Rejects</Typography>
                                        <Typography variant="body2" color={line.rejects > 1 ? 'error' : 'inherit'}>
                                            {line.rejects}%
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Downtime</Typography>
                                        <Typography variant="body2">
                                            {line.downtime} min
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* Dispatch Queue */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Truck size={20} />
                        <Typography variant="subtitle2">
                            Dispatch Queue
                        </Typography>
                    </Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Expected Dispatch</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sampleData.dispatchQueue.map((queue) => (
                                <TableRow key={queue.id}>
                                    <TableCell>{queue.id}</TableCell>
                                    <TableCell>{queue.type}</TableCell>
                                    <TableCell align="right">{queue.quantity}</TableCell>
                                    <TableCell>{queue.destination}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
                                            color={DISPATCH_STATUS_COLORS[queue.status]}
                                        />
                                    </TableCell>
                                    <TableCell>{queue.expectedDispatch}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>

            {/* Hourly Dispatch Rate */}
            <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <BarChart3 size={20} />
                        <Typography variant="subtitle2">
                            Hourly Dispatch Rate
                        </Typography>
                    </Box>
                    <Box height={250}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sampleData.hourlyDispatch}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="bags" name="50kg Bags" fill="#2196f3" />
                                <Bar dataKey="bulk" name="Bulk" fill="#4caf50" />
                                <Bar dataKey="jumbo" name="Jumbo Bags" fill="#ff9800" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

            {/* Quality Metrics */}
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <ClipboardCheck size={20} />
                        <Typography variant="subtitle2">
                            Quality Metrics
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="body2" gutterBottom>Bag Weight Control</Typography>
                            <Box height={100}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sampleData.qualityMetrics.bagWeight.slice(-12)}>
                                        <YAxis domain={[49.6, 50.4]} />
                                        <Tooltip />
                                        <Line 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#2196f3" 
                                            dot={false} 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="upper" 
                                            stroke="#ff9800" 
                                            strokeDasharray="3 3" 
                                            dot={false}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="lower" 
                                            stroke="#ff9800" 
                                            strokeDasharray="3 3" 
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Tear Rate</Typography>
                            <Typography 
                                variant="body2" 
                                color={sampleData.qualityMetrics.tearRate > 0.5 ? 'error' : 'inherit'}
                            >
                                {sampleData.qualityMetrics.tearRate}%
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Print Quality</Typography>
                            <Typography variant="body2">
                                {sampleData.qualityMetrics.printQuality}%
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Moisture Content</Typography>
                            <Typography 
                                variant="body2"
                                color={sampleData.qualityMetrics.moistureContent > 0.5 ? 'error' : 'inherit'}
                            >
                                {sampleData.qualityMetrics.moistureContent}%
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>

            {/* Packing Material Inventory */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <BoxSelect size={20} />
                        <Typography variant="subtitle2">
                            Packing Material Inventory
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {Object.entries(sampleData.packingMaterial).map(([key, data]) => (
                            <Grid item xs={12} md={4} key={key}>
                                <Box>
                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                        <Typography variant="body2">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </Typography>
                                        <Typography variant="body2">
                                            {data.current} / {data.minimum} min
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(data.current / data.minimum) * 50}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: 'grey.200',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: data.current < data.minimum * 1.2 ? 'warning.main' : 'success.main'
                                            }
                                        }}
                                    />
                                </Box>
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

export default function PackingDispatchCard({ process }) {
    const fetchPackingData = async () => {
        // For now, return null to use sample data
        return null;
        // Later: return await fetchProcessData('packing-dispatch');
    };

    return (
        <BaseProcessCard
            process={process}
            ProcessSpecificContent={PackingDispatchContent}
            fetchProcessSpecificData={fetchPackingData}
        />
    );
}
