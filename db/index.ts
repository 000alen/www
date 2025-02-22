import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';
import * as authSchema from '@/db/auth-schema';

export const db = drizzle<typeof schema & typeof authSchema>(process.env.POSTGRES_URL!);
