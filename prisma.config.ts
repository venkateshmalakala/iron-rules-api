import 'dotenv/config'; 
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Added -U user to fix the "root" authentication error
seed: 'psql -h db -U user -d fitness -f prisma/seed.sql'  },
  datasource: {
    url: env('DATABASE_URL') || "postgresql://user:password@localhost:5432/fitness?schema=public",
  },
});