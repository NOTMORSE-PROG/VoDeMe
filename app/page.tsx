/**
 * Home Page - Entry Point
 * Redirects authenticated users to dashboard, shows home page to guests
 */

import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth';
import Home from '@/components/home';

export default async function HomePage() {
  const auth = await verifyAuth();

  // Redirect authenticated users to dashboard
  if (auth) {
    redirect('/dashboard');
  }

  // Show home page to guests
  return <Home />;
}
