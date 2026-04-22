'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // Fetch user info
    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setUserName(d.name || d.email?.split('@')[0] || 'User'))
      .catch(() => {});
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13,13,20,0.95)',
            color: '#fff',
            border: '1px solid rgba(0,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#00ff9f', secondary: '#000' } },
          error: { iconTheme: { primary: '#ff4444', secondary: '#000' } },
        }}
      />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Top Header */}
        <header
          className="h-14 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0"
          style={{
            background: 'rgba(10,10,10,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500">System Online</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.06)', color: '#6b7280' }}
            >
              <Bell size={15} />
            </button>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
              style={{ border: '1px solid rgba(0,255,255,0.15)', background: 'rgba(0,255,255,0.05)' }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black"
                style={{ background: 'linear-gradient(135deg, #00ffff, #8b5cf6)', color: '#000' }}
              >
                {userName.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-semibold text-white hidden sm:block">{userName || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
