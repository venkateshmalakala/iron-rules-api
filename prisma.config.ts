import 'dotenv/config'; 
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Add this line to tell Prisma how to run your seed file
    seed: 'psql -U user -d fitness -h db -f prisma/seed.sql',
  },
  datasource: {
    /**
     * Fallback Logic:
     * During 'docker build', env('DATABASE_URL') is undefined, which crashes 'prisma generate'.
     * The fallback string allows the build to complete. 
     * At runtime (docker-compose up), the real URL from your .env will override this.
     */
    url: env('DATABASE_URL') || "postgresql://user:password@localhost:5432/fitness?schema=public",
  },
});