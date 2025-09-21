'use client';

import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function Projects() {
  return (
    <Box id="projects" sx={{ py: { xs: 8, md: 10 }, background: 'linear-gradient(180deg, var(--steel-950), var(--steel-900))' }}>
      <Container>
        <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ color: 'var(--concrete-50)' }}>
          Recent Projects
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {[1,2,3].map((n) => (
            <Grid item xs={12} md={4} key={n}>
              <Card component={motion.div} whileHover={{ scale: 1.02 }} elevation={2} sx={{ overflow: 'hidden', backgroundColor: 'var(--steel-800)' }}>
                <Box sx={{ height: 160, backgroundImage: 'url(/globe.svg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(1.1)' }} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="var(--concrete-50)">Optimized Clinker Line #{n}</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--concrete-300)', mt: 0.5 }}>
                    Cut downtime by 18% and improved heat rate via predictive insights.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
