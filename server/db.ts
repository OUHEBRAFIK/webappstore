import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema.js';

// Configuration pour Vercel / Serverless
if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = ws;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Utilisation d'un "Pool" de connexion (indispensable pour ton lien -pooler)
const connectionPool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(connectionPool, { schema });
