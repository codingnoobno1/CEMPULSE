'use client';
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from '@mui/material';

export default function TopBar({ user }) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#2f3e46' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold" color="white">
          🏭 Factory Monitoring Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <Typography color="white">
                {user.username} ({user.role})
              </Typography>
              <Avatar>{user.username[0].toUpperCase()}</Avatar>
            </>
          )}
          <Button href="/monitor/permissions" variant="outlined" color="inherit">
            Permissions
          </Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
