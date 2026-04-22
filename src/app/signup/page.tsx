'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /signup to the unified /login?tab=signup page
export default function SignupRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/login?tab=signup'); }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#00ffff', fontFamily: 'Inter, sans-serif' }}>
      <div className="text-sm opacity-60">Redirecting...</div>
    </div>
  );
}
