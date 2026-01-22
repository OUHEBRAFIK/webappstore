import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Configuration spécifique pour que Neon fonctionne sur Vercel
export const db = drizzle({
  connection: process.env.DATABASE_URL,
  schema,
  ws: ws
});