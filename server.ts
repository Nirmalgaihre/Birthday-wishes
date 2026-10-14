import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Admin Credentials
const AUTHORIZED_EMAILS = ['gaihrenirmal2021@gmail.com', 'niralgaihre'];
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'niralgaihre2026';

// Persistent storage file
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'tracked_clicks.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ClickEvent {
  id: string;
  timestamp: string;
  nepalTime: string;
  action: string;
  label: string;
  elementId?: string;
  section?: string;
  ip: string;
  geo: {
    city: string;
    region: string;
    country: string;
    countryCode: string;
    isp: string;
    lat?: number;
    lon?: number;
    source: string;
  };
  device: {
    type: 'Mobile' | 'Tablet' | 'Desktop';
    os: string;
    browser: string;
    screen?: string;
    platform?: string;
  };
  metadata?: Record<string, unknown>;
}

// In-memory events list synced with file
let events: ClickEvent[] = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    events = JSON.parse(raw);
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
} catch (e) {
  console.error('Failed reading data file:', e);
  events = [];
}

function saveEvents() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
  } catch (e) {
    console.error('Failed saving data file:', e);
  }
}

// Active admin sessions
const activeSessions = new Set<string>();

// Helper: parse cookies
function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      list[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });
  return list;
}

// IP detection
function getClientIp(req: express.Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    const first = xForwardedFor.split(',')[0].trim();
    if (first && first !== 'unknown') return first;
  }
  const xRealIp = req.headers['x-real-ip'];
  if (typeof xRealIp === 'string' && xRealIp !== 'unknown') return xRealIp.trim();
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (typeof cfConnectingIp === 'string') return cfConnectingIp.trim();
  return req.socket.remoteAddress || '127.0.0.1';
}

// Simple in-memory IP Geo Cache
const geoCache = new Map<string, ClickEvent['geo']>();

async function resolveGeo(ip: string, timezoneHint?: string): Promise<ClickEvent['geo']> {
  const cleanIp = ip.replace(/^::ffff:/, '').trim();

  // Check for private / loopback IPs
  const isPrivate =
    cleanIp === '127.0.0.1' ||
    cleanIp === '::1' ||
    cleanIp.startsWith('10.') ||
    cleanIp.startsWith('192.168.') ||
    cleanIp.startsWith('172.16.') ||
    cleanIp.startsWith('172.31.') ||
    cleanIp.startsWith('fc00:') ||
    cleanIp.startsWith('fe80:');

  if (isPrivate) {
    const isNepal = timezoneHint && timezoneHint.toLowerCase().includes('kathmandu');
    return {
      city: isNepal ? 'Kathmandu' : 'Local / Dev Network',
      region: isNepal ? 'Bagmati' : 'Local Area',
      country: isNepal ? 'Nepal' : 'Localhost',
      countryCode: isNepal ? 'NP' : 'LOC',
      isp: 'Internal Network',
      source: 'timezone-inference',
    };
  }

  if (geoCache.has(cleanIp)) {
    return geoCache.get(cleanIp)!;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const resp = await fetch(
      `http://ip-api.com/json/${cleanIp}?fields=status,message,country,countryCode,regionName,city,isp,lat,lon`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (data.status === 'success') {
        const geoInfo: ClickEvent['geo'] = {
          city: data.city || 'Unknown City',
          region: data.regionName || 'Unknown Region',
          country: data.country || 'Unknown Country',
          countryCode: data.countryCode || 'UN',
          isp: data.isp || 'Unknown ISP',
          lat: data.lat,
          lon: data.lon,
          source: 'ip-lookup',
        };
        geoCache.set(cleanIp, geoInfo);
        return geoInfo;
      }
    }
  } catch (err) {
    // Geo fetch timed out or failed, fallback gracefully
  }

  const fallbackNepal = timezoneHint && timezoneHint.toLowerCase().includes('kathmandu');
  const fallbackGeo: ClickEvent['geo'] = {
    city: fallbackNepal ? 'Kathmandu' : 'Unknown City',
    region: fallbackNepal ? 'Bagmati' : 'Unknown Region',
    country: fallbackNepal ? 'Nepal' : 'Unknown',
    countryCode: fallbackNepal ? 'NP' : 'XX',
    isp: 'Client ISP',
    source: 'fallback',
  };
  return fallbackGeo;
}

// User-Agent parser for device, OS, browser
function parseUserAgent(ua = '', clientScreen = ''): ClickEvent['device'] {
  const lower = ua.toLowerCase();

  // Device type
  let type: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    type = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    type = 'Mobile';
  }

  // OS
  let os = 'Unknown OS';
  if (/iphone/i.test(ua)) os = 'iOS (iPhone)';
  else if (/ipad/i.test(ua)) os = 'iPadOS';
  else if (/android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9\.]+)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Unknown Browser';
  if (/edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';

  return {
    type,
    os,
    browser,
    screen: clientScreen || undefined,
  };
}

// Authentication Check Middleware
function isAuthorized(req: express.Request): boolean {
  // 1. Check Query parameter ?secret=... or ?key=...
  const querySecret = req.query.secret || req.query.key;
  if (querySecret === ADMIN_SECRET) return true;

  // 2. Check Authorization Header Bearer token
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (activeSessions.has(token) || token === ADMIN_SECRET) return true;
  }

  // 3. Check Cookie
  const cookies = parseCookies(req.headers['cookie']);
  const sessionToken = cookies['admin_session'];
  if (sessionToken && (activeSessions.has(sessionToken) || sessionToken === ADMIN_SECRET)) {
    return true;
  }

  return false;
}

// Express JSON body parser
app.use(express.json());

/* --------------------------------------------------------------------------
   PUBLIC TRACKING ENDPOINT (POST /api/track)
   - Zero permissions required (IP geo done server-side)
   - Does not expose any admin details or sensitive data
   -------------------------------------------------------------------------- */
