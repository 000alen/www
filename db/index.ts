import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';

export const db = drizzle<typeof schema>(process.env.POSTGRES_URL!);
