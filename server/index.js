import express from 'express';
import { createServer } from 'node:http';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import MemoryStore from 'memorystore';
import { neon } from '@neondatabase/serverless';
import setupVite from './vite.js';
import routes from './routes.js';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-for-sessions',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

if (process.env.DATABASE_URL) {
  const PgSession = connectPgSimple(session);
  const sql = neon(process.env.DATABASE_URL);
  sessionConfig.store = new PgSession({
    createTableIfMissing: true,
    conObject: {
      connectionString: process.env.DATABASE_URL,
    },
  });
} else {
  const MemStore = MemoryStore(session);
  sessionConfig.store = new MemStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  });
}

app.use(session(sessionConfig));

// API routes
app.use('/api', routes);

// Development mode
if (process.env.NODE_ENV === 'development') {
  await setupVite(app, server);
} else {
  app.use(express.static('dist/public'));
  app.get('*', (req, res) => {
    res.sendFile(new URL('../dist/public/index.html', import.meta.url).pathname);
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});