'use client';

import { Box, Grid, Typography, Paper, LinearProgress, Chip, Alert } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';
import BaseProcessCard from '../BaseProcessCard';
import { fetchProcessData } from '@/services/api';
import { Waves, Weight, Vibrate } from 'lucide-react';

const generateDummyData = () => ({
  currentVibration: 32.5,
  feedRate: 125,
  moisture: 8.5,
  particleSize: 45,
  vibrationHistory: Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    vibration: 30 + Math.random() * 10,
    threshold: 45
  })),
  feedHistory: Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    rate: 120 + Math.random() * 20
  })),
  particleSizeDistribution: [
    { size: '<30mm', percentage: 15 },
    { size: '30-45mm', percentage: 45 },
    { size: '45-60mm', percentage: 30 },
    { size: '>60mm', percentage: 10 }
  ],
  alerts: [
    {
      severity: 'warning',
      message: 'High vibration detected in crusher unit'
    },
    {
      severity: 'info',
      message: 'Feed rate optimized for current material type'
    }
  ]
});

const CrushingContent = ({ data }) => {
  const displayData = data || generateDummyData();

  return (
    <Grid container spacing={2}>
      {/* Vibration Monitoring */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Vibrate size={20} color="#2196f3" />
              <Typography variant="subtitle2">
                Crusher Vibration
              </Typography>
            </Box>
            <Chip
              label={`${displayData.currentVibration} Hz`}
              color={displayData.currentVibration > 40 ? 'error' : 'success'}
            />
          </Box>
          <Box height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData.vibrationHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[0, 50]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="vibration"
                  stroke="#2196f3"
                  fill="#2196f3"
                  fillOpacity={0.2}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#f44336"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Feed Rate */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Weight size={20} color="#4caf50" />
              <Typography variant="subtitle2">
                Feed Rate
              </Typography>
            </Box>
            <Chip
              label={`${displayData.feedRate} t/h`}
              color="primary"
            />
          </Box>
          <Box height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData.feedHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[100, 150]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#4caf50"
                  fill="#4caf50"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Material Properties */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Waves size={20} color="#ff9800" />
            <Typography variant="subtitle2">
              Material Properties
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" gutterBottom>
                  Moisture Content
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <LinearProgress
                    variant="determinate"
                    value={(displayData.moisture / 15) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      flexGrow: 1,
                      mr: 2
                    }}
                  />
                  <Typography variant="body2">
                    {displayData.moisture}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" gutterBottom>
                  Particle Size Distribution
                </Typography>
                <Grid container spacing={1}>
                  {displayData.particleSizeDistribution.map((item) => (
                    <Grid item xs={12} key={item.size}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption">
                          {item.size}
                        </Typography>
                        <Typography variant="caption">
                          {item.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
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

export default function RawMaterialExtractionCard({ process }) {
  const fetchCrushingData = async () => {
    try {
      const data = await fetchProcessData('crushing-homogenization');
      return data;
    } catch (error) {
      console.error('Failed to fetch crushing data:', error);
      return null; // fallback to dummy data
    }
  };

  return (
    <BaseProcessCard
      process={process}
      ProcessSpecificContent={CrushingContent}
      fetchProcessSpecificData={fetchCrushingData}
    />
  );
}
