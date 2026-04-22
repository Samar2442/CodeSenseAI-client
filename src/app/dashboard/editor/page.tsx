'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard/review'); }, [router]);
  return (
    <div className="text-sm opacity-40 p-8" style={{ color: '#00ffff' }}>Redirecting to Code Review...</div>
  );
}
