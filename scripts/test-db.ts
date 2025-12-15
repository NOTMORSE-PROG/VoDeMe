import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Testing connection with URL:', connectionString ? 'Defined' : 'Undefined');

  if (!connectionString) {
    console.error('DATABASE_URL is missing!');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Successfully connected to database!');
    
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

main();
