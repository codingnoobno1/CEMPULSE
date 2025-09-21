'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { processData } from '@/components/processcards/processData';

import TopBar from './TopBar';
import WelcomeBanner from './WelcomeBanner';
import DashboardGrid from './DashboardGrid';
import AIPrompter from './AIPrompter';
import ActionBox from './ActionBox';

const STORAGE_KEY = 'role_permissions_v1';

export default function MonitorPage() {
  const [user, setUser] = useState(null);
  const [allowed, setAllowed] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);

      let allowedList = data.user.allowed;
      if (!allowedList) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const perms = raw ? JSON.parse(raw) : {};
          allowedList = perms[data.user.role] || null;
        } catch {
          allowedList = null;
        }
      }
      setAllowed(allowedList);
    };
    load();
  }, [router]);

  const visibleProcesses = useMemo(() => {
    if (!allowed) return [];
    const set = new Set(allowed);
    return processData.filter((p) => set.has(p.id));
  }, [allowed]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <TopBar user={user} />
      <WelcomeBanner user={user} />

      <Divider />

      {/* Dashboard */}
      <DashboardGrid processes={visibleProcesses} />

      {/* AI Suggestion Panel */}
      <AIPrompter user={user} processes={visibleProcesses} />

      {/* Action Box (approvals/permissions) */}
      <ActionBox user={user} />
    </Box>
  );
}
