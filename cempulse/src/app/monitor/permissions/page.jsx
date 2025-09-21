'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { motion } from 'framer-motion';
import { processData } from '@/components/processcards/processData';
import { AssignmentTurnedIn, Factory, Warehouse, Science, LocalShipping, EnergySavingsLeaf } from '@mui/icons-material';

const ROLES = ['Operations Head', 'Plant Manager'];
const STORAGE_KEY = 'role_permissions_v1';

// Role → description mapping
const ROLE_INFO = {
  'Operations Head': 'Oversees full plant operations and efficiency.',
  'Plant Manager': 'Manages daily production and resource allocation.'
};

// Stage → icon + color
const STAGE_MAP = {
  1: { icon: <Factory color="success" />, color: 'success.light' },
  2: { icon: <Science color="warning" />, color: 'warning.light' },
  3: { icon: <Warehouse color="info" />, color: 'info.light' },
  4: { icon: <LocalShipping color="secondary" />, color: 'secondary.light' },
  5: { icon: <AssignmentTurnedIn color="primary" />, color: 'primary.light' },
  6: { icon: <EnergySavingsLeaf color="success" />, color: 'success.light' }
};

function loadPermissions() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePermissions(permissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
  } catch {}
}

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    setPermissions(loadPermissions());
  }, []);

  useEffect(() => {
    savePermissions(permissions);
  }, [permissions]);

  const processes = useMemo(
    () => processData.map((p) => ({ id: p.id, name: p.name, stage: p.stage })),
    []
  );

  const roleSet = new Set(permissions[selectedRole] || []);
  const toggleProcess = (pid) => {
    const next = new Set(roleSet);
    next.has(pid) ? next.delete(pid) : next.add(pid);
    setPermissions((prev) => ({ ...prev, [selectedRole]: Array.from(next) }));
  };

  const selectAll = () =>
    setPermissions((prev) => ({ ...prev, [selectedRole]: processes.map((p) => p.id) }));
  const clearAll = () => setPermissions((prev) => ({ ...prev, [selectedRole]: [] }));

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for roles */}
      <Paper
        sx={{
          width: 250,
          p: 2,
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        elevation={4}
      >
        <Typography variant="h6" fontWeight="bold">
          Roles
        </Typography>
        <List>
          {ROLES.map((role) => (
            <ListItem
              key={role}
              button
              selected={role === selectedRole}
              onClick={() => setSelectedRole(role)}
              sx={{
                borderRadius: 2,
                mb: 1
              }}
            >
              <ListItemText primary={role} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {selectedRole}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {ROLE_INFO[selectedRole]}
        </Typography>

        {/* Action bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="contained" size="small" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outlined" size="small" onClick={clearAll}>
            Clear
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {roleSet.size}/{processes.length} selected
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Process cards */}
        <Grid container spacing={2}>
          {processes
            .sort((a, b) => a.stage - b.stage)
            .map((p) => {
              const stageInfo = STAGE_MAP[p.stage] || {};
              return (
                <Grid key={p.id} item xs={12} sm={6} md={4}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: roleSet.has(p.id) ? stageInfo.color || 'grey.100' : 'background.paper'
                      }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={roleSet.has(p.id)}
                              onChange={() => toggleProcess(p.id)}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {stageInfo.icon}
                              <Typography>{p.name}</Typography>
                            </Box>
                          }
                        />
                      </FormGroup>
                    </Paper>
                  </motion.div>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Box>
  );
}
