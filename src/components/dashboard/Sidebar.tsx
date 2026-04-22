'use client';
import { LayoutDashboard, FileCode, History, Settings, BarChart2, LogOut, Menu, X, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', color: '#00ffff' },
  { icon: FileCode, label: 'Review', href: '/dashboard/review', color: '#8b5cf6' },
  { icon: History, label: 'History', href: '/dashboard/history', color: '#00ff9f' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics', color: '#ff00ff' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', color: '#00ffff' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`p-4 flex items-center gap-3 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black text-base shrink-0 relative"
          style={{ background: 'linear-gradient(135deg, #00ffff, #8b5cf6)', boxShadow: '0 0 20px rgba(0,255,255,0.4)' }}
        >
          C
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0a0a0a] animate-pulse" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <span className="font-black text-lg tracking-tight text-white">
                Code<span style={{ color: '#00ffff' }}>Sense</span>
              </span>
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: '#8b5cf6' }}>AI Platform</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group cursor-pointer ${collapsed ? 'justify-center' : ''}`}
                style={isActive ? {
                  background: `rgba(${item.color === '#00ffff' ? '0,255,255' : item.color === '#8b5cf6' ? '139,92,246' : item.color === '#00ff9f' ? '0,255,159' : '255,0,255'},0.1)`,
                  border: `1px solid ${item.color}30`,
                  boxShadow: `0 0 15px ${item.color}15`,
                } : {
                  border: '1px solid transparent',
                }}
                whileHover={{ x: collapsed ? 0 : 3 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                  />
                )}
                <Icon
                  size={18}
                  style={{ color: isActive ? item.color : '#6b7280', transition: 'color 0.2s' }}
                  className="shrink-0 group-hover:text-white"
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className={`text-sm font-semibold flex-1 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && isActive && <ChevronRight size={14} style={{ color: item.color }} />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Action */}
      {!collapsed && (
        <div className="mx-3 mb-3">
          <Link href="/dashboard/review">
            <div
              className="p-3 rounded-xl border cursor-pointer transition-all duration-200 group"
              style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.15)' }}
            >
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: '#00ffff' }} />
                <span className="text-xs font-bold text-white">New Review</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-1">Analyze your code with AI</div>
            </div>
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all duration-200 group text-gray-500 hover:text-red-400 ${collapsed ? 'justify-center' : ''}`}
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,68,68,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen relative z-50 shrink-0"
        style={{
          background: 'rgba(8, 8, 16, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 z-50 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(0,255,255,0.3)',
            color: '#00ffff',
            boxShadow: '0 0 10px rgba(0,255,255,0.2)',
          }}
        >
          <ChevronRight size={12} style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
        </button>
        <SidebarContent />
      </motion.aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-[70] w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.2)', color: '#00ffff' }}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-[65] w-[220px]"
              style={{
                background: 'rgba(8,8,16,0.98)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
