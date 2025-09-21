'use client';

import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname(); // current route
  const scrollToSection = (id) => {
    if (typeof window !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigation links
  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'Projects', id: 'projects' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'var(--steel-900-translucent)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Brand */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ letterSpacing: 0.5, cursor: 'pointer' }}
          onClick={() => pathname === '/' ? scrollToSection('hero') : window.location.href = '/'}
        >
          CemPulse — Reliable. Efficient. Innovative.
        </Typography>

        {/* Desktop Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.label}
              color="inherit"
              onClick={() =>
                pathname === '/' ? scrollToSection(link.id) : window.location.href = `/#${link.id}`
              }
            >
              {link.label}
            </Button>
          ))}

          {/* View Production CTA */}
          <Button
            variant="contained"
            endIcon={<ChevronRight size={16} />}
            sx={{
              ml: 1,
              backgroundColor: 'var(--accent)',
              '&:hover': { backgroundColor: 'var(--accent-600)' },
            }}
            href="/monitor"
          >
            View Production
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
