'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, AlertTriangle, CheckCircle2, Code2, Zap, ShieldAlert } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = { low: '#00ff9f', medium: '#8b5cf6', high: '#ff9600', critical: '#ff4444' };
const CHART_COLORS = ['#00ffff', '#8b5cf6', '#00ff9f', '#ff00ff', '#ff9600', '#ff4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(13,13,20,0.98)', border: '1px solid rgba(0,255,255,0.2)', color: '#fff' }}>
        <p className="font-bold mb-1" style={{ color: '#00ffff' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5000/api/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const Skeleton = ({ h = 'h-48' }: { h?: string }) => (
    <div className={`skeleton ${h} rounded-xl`} />
  );

  if (loading) return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48 rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} h="h-24" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{Array(4).fill(0).map((_, i) => <Skeleton key={i} />)}</div>
    </div>
  );

  if (!data || data.totalReviews === 0) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Analytics</h1>
      <div className="py-24 text-center rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.06)' }}>
        <BarChart2 size={40} className="mx-auto mb-4 opacity-20" style={{ color: '#8b5cf6' }} />
        <div className="font-bold text-white text-lg">No data yet</div>
        <p className="text-sm mt-2" style={{ color: '#6b7280' }}>Submit code reviews to see analytics here.</p>
      </div>
    </div>
  );

  const scoreHistory = (data.scoreHistory || []).map((d: any) => ({ date: d.date, Score: d.score }));
  const severityData = Object.entries(data.severityDistribution || {})
    .filter(([, v]: any) => v > 0)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  const langData = Object.entries(data.languageDistribution || {}).map(([name, value]) => ({ name, value }));

  const statCards = [
    { label: 'Total Reviews', value: data.totalReviews, icon: Code2, color: '#00ffff' },
    { label: 'Avg Score', value: `${Math.round(data.avgScore)}/100`, icon: TrendingUp, color: '#8b5cf6' },
    { label: 'Issues Found', value: data.issuesFound, icon: AlertTriangle, color: '#ff9600' },
    { label: 'Pass Rate', value: `${Math.round((data.scoreHistory?.filter((s: any) => s.score >= 80).length / (data.scoreHistory?.length || 1)) * 100)}%`, icon: CheckCircle2, color: '#00ff9f' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Code quality insights and trends</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="p-4 rounded-xl" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
              <Icon size={16} style={{ color: s.color }} className="mb-3" />
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Over Time */}
        {scoreHistory.length > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={14} style={{ color: '#00ffff' }} /> Score Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Score" stroke="#00ffff" strokeWidth={2} dot={{ fill: '#00ffff', r: 3 }} activeDot={{ r: 5, fill: '#00ffff', boxShadow: '0 0 8px #00ffff' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Severity Distribution */}
        {severityData.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="glass p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert size={14} style={{ color: '#ff9600' }} /> Issue Severity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {severityData.map((entry: any, index: number) => (
                    <Cell key={index} fill={(COLORS as any)[entry.name.toLowerCase()] || CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Language Distribution */}
        {langData.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="glass p-5 rounded-xl lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Code2 size={14} style={{ color: '#8b5cf6' }} /> Language Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={langData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Reviews" radius={[4, 4, 0, 0]}>
                  {langData.map((_: any, index: number) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
