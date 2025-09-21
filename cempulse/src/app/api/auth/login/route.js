import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';

// Define all processes in the cement plant
const PROCESSES = {
  RAW: [
    'raw-material-extraction',
    'crushing-homogenization',
    'raw-meal-grinding',
    'raw-meal-homogenization'
  ],
  KILN: [
    'preheater-precalciner',
    'kiln-operation',
    'clinker-cooling'
  ],
  STORAGE: [
    'clinker-storage',
    'cement-storage'
  ],
  FINISHING: [
    'cement-grinding',
    'packing-dispatch'
  ],
  QA: [
    'quality-control'
  ],
  ENERGY: [
    'energy-emission'
  ]
};

// Map each role (position) to allowed processes
const USERS = [
  {
    username: 'Operations Head',
    password: 'password',
    role: 'Operations Head',
    allowedProcesses: [
      ...PROCESSES.RAW,
      ...PROCESSES.KILN,
      ...PROCESSES.STORAGE,
      ...PROCESSES.FINISHING,
      ...PROCESSES.QA,
      ...PROCESSES.ENERGY
    ] // full plant oversight
  },
  {
    username: 'Plant Manager',
    password: 'password',
    role: 'Plant Manager',
    allowedProcesses: [
      ...PROCESSES.RAW,
      ...PROCESSES.KILN,
      ...PROCESSES.STORAGE,
      ...PROCESSES.FINISHING
    ]
  },
  {
    username: 'Maintenance Lead',
    password: 'password',
    role: 'Maintenance Lead',
    allowedProcesses: [
      'crushing-homogenization',
      'raw-meal-grinding',
      'kiln-operation',
      'clinker-cooling',
      'cement-grinding'
    ]
  },
  {
    username: 'Shift Supervisor',
    password: 'password',
    role: 'Shift Supervisor',
    allowedProcesses: [
      'raw-material-extraction',
      'preheater-precalciner',
      'kiln-operation',
      'packing-dispatch'
    ]
  },
  {
    username: 'Quality Engineer',
    password: 'password',
    role: 'Quality Engineer',
    allowedProcesses: PROCESSES.QA
  },
  {
    username: 'Dispatch Coordinator',
    password: 'password',
    role: 'Dispatch Coordinator',
    allowedProcesses: [
      'cement-storage',
      'packing-dispatch'
    ]
  },
  {
    username: 'Energy Analyst',
    password: 'password',
    role: 'Energy Analyst',
    allowedProcesses: PROCESSES.ENERGY
  },
  {
    username: 'Production Engineer',
    password: 'password',
    role: 'Production Engineer',
    allowedProcesses: [
      ...PROCESSES.RAW,
      ...PROCESSES.KILN
    ]
  },
  {
    username: 'Safety Officer',
    password: 'password',
    role: 'Safety Officer',
    allowedProcesses: [
      'kiln-operation',
      'clinker-cooling',
      'energy-emission'
    ]
  },
  {
    username: 'Logistics Manager',
    password: 'password',
    role: 'Logistics Manager',
    allowedProcesses: [
      'cement-storage',
      'packing-dispatch'
    ]
  }
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = signJwt({
      sub: user.username,
      role: user.role,
      allowed: user.allowedProcesses
    });

    const res = NextResponse.json(
      { user: { username: user.username, role: user.role, allowed: user.allowedProcesses } },
      { status: 200 }
    );

    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
      sameSite: 'lax'
    });

    return res;
  } catch (e) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}
