import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log('DATABASE_URL defined:', !!connectionString);

  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    return;
  }

  try {
    const url = new URL(connectionString);
    console.log('URL Parse Success:');
    console.log('  Protocol:', url.protocol);
    console.log('  Hostname:', url.hostname);
    console.log('  Port:', url.port);
    console.log('  Username:', url.username);
    console.log('  Password length:', url.password ? url.password.length : 0);
    console.log('  Pathname:', url.pathname);
    console.log('  Search params:', url.search);

    console.log('\nInitializing PrismaClient...');
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    });

    try {
      console.log('Connecting Prisma...');
      await prisma.$connect();
      console.log('Prisma Connected successfully!');

      const count = await prisma.user.count();
      console.log('User count:', count);

      await prisma.$disconnect();
    } catch (e) {
      console.error('Prisma Connection failed:', e);
    }

  } catch (e) {
    console.error('URL Parse Failed:', e);
  }
}

main();
