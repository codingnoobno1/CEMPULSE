'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronRight, Gauge, Wrench, BarChart3 } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        position: 'relative',
        display: 'grid',
        alignItems: 'center',
        minHeight: { xs: '70vh', md: '80vh' },
        px: 2,
        py: { xs: 8, md: 12 },
        color: 'var(--concrete-50)',
        backgroundImage: 'linear-gradient(rgba(18,28,38,0.65), rgba(18,28,38,0.65)), url(/window.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" fontWeight="800" sx={{ lineHeight: 1.1 }}>
          Cement Factory Operations, Optimized.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, color: 'var(--concrete-200)' }}>
          From kiln to packing, gain real-time visibility and actionable insights to drive uptime,
          efficiency, and quality.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ChevronRight size={18} />}
            sx={{ backgroundColor: 'var(--accent)', '&:hover': { backgroundColor: 'var(--accent-600)' } }}
            href="/monitor"
          >
            View Production
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderColor: 'var(--accent)', color: 'var(--accent)', '&:hover': { borderColor: 'var(--accent-600)', color: 'var(--accent-600)' } }}
            onClick={() => scrollToSection('contact')}
          >
            Schedule Delivery
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, mt: 4, color: 'var(--concrete-300)', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Gauge size={18} /> Real-time SCADA</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Wrench size={18} /> Predictive Maintenance</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><BarChart3 size={18} /> Production Analytics</Box>
        </Box>
      </Container>
    </Box>
  );
}
