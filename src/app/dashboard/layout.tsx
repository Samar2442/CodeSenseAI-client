'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);
  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto relative h-full">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-40">
           <h2 className="font-semibold text-lg">Dashboard</h2>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                 <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                 PRO PLAN
              </div>
              <div className="w-8 h-8 rounded-full bg-muted border border-border"></div>
           </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
