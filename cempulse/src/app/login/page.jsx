'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const search = useSearchParams();

  // Dummy roles for the cement plant
  const roles = [
    'Operations Head',
    'Plant Manager',
    'Maintenance Lead',
    'Shift Supervisor',
    'Quality Engineer',
    'Dispatch Coordinator',
    'Energy Analyst',
    'Production Engineer',
    'Safety Officer',
    'Logistics Manager'
  ];

  const handleLogin = async () => {
    setError('');
    if (!role) {
      setError('Please select a role');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Login failed');
      }

      const redirect = search.get('redirect') || '/monitor';
      router.push(redirect);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: 'url(https://www.lucky-cement.com/wp-content/uploads/2017/01/cement-plant1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 3,
            textAlign: 'center',
            minWidth: 320,
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            CemPulse Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            size="small"
            sx={{ mb: 2, mt: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={role}
              label="Select Role"
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Login
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
