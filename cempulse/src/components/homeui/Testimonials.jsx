'use client';

import { Container, Typography, Grid, Card, CardContent, Avatar, Box } from '@mui/material';

const testimonials = [
  { name: 'Operations Head', org: 'Shree Cement', quote: 'We finally see issues before they happen. Rock-solid system.' },
  { name: 'Plant Manager', org: 'UltraTech', quote: 'Actionable dashboards improved our shift handovers dramatically.' },
  { name: 'Maintenance Lead', org: 'ACC', quote: 'Predictive alerts reduced emergency callouts across departments.' },
];

export default function Testimonials() {
  return (
    <Container id="testimonials" sx={{ py: { xs: 8, md: 10 } }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        What Clients Say
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {testimonials.map((t, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card elevation={2} sx={{ height: '100%', backgroundColor: 'var(--steel-800)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'var(--accent)' }}>{t.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{t.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--concrete-300)' }}>{t.org}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1.5, color: 'var(--concrete-200)' }}>
                  “{t.quote}”
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
