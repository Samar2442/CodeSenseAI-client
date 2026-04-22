'use client';

import { FileCode, ShieldCheck, Zap, Activity, Clock, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function DashboardPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    Promise.all([
      fetch('http://localhost:5000/api/history', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([historyData, userData]) => {
        setReviews(Array.isArray(historyData) ? historyData : []);
        setUserName(userData.name || userData.email?.split('@')[0] || 'Developer');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgScore = reviews.length > 0
    ? Math.round(reviews.reduce((a, r) => a + (r.score || 0), 0) / reviews.length)
    : 0;

  const totalIssues = reviews.reduce((a, r) => a + (r.issues?.length || 0), 0);

  const stats = [
    { label: 'Total Reviews', value: reviews.length, icon: FileCode, color: '#00ffff', bg: 'rgba(0,255,255,0.08)', border: 'rgba(0,255,255,0.2)', trend: '+' + reviews.length },
    { label: 'Avg Quality Score', value: avgScore > 0 ? `${avgScore}/100` : '—', icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', trend: avgScore > 70 ? 'Good' : avgScore > 0 ? 'Fair' : '—' },
    { label: 'Issues Detected', value: totalIssues, icon: AlertTriangle, color: '#ff00ff', bg: 'rgba(255,0,255,0.08)', border: 'rgba(255,0,255,0.2)', trend: 'Total' },
    { label: 'Clean Passes', value: reviews.filter(r => r.score >= 80).length, icon: CheckCircle2, color: '#00ff9f', bg: 'rgba(0,255,159,0.08)', border: 'rgba(0,255,159,0.2)', trend: 'Passes' },
  ];

  const SkeletonCard = () => (
    <div className="skeleton h-32 rounded-xl" />
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#00ff9f';
    if (score >= 60) return '#8b5cf6';
    if (score >= 40) return '#ff9600';
    return '#ff4444';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span style={{ color: '#00ffff' }}>{userName || '...'}</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Your AI-powered code intelligence dashboard
          </p>
        </div>
        <Link href="/dashboard/review">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
          >
            <FileCode size={16} /> New Review
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i} {...fadeUp(i * 0.08)}
                className="p-5 rounded-xl flex flex-col gap-3 group cursor-default transition-all duration-300"
                style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
                whileHover={{ y: -3, boxShadow: `0 10px 30px ${stat.color}20` }}
              >
                <div className="flex items-center justify-between">
                  <Icon size={18} style={{ color: stat.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${stat.color}15`, color: stat.color }}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Score bar for avg */}
      {avgScore > 0 && (
        <motion.div {...fadeUp(0.3)} className="glass p-5 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Zap size={14} style={{ color: '#00ffff' }} /> Overall Code Health
            </span>
            <span className="text-sm font-black" style={{ color: getScoreColor(avgScore) }}>{avgScore}/100</span>
          </div>
          <div className="h-2 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${avgScore}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${getScoreColor(avgScore)}, ${getScoreColor(avgScore)}88)`, boxShadow: `0 0 10px ${getScoreColor(avgScore)}60` }}
            />
          </div>
        </motion.div>
      )}

      {/* Recent Reviews + Credits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <motion.div {...fadeUp(0.2)} className="lg:col-span-2 glass rounded-xl overflow-hidden">
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity size={16} style={{ color: '#00ffff' }} /> Recent Reviews
            </h3>
            <Link href="/dashboard/history" className="text-xs font-semibold transition-colors" style={{ color: '#00ffff' }}>
              View all →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-2 w-20 rounded" />
                  </div>
                </div>
              ))
            ) : reviews.length === 0 ? (
              <div className="p-12 text-center">
                <FileCode size={32} className="mx-auto mb-3 opacity-20" style={{ color: '#00ffff' }} />
                <p className="text-sm font-semibold" style={{ color: '#6b7280' }}>No reviews yet</p>
                <p className="text-xs mt-1" style={{ color: '#4b5563' }}>Paste your code to get started</p>
              </div>
            ) : (
              reviews.slice(0, 6).map((review, i) => (
                <Link key={review.id} href={`/dashboard/history`}>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="p-4 flex items-center justify-between group cursor-pointer transition-colors"
                    whileHover={{ backgroundColor: 'rgba(0,255,255,0.02)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black"
                        style={{ background: `${getScoreColor(review.score || 0)}15`, color: getScoreColor(review.score || 0), border: `1px solid ${getScoreColor(review.score || 0)}30` }}
                      >
                        {review.score || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-[#00ffff] transition-colors">
                          {review.language?.toUpperCase() || 'CODE'} Review
                        </div>
                        <div className="text-[11px]" style={{ color: '#6b7280' }}>
                          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={review.score >= 80 ? 'badge-low' : review.score >= 60 ? 'badge-medium' : 'badge-high'}>
                        {review.score >= 80 ? 'PASS' : review.score >= 60 ? 'WARN' : 'FAIL'}
                      </span>
                      <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Side Panel */}
        <motion.div {...fadeUp(0.35)} className="space-y-4">
          {/* Credits Card */}
          <div className="glass p-5 rounded-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Clock size={14} style={{ color: '#8b5cf6' }} /> Usage Credits
            </h4>
            <div className="flex justify-between text-xs mb-2" style={{ color: '#6b7280' }}>
              <span>Remaining</span>
              <span className="font-bold text-white">850 / 1000</span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full w-[85%]" style={{ background: 'linear-gradient(90deg, #8b5cf6, #00ffff)', boxShadow: '0 0 8px rgba(139,92,246,0.5)' }} />
            </div>
            <p className="text-[10px] mt-2" style={{ color: '#4b5563' }}>Credits reset in 12 days</p>
            <button
              className="w-full mt-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
              style={{ border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6', background: 'rgba(139,92,246,0.05)' }}
            >
              Upgrade to Pro ↗
            </button>
          </div>

          {/* Quick actions */}
          <div className="glass p-5 rounded-xl space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">Quick Actions</h4>
            {[
              { label: 'New Code Review', icon: FileCode, href: '/dashboard/review', color: '#00ffff' },
              { label: 'View Analytics', icon: Activity, href: '/dashboard/analytics', color: '#8b5cf6' },
              { label: 'Review History', icon: Clock, href: '/dashboard/history', color: '#00ff9f' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${action.color}30`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    <Icon size={15} style={{ color: action.color }} />
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">{action.label}</span>
                    <ChevronRight size={12} className="ml-auto text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
