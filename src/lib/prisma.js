import { PrismaClient } from '@prisma/client';

const databaseUrl =
  process.env.DATABASE_URL ??
  `postgresql://${process.env.DB_USER ?? 'root'}:${process.env.DB_PASSWORD ?? 'rootpassword'}@${process.env.DB_HOST ?? 'localhost'}:${process.env.DB_PORT ?? '5432'}/${process.env.DB_NAME ?? 'marketplace'}?schema=public`;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
