'use client';
import { Box, Typography, Paper, Button } from '@mui/material';

export default function ActionBox({ user }) {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⚡ Actions & Permissions
        </Typography>

        {user?.role === 'operator' ? (
          <Box>
            <Typography variant="body2" gutterBottom>
              Suggested actions require supervisor approval.
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }}>
              Request Approval
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" gutterBottom>
              You can apply AI-suggested actions directly.
            </Typography>
            <Button variant="contained" color="success" sx={{ mt: 1 }}>
              Apply Action
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
