'use client';

import { useState } from 'react';
import {   Card,   CardContent, Typography,  IconButton,  Box,   Modal,  Grid,  Paper,  Divider,  Switch,  Button,  Tab,  Tabs,  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TableRow,  Chip,  Alert} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {   Maximize2,  Minimize2,  AlertTriangle,  Play,   Pause,   RefreshCw,  Download,  Clock,  Zap,  ThermometerIcon,  BarChart3,  Settings,  Info} from 'lucide-react';
import {   LineChart,   Line,   XAxis,  YAxis,  CartesianGrid,  Tooltip,   ResponsiveContainer,  AreaChart,  Area,  PieChart,  Pie,  Cell } from 'recharts';

// Generate dummy data for the charts
const generateDummyData = (parameter, hours = 24) => {
  const baseValue = (parameter.maxValue + parameter.minValue) / 2;
  const amplitude = (parameter.maxValue - parameter.minValue) / 4;
  
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date();
    time.setHours(time.getHours() - (hours - i));
    
    // Create a more realistic wave pattern with some randomness
    const value = baseValue + 
      amplitude * Math.sin(i / 3) + 
      (Math.random() - 0.5) * amplitude;

    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.max(parameter.minValue, Math.min(parameter.maxValue, value)),
      alert: value > parameter.maxValue || value < parameter.minValue
    };
  });
};

// Generate efficiency data
const generateEfficiencyData = () => {
  return [
    { name: 'Optimal', value: 65 },
    { name: 'Suboptimal', value: 25 },
    { name: 'Critical', value: 10 }
  ];
};

