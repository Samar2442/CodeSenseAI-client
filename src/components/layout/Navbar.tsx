'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    checkAuth();
    
    // Listen for custom auth events from login/logout actions
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass fixed top-6 inset-x-4 md:inset-x-10 max-w-7xl mx-auto z-[200] flex items-center justify-between px-6 py-4"
    >
      <Link href="/" className="flex items-center gap-4 group cursor-pointer no-underline">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 neon-border flex items-center justify-center font-black text-white text-2xl transition-transform group-hover:rotate-12 shadow-lg shadow-cyan-500/20">
          C
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">
          odeSense <span className="gradient-text italic">AI</span>
        </span>
      </Link>
      
      <div className="hidden lg:flex items-center gap-12 text-sm font-bold text-muted-foreground uppercase tracking-widest">
        {['Features', 'Pricing', 'Docs'].map((item) => (
          <Link 
            key={item} 
            href={`#${item.toLowerCase()}`} 
            className="hover:text-primary transition-all hover:scale-110"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {isClient && isLoggedIn ? (
          <>
            <Link href="/dashboard" className="hidden sm:block text-sm font-black hover:text-primary transition-colors uppercase tracking-widest">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-neon !py-3 !px-8 text-sm uppercase tracking-widest">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hidden sm:block text-sm font-black hover:text-primary transition-colors uppercase tracking-widest">
              Login
            </Link>
            <Link href="/login?tab=signup" className="btn-neon !py-3 !px-8 text-sm uppercase tracking-widest">
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
