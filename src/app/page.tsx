'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Code2, ShieldCheck, Zap, BarChart2, GitBranch, Bot, ChevronRight, Terminal, Star } from 'lucide-react';

const NAV_LINKS = ['Features', 'Pricing', 'Docs', 'Blog'];

const FEATURES = [
  { icon: Bot, title: 'AI Code Review', desc: 'Deep analysis using LLMs to detect bugs, security holes, and code smells in seconds.', color: '#00ffff', glow: '0 0 30px rgba(0,255,255,0.15)' },
  { icon: ShieldCheck, title: 'Security Scanner', desc: 'Detect SQL injections, XSS, sensitive data exposure, and OWASP top-10 vulnerabilities.', color: '#8b5cf6', glow: '0 0 30px rgba(139,92,246,0.15)' },
  { icon: Zap, title: 'Optimization Engine', desc: 'Get complexity analysis with O(n) suggestions and ready-to-use refactored snippets.', color: '#00ff9f', glow: '0 0 30px rgba(0,255,159,0.15)' },
  { icon: BarChart2, title: 'Analytics Dashboard', desc: 'Track code quality trends, issue distributions, and team performance over time.', color: '#ff00ff', glow: '0 0 30px rgba(255,0,255,0.15)' },
  { icon: GitBranch, title: 'Language Detection', desc: 'Auto-detect 10+ programming languages and apply language-specific best practices.', color: '#00ffff', glow: '0 0 30px rgba(0,255,255,0.15)' },
  { icon: Terminal, title: 'Monaco Editor', desc: 'Full VS Code-style editor experience with syntax highlighting directly in the browser.', color: '#8b5cf6', glow: '0 0 30px rgba(139,92,246,0.15)' },
];

const STATS = [
  { value: '10M+', label: 'Lines reviewed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<200ms', label: 'Avg response' },
  { value: '50+', label: 'Languages' },
];

const CODE_DEMO = `// 🔍 CodeSense AI detected 3 issues
function fetchUser(id) {
  // ⚠️ SQL Injection Risk
  const q = "SELECT * FROM users WHERE id=" + id;
  
  // ❌ No error handling
  const result = db.query(q);
  
  // 🔄 Optimization: Use prepared stmt
  return result[0];
}

// ✅ AI Optimized Version:
async function fetchUser(id: number) {
  const user = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  if (!user) throw new Error('Not found');
  return user;
}`;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const text = 'Analyze. Optimize. Ship.';
    let i = 0;
    const interval = setInterval(() => {
      setTyped(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      {/* =========== NAVBAR =========== */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm"
            style={{ background: 'linear-gradient(135deg, #00ffff, #8b5cf6)', boxShadow: '0 0 15px rgba(0,255,255,0.3)' }}>C</div>
          <span className="font-black text-lg tracking-tight text-white">Code<span style={{ color: '#00ffff' }}>Sense</span> <span style={{ color: '#8b5cf6', fontSize: '0.7em' }}>AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="text-sm font-semibold transition-colors" style={{ color: '#6b7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="text-sm font-bold px-4 py-2 rounded-lg transition-all" style={{ color: '#9ca3af' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
              Sign in
            </button>
          </Link>
          <Link href="/login?tab=signup">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-neon px-4 py-2 text-sm font-bold">
              Get Started →
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* =========== HERO =========== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#00ffff', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: '#8b5cf6', animation: 'float 10s ease-in-out infinite reverse' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            style={{ background: 'rgba(0,255,255,0.07)', border: '1px solid rgba(0,255,255,0.2)', color: '#00ffff' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
            AI-Powered Code Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
            <span className="text-white">Ship Better</span><br />
            <span className="gradient-text">Code Faster</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#9ca3af' }}>
            CodeSense AI analyzes your code for <strong style={{ color: '#fff' }}>bugs</strong>, <strong style={{ color: '#fff' }}>vulnerabilities</strong>, and <strong style={{ color: '#fff' }}>performance issues</strong> in milliseconds using state-of-the-art LLMs.
          </p>

          {/* Typewriter */}
          <div className="font-mono text-sm h-6" style={{ color: '#00ffff' }}>
            {'>'} {typed}<span className="animate-pulse">_</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/login?tab=signup">
              <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0,255,255,0.4)' }} whileTap={{ scale: 0.97 }}
                className="btn-solid px-8 py-4 font-black text-base flex items-center gap-2">
                Start Free Analysis <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link href="/login">
              <button className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}>
                Sign In
              </button>
            </Link>
          </div>

          {/* Stars */}
          <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#6b7280' }}>
            <div className="flex gap-0.5">{Array(5).fill(0).map((_, i) => <Star key={i} size={12} fill="#ff9600" stroke="none" />)}</div>
            <span>Trusted by 5,000+ developers worldwide</span>
          </div>
        </motion.div>

        {/* Code Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-16 w-full max-w-2xl rounded-2xl overflow-hidden relative z-10 text-left"
          style={{ border: '1px solid rgba(0,255,255,0.15)', background: '#0d0d16', boxShadow: '0 0 60px rgba(0,255,255,0.08), 0 40px 80px rgba(0,0,0,0.8)' }}
        >
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
            <span className="text-xs ml-2 font-mono" style={{ color: '#6b7280' }}>auth_service.js — CodeSense AI Analysis</span>
          </div>
          <pre className="p-5 text-xs leading-relaxed overflow-x-auto font-mono" style={{ color: '#9ca3af', maxHeight: '300px' }}>
            <code>{CODE_DEMO}</code>
          </pre>
        </motion.div>
      </section>

      {/* =========== STATS =========== */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="text-3xl font-black gradient-text-cyan">{s.value}</div>
              <div className="text-xs mt-1 font-semibold" style={{ color: '#6b7280' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========== FEATURES =========== */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: '#00ffff' }}>Core Features</div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Everything you need to<br /><span className="gradient-text">write perfect code</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl group cursor-default transition-all duration-300 relative overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,13,20,0.6)' }}
                  whileHover={{ y: -4, boxShadow: f.glow, borderColor: `${f.color}30` }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-base font-black text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========== CTA =========== */}
      <section className="py-24 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Ready to write<br /><span className="gradient-text">flawless code?</span>
          </h2>
          <p className="text-lg" style={{ color: '#6b7280' }}>
            Join thousands of developers shipping cleaner, faster, safer code with CodeSense AI.
          </p>
          <Link href="/login?tab=signup">
            <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,255,255,0.4)' }} whileTap={{ scale: 0.97 }}
              className="btn-solid px-10 py-5 text-lg font-black flex items-center gap-2 mx-auto">
              Start for Free <ChevronRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* =========== FOOTER =========== */}
      <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs"
              style={{ background: 'linear-gradient(135deg, #00ffff, #8b5cf6)' }}>C</div>
            <span className="font-black text-white">CodeSense <span style={{ color: '#00ffff' }}>AI</span></span>
          </Link>
          <div className="flex items-center gap-6">
            {['Twitter', 'GitHub', 'Discord', 'Docs'].map(l => (
              <a key={l} href="#" className="text-xs font-semibold transition-colors" style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                {l}
              </a>
            ))}
          </div>
          <p className="text-xs" style={{ color: '#4b5563' }}>© 2026 CodeSense AI · All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
