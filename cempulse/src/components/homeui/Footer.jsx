'use client';

import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 3, textAlign: 'center', backgroundColor: 'var(--steel-980)', color: 'var(--concrete-400)' }}>
      <Typography variant="caption">© {new Date().getFullYear()} CemPulse. All rights reserved.</Typography>
    </Box>
  );
}
