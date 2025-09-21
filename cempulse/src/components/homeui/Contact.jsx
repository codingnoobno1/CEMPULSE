'use client';

import { Box, Container, Grid, Typography, Card, CardContent, Button, Link as MuiLink } from '@mui/material';

export default function Contact() {
  return (
    <Box id="contact" sx={{ py: { xs: 8, md: 10 }, backgroundColor: 'var(--steel-950)' }}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--concrete-50)' }}>
              Let’s talk reliability, efficiency, and innovation.
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--concrete-300)', mt: 1 }}>
              Reach out to schedule a plant walk-through or a live demo.
            </Typography>
            <Box sx={{ mt: 3, display: 'grid', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'var(--concrete-200)' }}>
                Email: support@cempulse.io
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--concrete-200)' }}>
                Phone: +91 98765 43210
              </Typography>
              <MuiLink href="/login" underline="hover" sx={{ color: 'var(--accent)' }}>
                Go to Login
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ backgroundColor: 'var(--steel-800)' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  Quick Inquiry
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--concrete-300)', mt: 0.5 }}>
                  Email us and our team will respond within one business day.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: 'var(--accent)', '&:hover': { backgroundColor: 'var(--accent-600)' } }}
                    href="mailto:support@cempulse.io"
                  >
                    Email Us
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ borderColor: 'var(--accent)', color: 'var(--accent)', '&:hover': { borderColor: 'var(--accent-600)', color: 'var(--accent-600)' } }}
                    href="/monitor"
                  >
                    View Production
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
