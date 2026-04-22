'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, AlertTriangle, Zap, ShieldAlert, Lightbulb, Search, Filter, FileCode } from 'lucide-react';
import Link from 'next/link';

const getScoreColor = (s: number) => s >= 80 ? '#00ff9f' : s >= 60 ? '#8b5cf6' : s >= 40 ? '#ff9600' : '#ff4444';

export default function HistoryPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5000/api/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter(r => {
    const matchSearch = search === '' || r.language?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'pass' && r.score >= 80) || (filter === 'warn' && r.score >= 60 && r.score < 80) || (filter === 'fail' && r.score < 60);
    return matchSearch && matchFilter;
  });

  const Skeleton = () => (
    <div className="p-5 rounded-xl space-y-3" style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0d0d16' }}>
      <div className="flex gap-4">
        <div className="skeleton w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-40 rounded" />
          <div className="skeleton h-2 w-24 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Review History</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{reviews.length} total analyses</p>
        </div>
        <Link href="/dashboard/review">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-neon px-4 py-2.5 text-sm font-bold flex items-center gap-2">
            <FileCode size={15} /> New Review
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by language..."
            className="input-neon pl-9 py-2.5 text-sm w-full"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'pass', label: '✅ Pass' },
            { id: 'warn', label: '⚠️ Warn' },
            { id: 'fail', label: '❌ Fail' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
              style={filter === f.id
                ? { background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '1px solid rgba(0,255,255,0.25)' }
                : { background: 'rgba(255,255,255,0.03)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.06)' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          Array(5).fill(0).map((_, i) => <Skeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.06)' }}>
            <History size={32} className="mx-auto mb-3 opacity-20" style={{ color: '#00ffff' }} />
            <div className="font-bold text-white">No reviews found</div>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
              {search || filter !== 'all' ? 'Try adjusting your filters.' : 'Submit your first code review to get started.'}
            </p>
          </div>
        ) : (
          filtered.map((review, i) => {
            const issueCount = review.issues?.length || 0;
            const color = getScoreColor(review.score);
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-5 rounded-xl flex items-start gap-4 group cursor-pointer transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0d0d1680' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                {/* Score Badge */}
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0"
                  style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                  <span className="text-xl font-black" style={{ color }}>{review.score}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: `${color}99` }}>/100</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-black text-white">{review.language?.toUpperCase() || 'CODE'}</span>
                    <span className={review.score >= 80 ? 'badge-low' : review.score >= 60 ? 'badge-medium' : 'badge-high'}>
                      {review.score >= 80 ? 'PASS' : review.score >= 60 ? 'WARN' : 'FAIL'}
                    </span>
                    {issueCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,68,68,0.08)', color: '#ff6666', border: '1px solid rgba(255,68,68,0.15)' }}>
                        {issueCount} issue{issueCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: '#6b7280' }}>
                    {new Date(review.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* Issue chips */}
                  {review.issues && review.issues.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {review.issues.slice(0, 3).map((issue: any, j: number) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#9ca3af' }}>
                          {issue.type} · {issue.severity}
                        </span>
                      ))}
                      {review.issues.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: '#6b7280' }}>+{review.issues.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Score Bar */}
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 w-24">
                  <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full" style={{ width: `${review.score}%`, background: color, boxShadow: `0 0 6px ${color}80` }} />
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: '#4b5563' }}>
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
