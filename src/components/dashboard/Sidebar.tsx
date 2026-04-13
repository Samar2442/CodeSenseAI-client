'use client';
import { LayoutDashboard, FileCode, History, Settings, Users, CreditCard, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Home', href: '/dashboard' },
    { icon: <FileCode size={20} />, label: 'Review', href: '/dashboard/review' },
    { icon: <History size={20} />, label: 'History', href: '/dashboard/history' },
    { icon: <Users size={20} />, label: 'Team', href: '/dashboard/team' },
    { icon: <CreditCard size={20} />, label: 'Billing', href: '/dashboard/billing' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden glass p-2"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <motion.aside 
        initial={false}
        animate={{ width: isOpen ? 260 : 0, opacity: isOpen ? 1 : 0 }}
        className="h-screen glass border-r border-white/5 flex flex-col relative z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary neon-border flex items-center justify-center font-bold text-black shrink-0">
            C
          </div>
          <span className="font-bold text-xl tracking-tight whitespace-nowrap">CodeSense <span className="text-primary italic">AI</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                pathname === item.href 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <span className={`${pathname === item.href ? 'text-primary' : 'group-hover:text-primary transition-colors'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
