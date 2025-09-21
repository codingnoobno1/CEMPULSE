'use client';
import { Grid, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ProcessCards = {
  'raw-material-extraction': dynamic(() => import('@/components/processcards/processes/RawMaterialExtractionCard')),
  'crushing-homogenization': dynamic(() => import('@/components/processcards/processes/CrushingCard')),
  'raw-meal-grinding': dynamic(() => import('@/components/processcards/processes/RawMealGrindingCard')),
  'raw-meal-homogenization': dynamic(() => import('@/components/processcards/processes/RawMealHomogenizationCard')),
  'preheater-precalciner': dynamic(() => import('@/components/processcards/processes/PreheaterPrecalcinerCard')),
  'kiln-operation': dynamic(() => import('@/components/processcards/processes/KilnOperationCard')),
  'clinker-cooling': dynamic(() => import('@/components/processcards/processes/ClinkerCoolingCard')),
  'clinker-storage': dynamic(() => import('@/components/processcards/processes/ClinkerStorageCard')),
  'cement-grinding': dynamic(() => import('@/components/processcards/processes/CementGrindingCard')),
  'cement-storage': dynamic(() => import('@/components/processcards/processes/CementStorageCard')),
  'packing-dispatch': dynamic(() => import('@/components/processcards/processes/PackingDispatchCard')),
  'energy-emission': dynamic(() => import('@/components/processcards/processes/EnergyEmissionCard')),
  'quality-control': dynamic(() => import('@/components/processcards/processes/QualityControlCard')),
};

export default function DashboardGrid({ processes }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {processes.map((process) => {
          const ProcessCard = ProcessCards[process.id];
          return ProcessCard ? (
            <Grid item xs={12} md={6} lg={4} key={process.stage}>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Box
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: 'hidden',
                    bgcolor: 'white',
                    p: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip label={`Stage ${process.stage}`} color="primary" size="small" />
                    <Chip label="Active ✅" color="success" size="small" />
                  </Box>
                  <ProcessCard process={process} />
                </Box>
              </motion.div>
            </Grid>
          ) : null;
        })}
      </Grid>
    </Box>
  );
}
