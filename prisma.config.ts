import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Ensure this matches your .env variable name exactly
    url: process.env.DATABASE_URL,
  },
});