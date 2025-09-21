'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Avatar,
  Stack,
  Divider,
  TextField
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AIPrompter({ user, processes }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  if (!user || !processes)
    return <Typography>Loading AI Assistant...</Typography>;

  const askGemini = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/genai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processes: processes.map((p) => p.id),
          role: user.role,
          timestamp: new Date().toISOString(),
          message: prompt
        })
      });

      const data = await res.json();
      setResponse(
        data.suggestions || [
          { message: 'No suggestions available', severity: 'info' }
        ]
      );
    } catch (err) {
      setResponse([
        { message: 'Failed to fetch AI insights. Try again.', severity: 'error' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: '#f4f6fa'
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Avatar
            src="/images/gemini-logo.jpg"
            alt="Gemini AI"
            sx={{ width: 48, height: 48 }}
          />
          <Typography variant="h6" fontWeight="bold">
            Gemini AI Assistant
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          AI-powered recommendations and insights for your plant operations.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Role Info */}
        <Stack direction="row" spacing={1} mb={2}>
          <Typography variant="caption" color="text.secondary">
            Role:
          </Typography>
          <Typography variant="caption" fontWeight="bold">
            {user?.role || 'Unknown'}
          </Typography>
        </Stack>

        {/* Processes Tags */}
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {processes.map((p) => (
            <Typography
              key={p.id}
              variant="caption"
              sx={{ bgcolor: '#e0e7ff', px: 1.5, py: 0.5, borderRadius: 1 }}
            >
              {p.name || p.id}
            </Typography>
          ))}
        </Stack>

        {/* Prompt Input */}
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={5}
          placeholder="Enter a question or instruction for Gemini AI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Ask Gemini Button */}
        <Button
          onClick={askGemini}
          variant="contained"
          disabled={loading || !prompt.trim()}
          sx={{ mt: 1, mb: 2 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Analyzing...
            </>
          ) : (
            'Ask Gemini'
          )}
        </Button>

        {/* ✅ AI Response Section (now inside return) */}
        <Box sx={{ mt: 3 }}>
          {loading && !response && (
            <Typography variant="body2" color="text.secondary">
              Generating insights for {processes.length}
              {processes.length > 1 ? ' processes' : ' process'}...
            </Typography>
          )}

          {response?.length > 0 && (
            <Stack spacing={2}>
              {response.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.4 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      bgcolor:
                        item.severity === 'warning'
                          ? 'linear-gradient(135deg, #fff3e0, #ffe0b2)'
                          : item.severity === 'error'
                          ? 'linear-gradient(135deg, #ffebee, #ffcdd2)'
                          : 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                      borderLeft: `5px solid ${
                        item.severity === 'warning'
                          ? '#f57c00'
                          : item.severity === 'error'
                          ? '#d32f2f'
                          : '#1976d2'
                      }`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    {/* Severity Icon */}
                    <Avatar
                      sx={{
                        bgcolor:
                          item.severity === 'warning'
                            ? '#f57c00'
                            : item.severity === 'error'
                            ? '#d32f2f'
                            : '#1976d2',
                        width: 32,
                        height: 32,
                        fontSize: 18
                      }}
                    >
                      {item.severity === 'warning'
                        ? '⚠️'
                        : item.severity === 'error'
                        ? '❌'
                        : '💡'}
                    </Avatar>

                    {/* Message */}
                    <Typography variant="body2" sx={{ color: '#333' }}>
                      {item.message}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
