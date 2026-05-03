'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Code2, ShieldCheck, Zap, BarChart2, GitBranch, Bot, ChevronRight, Terminal, Star, CheckCircle } from 'lucide-react';

// Lazy load the 3D background to keep initial JS bundle small and improve time-to-interactive
const ParticleBackground = dynamic(() => import('../components/ui/ParticleBackground'), { ssr: false });

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
  { value: '<50ms', label: 'Inference Speed' },
  { value: '50+', label: 'Languages Supported' },
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
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

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
    <div className="bg-[#09090b] text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <ParticleBackground />

      {/* =========== NAVBAR =========== */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-20"
        style={{
          background: scrolled ? 'rgba(9, 9, 11, 0.7)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-lg bg-gradient-to-br from-cyan-400 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            C
          </div>
          <span className="font-black text-xl tracking-tight text-white">Code<span className="text-cyan-400">Sense</span> <span className="text-purple-500 text-sm">AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-200">
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Sign in
            </button>
          </Link>
          <Link href="/login?tab=signup">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 text-sm font-bold rounded-lg bg-white text-black hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Get Started →
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* =========== HERO =========== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative z-10">
        <motion.div style={{ y }} className="space-y-8 max-w-5xl mx-auto flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]" />
            CodeSense 2.0 is now live
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Autonomous</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Code Intelligence</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-400 font-medium">
            Stop reviewing code manually. Our AI builds a semantic whole-repo graph to detect bugs, auto-fix PRs, and map out cognitive complexity in milliseconds.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
            <Link href="/login?tab=signup">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(34,211,238,0.5)' }} whileTap={{ scale: 0.95 }}
                className="px-8 py-4 font-black text-lg rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center gap-2 border border-cyan-400/30">
                Start Free Analysis <ChevronRight size={20} />
              </motion.button>
            </Link>
            <Link href="/demo">
              <button className="px-8 py-4 rounded-xl font-bold text-lg border border-gray-700 bg-gray-900/50 backdrop-blur-sm text-gray-300 hover:text-white hover:border-gray-500 transition-all">
                View Interactive Demo
              </button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 pt-8">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-cyan-500"/> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-cyan-500"/> 14-day Enterprise trial</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-cyan-500"/> Zero-trust sandbox</span>
          </motion.div>
        </motion.div>

        {/* Code Demo Card - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-20 w-full max-w-4xl rounded-2xl overflow-hidden relative z-10 text-left border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_60px_rgba(34,211,238,0.1)]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm ml-4 font-mono text-gray-400">auth_controller.ts — CodeSense AI</span>
            </div>
            <div className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded bg-cyan-500/10">
              {typed}<span className="animate-pulse">_</span>
            </div>
          </div>
          <pre className="p-8 text-sm leading-relaxed overflow-x-auto font-mono text-gray-300">
            <code>{CODE_DEMO}</code>
          </pre>
        </motion.div>
      </section>

      {/* =========== STATS =========== */}
      <section className="py-20 px-6 relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-colors">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{s.value}</div>
              <div className="text-sm mt-3 font-semibold text-gray-400 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========== FEATURES =========== */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="text-sm font-black tracking-widest uppercase mb-4 text-cyan-400">Enterprise Grade Features</div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              A paradigm shift in<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Developer Experience</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl relative overflow-hidden border border-white/5 bg-[#0d0d14]/80 backdrop-blur-xl group hover:border-cyan-500/30 transition-all duration-500"
                  whileHover={{ y: -5, boxShadow: f.glow }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                    <Icon size={28} className="text-gray-300 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">{f.title}</h3>
                  <p className="text-base leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========== CTA =========== */}
      <section className="py-32 px-6 relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-black/80 pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Stop debugging.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Start shipping.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join the top 1% of engineering teams that use CodeSense AI to completely automate their code reviews and tech debt resolution.
          </p>
          <Link href="/login?tab=signup">
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(34,211,238,0.6)' }} whileTap={{ scale: 0.95 }}
              className="px-12 py-6 text-xl font-black rounded-xl bg-white text-black flex items-center gap-3 mx-auto border border-white/20">
              Deploy Your AI Co-Pilot <ChevronRight size={24} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* =========== FOOTER =========== */}
      <footer className="py-12 px-6 relative z-10 border-t border-white/5 bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm bg-gradient-to-br from-cyan-400 to-purple-600">C</div>
            <span className="font-black text-white text-lg">CodeSense <span className="text-cyan-400">AI</span></span>
          </Link>
          <div className="flex items-center gap-8">
            {['Twitter', 'GitHub', 'Discord', 'Docs'].map(l => (
              <a key={l} href="#" className="text-sm font-semibold text-gray-500 hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-600">© 2026 CodeSense AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
