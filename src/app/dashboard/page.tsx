'use client';

import { FileCode, ShieldCheck, Zap, Activity, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/history', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           setRecentReviews(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const avgScore = recentReviews.length > 0 
    ? Math.round(recentReviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / recentReviews.length)
    : 0;

  const stats = [
    { label: 'Total Reviews', value: recentReviews.length.toString(), icon: <FileCode className="text-primary" />, trend: 'Lifetime' },
    { label: 'Average Score', value: avgScore > 0 ? avgScore.toString() : '-', icon: <ShieldCheck className="text-accent" />, trend: 'Health' },
    { label: 'Optimizations', value: recentReviews.length * 3 + '', icon: <Zap className="text-secondary" />, trend: 'AI Metrics' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your code today.</p>
        </div>
        <Link href="/dashboard/upload" className="btn-neon flex items-center justify-center gap-2 px-6 py-3">
           <FileCode size={20} />
           New Code Review
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 group hover:border-primary/50 transition-all flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between mb-2">
               <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  {stat.icon}
               </div>
               <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap">
                  {stat.trend}
               </span>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
             <h3 className="font-bold flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Recent Reviews
             </h3>
             <Link href="/dashboard/history" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-white/5 flex-1 overflow-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Loading history...</div>
            ) : recentReviews.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No recent code reviews found. Try uploading one!</div>
            ) : (
              recentReviews.map((review) => (
                <div key={review.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded bg-white/5 flex items-center justify-center text-xs font-bold ${review.score > 80 ? 'text-primary' : 'text-accent'}`}>
                        {review.score || '-'}
                     </div>
                     <div>
                        <div className="font-medium group-hover:text-primary transition-colors">Review #{review.id.slice(-6)}</div>
                        <div className="text-xs text-muted-foreground uppercase">{review.language} • {new Date(review.createdAt).toLocaleDateString()}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-primary/20 text-primary bg-primary/5`}>
                        {review.score > 80 ? 'PASS' : 'WARN'}
                     </span>
                     <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass p-6 space-y-6">
           <h3 className="font-bold flex items-center gap-2">
              <Clock size={18} className="text-secondary" />
              Usage Credits
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                 <span className="text-muted-foreground">Credits Remaining</span>
                 <span className="font-bold">850 / 1000</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-secondary w-[85%] shadow-[0_0_10px_rgba(112,0,255,0.5)]"></div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                 Your credits will reset in 12 days.
              </p>
              <button className="w-full py-2 rounded-lg border border-secondary/50 text-secondary text-sm font-bold hover:bg-secondary/10 transition-all">
                 Upgrade to Pro
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
