/**
 * Sign In Page
 */

import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth';
import SignInClient from './signin-client';

export default async function SignInPage() {
  const auth = await verifyAuth();

  // Redirect if already authenticated
  if (auth) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <SignInClient />
    </div>
  );
}
