'use client';
import { Box, Typography } from '@mui/material';

export default function WelcomeBanner({ user }) {
  return (
    <Box sx={{ p: 3 }}>
      {user && (
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome back, {user.username}! 👋
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary">
        Monitoring active processes and plant performance.
      </Typography>
    </Box>
  );
}
