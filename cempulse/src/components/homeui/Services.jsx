'use client';

import { Container, Typography, Grid, Card, CardContent, Box, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Factory, Gauge, Wrench, Truck, BarChart3, Zap } from 'lucide-react';

const services = [
  {
    icon: <Factory size={24} />,
    title: 'Gemmini Process Monitoring',
    desc: 'Visualize kiln, preheater, and packing operations in real time using Gemmini insights.',
    highlights: [
      'Track production line metrics with intuitive dashboards',
      'Detect anomalies before they affect output',
      'Enable junior staff to monitor processes confidently',
    ]
  },
  {
    icon: <Gauge size={24} />,
    title: 'Usage Statistics & Analytics',
    desc: 'Understand energy, heat, and material usage trends to optimize efficiency.',
    highlights: [
      'Real-time power and heat rate monitoring',
      'Historical data trends & predictive analytics',
      'Quick identification of inefficiencies',
    ]
  },
  {
    icon: <Wrench size={24} />,
    title: 'Maintenance Intelligence',
    desc: 'Predict failures, schedule interventions, and reduce downtime across units.',
    highlights: [
      'Predictive alerts for machine maintenance',
      'Step-by-step guidance for operators',
      'Minimize unplanned stoppages',
    ]
  },
  {
    icon: <Truck size={24} />,
    title: 'Logistics & Dispatch Optimization',
    desc: 'Coordinate deliveries efficiently to save time and reduce errors.',
    highlights: [
      'Track shipments in real time',
      'Automated scheduling and alerts',
      'Reduce human error in dispatch',
    ]
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Production Reporting & KPIs',
    desc: 'Generate shift-wise, daily, and monthly reports for managers and engineers.',
    highlights: [
      'Automated KPI dashboards',
      'Detailed analytics for decision-making',
      'Accessible even to less experienced staff',
    ]
  },
  {
    icon: <Zap size={24} />,
    title: 'Alerts & Notifications',
    desc: 'Stay informed of abnormal events or thresholds across the plant.',
    highlights: [
      'Customizable alerts for critical events',
      'Predictive notifications for preventive action',
      'Empowers inexperienced employees to act effectively',
    ]
  },
];

export default function Services() {
  return (
    <Container id="services" sx={{ py: { xs: 10, md: 12 } }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 1 }}>
        Our Services
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ color: 'text.secondary', mb: 6, maxWidth: 650, mx: 'auto' }}>
        Leverage Gemmini-powered insights to monitor, analyze, and optimize your cement production. Even inexperienced employees can make informed decisions, improving uptime and productivity across the plant.
      </Typography>

      <Grid container spacing={4}>
        {services.map((s, i) => (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Card
              component={motion.div}
              whileHover={{ y: -6, scale: 1.03 }}
              elevation={6}
              sx={{
                height: '100%',
                backgroundColor: 'var(--steel-800)',
                borderRadius: 3,
                px: 2,
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, color: 'var(--accent)' }}>
                {s.icon}
                <Typography variant="h6" fontWeight="bold">{s.title}</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--concrete-200)', mb: 2 }}>
                {s.desc}
              </Typography>
              <Divider sx={{ borderColor: 'var(--steel-700)', my: 1 }} />
              <Box>
                {s.highlights.map((h, idx) => (
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: idx === 0 ? 0 : 1, color: 'var(--concrete-300)' }}
                    key={idx}
                  >
                    <Zap size={16} /> {h}
                  </Typography>
                ))}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