app.post('/api/track', async (req, res) => {
  try {
    const { action, label, elementId, section, timezone, screen, metadata } = req.body || {};
    const ip = getClientIp(req);
    const ua = req.headers['user-agent'] || '';

    const geo = await resolveGeo(ip, timezone);
    const device = parseUserAgent(ua, screen);

    const now = new Date();
    const nepalTime = now.toLocaleString('en-US', {
      timeZone: 'Asia/Kathmandu',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const clickEvent: ClickEvent = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      nepalTime: `${nepalTime} (NPT)`,
      action: action || 'Button Click',
      label: label || 'Interactive Element',
      elementId: elementId || undefined,
      section: section || undefined,
      ip: ip.replace(/^::ffff:/, ''),
      geo,
      device,
      metadata: metadata || undefined,
    };

    // Store newest at the beginning
    events.unshift(clickEvent);

    // Keep max 2000 events to prevent memory bloating
    if (events.length > 2000) {
      events = events.slice(0, 2000);
    }

    saveEvents();

    // Silently return success to the public page (never expose logs or stats here)
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error tracking event:', err);
    return res.status(200).json({ success: true }); // Always return 200 to client
  }
});

/* --------------------------------------------------------------------------
   ADMIN AUTHENTICATION ENDPOINTS
   -------------------------------------------------------------------------- */
app.post('/api/admin/login', (req, res) => {
  const { email, secretKey } = req.body || {};

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanSecret = (secretKey || '').trim();

  const isEmailValid = AUTHORIZED_EMAILS.some(e => e.toLowerCase() === cleanEmail);
  const isSecretValid = cleanSecret === ADMIN_SECRET;

  if (isEmailValid && isSecretValid) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeSessions.add(sessionToken);

    res.setHeader(
      'Set-Cookie',
      `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
    );

    return res.status(200).json({
      success: true,
      token: sessionToken,
      email: 'gaihrenirmal2021@gmail.com',
      message: 'Access granted. Welcome Nirmal Gaihre!',
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Only accessible by Nirmal Gaihre (gaihrenirmal2021@gmail.com).',
  });
});

app.get('/api/admin/check-auth', (req, res) => {
  if (isAuthorized(req)) {
    return res.status(200).json({
      authenticated: true,
      email: 'gaihrenirmal2021@gmail.com',
    });
  }
  return res.status(200).json({ authenticated: false });
});

app.post('/api/admin/logout', (req, res) => {
  const cookies = parseCookies(req.headers['cookie']);
  const sessionToken = cookies['admin_session'];
  if (sessionToken) {
    activeSessions.delete(sessionToken);
  }
  res.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/* --------------------------------------------------------------------------
   ADMIN DATA ENDPOINTS (Protected)
   -------------------------------------------------------------------------- */
app.get('/api/admin/events', (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized. Secret key or session required.' });
  }

  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 500;
  return res.status(200).json({
    events: events.slice(0, limit),
    totalCount: events.length,
  });
});

app.get('/api/admin/stats', (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const totalClicks = events.length;
  const uniqueIps = new Set(events.map(e => e.ip)).size;

  // Action breakdown
  const actionCounts: Record<string, number> = {};
  events.forEach(e => {
    const key = e.label || e.action;
    actionCounts[key] = (actionCounts[key] || 0) + 1;
  });
  const topActions = Object.entries(actionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Device breakdown
  const deviceCounts: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
  events.forEach(e => {
    const type = e.device?.type || 'Desktop';
    deviceCounts[type] = (deviceCounts[type] || 0) + 1;
  });

  // OS breakdown
  const osCounts: Record<string, number> = {};
  events.forEach(e => {
    const os = e.device?.os || 'Unknown';
    osCounts[os] = (osCounts[os] || 0) + 1;
  });

  // Location breakdown
  const locationCounts: Record<string, number> = {};
  events.forEach(e => {
    const loc = e.geo?.city ? `${e.geo.city}, ${e.geo.countryCode}` : 'Unknown';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  return res.status(200).json({
    totalClicks,
    uniqueIps,
    topActions,
    deviceCounts,
    osCounts,
    locationCounts,
    latestClick: events[0] || null,
  });
});

app.delete('/api/admin/events', (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  events = [];
  saveEvents();
  return res.status(200).json({ success: true, message: 'All click tracking data cleared.' });
});

/* --------------------------------------------------------------------------
   ROUTE: /admin (Dashboard or direct secret auth)
   -------------------------------------------------------------------------- */
app.get(['/admin', '/admin/'], (req, res) => {
  const secret = req.query.secret || req.query.key;
  if (secret === ADMIN_SECRET) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeSessions.add(sessionToken);
    res.setHeader(
      'Set-Cookie',
      `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
    );
  }

  const adminHtmlPath = path.resolve(__dirname, 'admin.html');
  if (fs.existsSync(adminHtmlPath)) {
    return res.sendFile(adminHtmlPath);
  }
  return res.status(404).send('Admin dashboard template not found.');
});

/* --------------------------------------------------------------------------
   VITE DEV SERVER OR PRODUCTION STATIC SERVING
   -------------------------------------------------------------------------- */
async function startServer() {
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      if (url.startsWith('/admin')) {
        const adminHtml = fs.readFileSync(path.resolve(__dirname, 'admin.html'), 'utf-8');
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(adminHtml);
      }

      try {
        const indexHtmlPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexHtmlPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use('*', (req, res) => {
      const url = req.originalUrl;
      if (url.startsWith('/admin')) {
        return res.sendFile(path.resolve(__dirname, 'admin.html'));
      }
      return res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Admin panel available at http://0.0.0.0:${PORT}/admin`);
  });
}

startServer();
