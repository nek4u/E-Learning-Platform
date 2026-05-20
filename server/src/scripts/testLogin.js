import 'dotenv/config';
import jwt from 'jsonwebtoken';

const API = process.env.API_URL || 'http://localhost:5000/api/v1';

const accounts = [
  { email: 'student@inacademy.com', password: 'Student@123', role: 'student' },
  { email: 'admin@inacademy.com', password: 'Admin@123', role: 'admin' },
];

const run = async () => {
  let passed = 0;
  const health = await fetch(`${API}/health`);
  if (!health.ok) throw new Error(`Health check failed: ${health.status}`);
  console.log('✓ API health OK');

  for (const acc of accounts) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: acc.email, password: acc.password }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(`Login failed for ${acc.email}: ${body.message}`);
    }
    const { accessToken, refreshToken, user } = body.data;
    if (!accessToken || !refreshToken) throw new Error(`Missing tokens for ${acc.email}`);
    if (user.role !== acc.role) throw new Error(`Role mismatch for ${acc.email}: expected ${acc.role}, got ${user.role}`);

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (!decoded.id) throw new Error(`Invalid JWT for ${acc.email}`);

    const meRes = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meBody = await meRes.json();
    if (!meRes.ok || meBody.data?.user?.email !== acc.email) {
      throw new Error(`/auth/me failed for ${acc.email}`);
    }
    console.log(`✓ Login + JWT + /me OK: ${acc.email}`);
    passed++;
  }

  const corsRes = await fetch(`${API}/auth/login`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
    },
  });
  const acao = corsRes.headers.get('access-control-allow-origin');
  if (!acao) console.warn('⚠ CORS header missing on OPTIONS');
  else console.log(`✓ CORS OK: ${acao}`);

  console.log(`\n${passed}/${accounts.length} login tests passed`);
  process.exit(0);
};

run().catch((e) => {
  console.error('✗', e.message);
  process.exit(1);
});
