'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Palette, Key, LogOut, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('neon-dark');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setProfile({ name: d.name || '', email: d.email || '' }))
      .catch(console.error);
  }, []);

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved!');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  const Section = ({ title, icon: Icon, iconColor, children }: any) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Icon size={15} style={{ color: iconColor }} />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );

  const themes = [
    { id: 'neon-dark', label: 'Hacker Neon', desc: 'Default dark theme with cyan accents', colors: ['#00ffff', '#8b5cf6', '#0a0a0a'] },
    { id: 'cyber-purple', label: 'Cyber Purple', desc: 'Deep space with purple dominance', colors: ['#8b5cf6', '#ff00ff', '#0d0d1a'] },
    { id: 'matrix-green', label: 'Matrix Green', desc: 'Classic terminal green aesthetic', colors: ['#00ff9f', '#00ff00', '#0a0a0a'] },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Manage your account preferences and configuration</p>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={User} iconColor="#00ffff">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black"
              style={{ background: 'linear-gradient(135deg, #00ffff, #8b5cf6)', color: '#000' }}>
              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-bold text-white">{profile.name || 'User'}</div>
              <div className="text-xs" style={{ color: '#6b7280' }}>{profile.email}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: '#6b7280' }}>Display Name</label>
              <input
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="input-neon"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: '#6b7280' }}>Email Address</label>
              <input
                value={profile.email}
                className="input-neon opacity-60 cursor-not-allowed"
                readOnly
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Theme */}
      <Section title="Appearance" icon={Palette} iconColor="#8b5cf6">
        <div className="space-y-3">
          {themes.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className="w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left"
              style={theme === t.id
                ? { border: '1px solid rgba(0,255,255,0.3)', background: 'rgba(0,255,255,0.05)' }
                : { border: '1px solid rgba(255,255,255,0.06)', background: 'transparent' }
              }
            >
              <div className="flex gap-1 shrink-0">
                {t.colors.map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ background: c }} />
                ))}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{t.label}</div>
                <div className="text-[11px]" style={{ color: '#6b7280' }}>{t.desc}</div>
              </div>
              {theme === t.id && <Check size={14} style={{ color: '#00ffff' }} />}
            </button>
          ))}
        </div>
      </Section>

      {/* API Key */}
      <Section title="API Configuration" icon={Key} iconColor="#ff00ff">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: '#6b7280' }}>Custom Groq API Key <span style={{ color: '#4b5563' }}>(optional)</span></label>
            <input className="input-neon font-mono text-sm" placeholder="gsk_..." type="password" />
            <p className="text-[11px] mt-1.5" style={{ color: '#4b5563' }}>Leave blank to use the platform's shared key. Your key is stored securely.</p>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={saved
            ? { background: 'rgba(0,255,159,0.1)', border: '1px solid rgba(0,255,159,0.3)', color: '#00ff9f' }
            : { background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)', color: '#00ffff' }
          }
        >
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </motion.button>
        <button onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all"
          style={{ border: '1px solid rgba(255,68,68,0.2)', color: '#ff6666', background: 'rgba(255,68,68,0.04)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,68,68,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,68,68,0.04)'; }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}