// Generate energy consumption data
const generateEnergyData = (hours = 24) => {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${i}:00`,
    consumption: Math.random() * 100 + 50,
    baseline: 75
  }));
};

export default function ProcessCard({ process }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [data] = useState(() => 
    process.parameters.map(param => ({
      ...param,
      data: generateDummyData(param),
      status: Math.random() > 0.8 ? 'warning' : 'normal'
    }))
  );
  const [efficiencyData] = useState(generateEfficiencyData());
  const [energyData] = useState(generateEnergyData());

  const isAlertActive = data.some(param => 
    param.data[param.data.length - 1].value > param.maxValue || 
    param.data[param.data.length - 1].value < param.minValue
  );

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];
  
  const getStatusColor = (value, param) => {
    if (value >= param.maxValue) return 'error.main';
    if (value >= param.maxValue * 0.9) return 'warning.main';
    if (value <= param.minValue) return 'error.main';
    if (value <= param.minValue * 1.1) return 'warning.main';
    return 'success.main';
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95vw',
    height: '95vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2
  };

  const CardWrapper = motion(Card);

  return (
    <>
      <CardWrapper
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        sx={{ position: 'relative', height: '100%' }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              {process.stage}. {process.name}
            </Typography>
            <Box>
              {isAlertActive && (
                <IconButton color="warning">
                  <AlertTriangle />
                </IconButton>
              )}
              <IconButton onClick={() => setIsFullScreen(true)}>
                <Maximize2 />
              </IconButton>
            </Box>
          </Box>

          <Box 
            component="img" 
            src={process.image} 
            alt={process.name}
            sx={{ 
              width: '100%', 
              height: '150px',
              objectFit: 'cover',
              borderRadius: 1,
              mb: 2
            }}
          />

          <Grid container spacing={2}>
            {data.map((param, index) => {
              const currentValue = param.data[param.data.length - 1].value;
              const isParamAlert = currentValue > param.maxValue || currentValue < param.minValue;

              return (
                <Grid item xs={12} md={6} key={index}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color={isParamAlert ? 'warning.main' : 'text.primary'}>
                      {param.name}: {currentValue.toFixed(2)} {param.unit}
                    </Typography>
                    <Box height={100}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={param.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[param.minValue, param.maxValue]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={isParamAlert ? '#ff9800' : '#2196f3'} 
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </CardWrapper>

      <Modal
        open={isFullScreen}
        onClose={() => setIsFullScreen(false)}
      >
        <Box sx={modalStyle}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="background.paper" borderBottom={1} borderColor="divider">
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5" fontWeight="bold">
                {process.stage}. {process.name}
              </Typography>
              <Chip 
                label={isRunning ? 'Running' : 'Paused'} 
                color={isRunning ? 'success' : 'warning'} 
                size="small" 
              />
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
              </IconButton>
              <IconButton>
                <RefreshCw size={20} />
              </IconButton>
              <IconButton>
                <Download size={20} />
              </IconButton>
              <IconButton onClick={() => setIsFullScreen(false)}>
                <Minimize2 size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab icon={<BarChart3 size={16} />} label="Overview" />
              <Tab icon={<ThermometerIcon size={16} />} label="Parameters" />
              <Tab icon={<Zap size={16} />} label="Energy" />
              <Tab icon={<Settings size={16} />} label="Controls" />
            </Tabs>
          </Box>

          {/* Content */}
          <Box flex={1} overflow="auto" p={2}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {selectedTab === 0 && (
                  <Grid container spacing={3}>
                    {/* Process Image and Info */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
                        <Box 
                          component="img" 
                          src={process.image} 
                          alt={process.name}
                          sx={{ 
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: 1,
                            mb: 2
                          }}
                        />
                        <Typography variant="h6" gutterBottom>Process Information</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          This stage is crucial for the cement manufacturing process. It involves sophisticated
                          equipment and precise control mechanisms to ensure optimal production quality.
                        </Typography>
                        <Box display="flex" gap={2}>
                          <Chip icon={<Clock size={16} />} label="24/7 Operation" />
                          <Chip icon={<AlertTriangle size={16} />} label="Critical Process" />
                          <Chip icon={<Info size={16} />} label="ISO 9001" />
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Key Metrics */}
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Paper elevation={0} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Process Efficiency</Typography>
                            <Box height={200}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={efficiencyData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {efficiencyData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper elevation={0} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Status Overview</Typography>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Parameter</TableCell>
                                    <TableCell align="right">Current</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {data.map((param) => {
                                    const currentValue = param.data[param.data.length - 1].value;
                                    return (
                                      <TableRow key={param.name}>
                                        <TableCell>{param.name}</TableCell>
                                        <TableCell align="right">
                                          {currentValue.toFixed(2)} {param.unit}
                                        </TableCell>
                                        <TableCell align="right">
                                          <Chip 
                                            size="small"
                                            label={param.status}
                                            color={param.status === 'warning' ? 'warning' : 'success'}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {selectedTab === 1 && (
                  <Grid container spacing={3}>
                    {data.map((param, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">{param.name}</Typography>
                            <Chip 
                              label={`${param.data[param.data.length - 1].value.toFixed(2)} ${param.unit}`}
                              color={getStatusColor(param.data[param.data.length - 1].value, param) === 'success.main' ? 'success' : 'warning'}
                            />
                          </Box>
                          <Box height={300}>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={param.data}>
                                <defs>
                                  <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#2196f3" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis domain={[param.minValue, param.maxValue]} />
                                <Tooltip />
                                <Area 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#2196f3" 
                                  fill={`url(#gradient-${index})`}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </Box>
                          <Box display="flex" justifyContent="space-between" mt={2}>
                            <Typography variant="body2" color="text.secondary">
                              Min: {param.minValue} {param.unit}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Max: {param.maxValue} {param.unit}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {selectedTab === 2 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Energy Consumption Trend</Typography>
                        <Box height={400}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={energyData}>
                              <defs>
                                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Area 
                                type="monotone" 
                                dataKey="consumption" 
                                stroke="#82ca9d" 
                                fill="url(#energyGradient)" 
                              />
                              <Line 
                                type="monotone" 
                                dataKey="baseline" 
                                stroke="#ff7300" 
                                strokeDasharray="5 5"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Energy Metrics</Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableBody>
                              <TableRow>
                                <TableCell>Current Consumption</TableCell>
                                <TableCell align="right">87.5 kWh</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Daily Average</TableCell>
                                <TableCell align="right">92.3 kWh</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Efficiency Rating</TableCell>
                                <TableCell align="right">94%</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Cost per Hour</TableCell>
                                <TableCell align="right">$12.50</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Optimization Suggestions</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <Alert severity="info">
                            Consider adjusting operation times to off-peak hours
                          </Alert>
                          <Alert severity="success">
                            Current efficiency is above target threshold
                          </Alert>
                          <Alert severity="warning">
                            Maintenance recommended within next 48 hours
                          </Alert>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                {selectedTab === 3 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Process Controls</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                          {data.map((param, index) => (
                            <Box key={index}>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography>{param.name} Control</Typography>
                                <Switch defaultChecked />
                              </Box>
                              <Divider sx={{ my: 1 }} />
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Manual Override</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <Button variant="outlined" color="primary" startIcon={<Play size={16} />}>
                            Start Process
                          </Button>
                          <Button variant="outlined" color="warning" startIcon={<Pause size={16} />}>
                            Pause Process
                          </Button>
                          <Button variant="outlined" color="error" startIcon={<AlertTriangle size={16} />}>
                            Emergency Stop
                          </Button>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Warning: Manual override should only be used by authorized personnel
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
