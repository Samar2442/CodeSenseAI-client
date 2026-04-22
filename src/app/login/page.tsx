'use client';

import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Code2, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('tab') !== 'signup');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLogin(searchParams.get('tab') !== 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, name: form.name };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      localStorage.setItem('token', data.token || data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      window.dispatchEvent(new Event('auth-change'));
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: Code2, text: 'AI-powered code analysis in seconds' },
    { icon: ShieldCheck, text: 'Security vulnerability detection' },
    { icon: Zap, text: 'Performance optimization suggestions' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <Toaster position="top-center" toastOptions={{
        style: { background: 'rgba(13,13,20,0.98)', color: '#fff', border: '1px solid rgba(0,255,255,0.2)', backdropFilter: 'blur(20px)' },
        success: { iconTheme: { primary: '#00ff9f', secondary: '#000' } },
        error: { iconTheme: { primary: '#ff4444', secondary: '#000' } },
      }} />

      {/* BG orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(#00ffff, transparent)', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(#8b5cf6, transparent)', transform: 'translate(50%, 50%)' }} />

      <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden relative z-10"
        style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,255,255,0.04)' }}>

        {/* ===== LEFT PANEL ===== */}
        <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0d0d20, #0a0a18)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ background: '#8b5cf6' }} />

          <Link href="/" className="flex items-center gap-2 relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black"
              style={{ background: 'linear-gradient(135deg, #00ffff, #8b5cf6)', boxShadow: '0 0 20px rgba(0,255,255,0.3)' }}>C</div>
            <span className="font-black text-xl text-white">Code<span style={{ color: '#00ffff' }}>Sense</span></span>
          </Link>

          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight mb-3">
                Your code,<br /><span className="gradient-text">supercharged.</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                Join thousands of developers shipping cleaner, safer, faster code with AI assistance.
              </p>
            </div>
            <div className="space-y-4">
              {perks.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.2)' }}>
                      <Icon size={15} style={{ color: '#00ffff' }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#9ca3af' }}>{perk.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 text-xs font-semibold" style={{ color: '#4b5563' }}>
            © 2026 CodeSense AI
          </div>
        </div>

        {/* ===== RIGHT PANEL (FORM) ===== */}
        <div className="flex flex-col justify-center p-8 md:p-10" style={{ background: 'rgba(10,10,16,0.97)' }}>
          {/* Toggle Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-8 self-start" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {['Sign In', 'Sign Up'].map((label, i) => {
              const active = i === 0 ? isLogin : !isLogin;
              return (
                <button key={label} onClick={() => { setIsLogin(i === 0); setError(''); setForm({ name: '', email: '', password: '' }); }}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                  style={active ? { background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '1px solid rgba(0,255,255,0.2)' } : { color: '#6b7280' }}>
                  {label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 15 : -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="mb-6">
                <h1 className="text-2xl font-black text-white">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h1>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                  {isLogin ? 'Sign in to your dashboard' : 'Start analyzing code for free'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <label className="text-xs font-bold block mb-1.5" style={{ color: '#6b7280' }}>Full Name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="John Doe"
                      className="input-neon"
                      required={!isLogin}
                    />
                  </motion.div>
                )}

                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: '#6b7280' }}>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="input-neon"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: '#6b7280' }}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                      className="input-neon pr-10"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#4b5563' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-xs font-semibold transition-colors" style={{ color: '#6b7280' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00ffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                      Forgot password?
                    </a>
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-3 rounded-lg text-sm flex items-center gap-2"
                      style={{ background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff6666' }}>
                      ⚠️ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit" disabled={loading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    background: loading ? 'rgba(0,255,255,0.1)' : 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(139,92,246,0.2))',
                    border: '1px solid rgba(0,255,255,0.3)',
                    color: '#00ffff',
                    boxShadow: '0 0 20px rgba(0,255,255,0.1)',
                  }}
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-[#00ffff] animate-spin" />
                  ) : (
                    <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                  )}
                </motion.button>
              </form>

              <p className="text-xs text-center mt-6" style={{ color: '#6b7280' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="font-bold transition-colors" style={{ color: '#00ffff' }}>
                  {isLogin ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#00ffff' }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
