'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Loader2, AlertTriangle, Lightbulb, ShieldAlert, Zap,
  CheckCircle2, Copy, ChevronDown, Send, Bot, User, RefreshCw, Upload, X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = ['javascript', 'typescript', 'python', 'go', 'java', 'rust', 'cpp', 'csharp', 'php', 'ruby'];

const SEVERITY_CONFIG: Record<string, { label: string; badgeClass: string; icon: any; borderColor: string; bgColor: string }> = {
  critical: { label: 'Critical', badgeClass: 'badge-critical', icon: ShieldAlert, borderColor: '#ff444440', bgColor: 'rgba(255,68,68,0.04)' },
  high: { label: 'High', badgeClass: 'badge-high', icon: AlertTriangle, borderColor: '#ff960040', bgColor: 'rgba(255,150,0,0.04)' },
  medium: { label: 'Medium', badgeClass: 'badge-medium', icon: Lightbulb, borderColor: '#8b5cf640', bgColor: 'rgba(139,92,246,0.04)' },
  low: { label: 'Low', badgeClass: 'badge-low', icon: Zap, borderColor: '#00ff9f40', bgColor: 'rgba(0,255,159,0.04)' },
};

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

export default function CodeReviewPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'issues' | 'optimized' | 'chat'>('issues');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getToken = () => localStorage.getItem('token') || '';

  const handleAnalyze = async () => {
    if (!code.trim()) { toast.error('Please enter some code to analyze.'); return; }
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { window.location.href = '/login'; return; }
        throw new Error(data.message || 'Analysis failed');
      }
      setResult(data);
      setChatMessages([]);
      setActiveTab('issues');
      toast.success('Analysis complete!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message: chatInput, code, language, history: chatMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) {
      toast.error('Chat failed: ' + err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 500000) { toast.error('File too large (max 500KB)'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target?.result as string);
      const ext = file.name.split('.').pop()?.toLowerCase();
      const langMap: Record<string, string> = { js: 'javascript', ts: 'typescript', py: 'python', go: 'go', java: 'java', rs: 'rust', cpp: 'cpp', cs: 'csharp', php: 'php', rb: 'ruby' };
      if (ext && langMap[ext]) setLanguage(langMap[ext]);
      toast.success(`Loaded: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getScoreColor = (score: number) => score >= 80 ? '#00ff9f' : score >= 60 ? '#8b5cf6' : score >= 40 ? '#ff9600' : '#ff4444';

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">AI Code Review</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Paste code, upload a file, or type to get instant AI analysis</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        {/* ========== LEFT: EDITOR ========== */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl overflow-hidden flex flex-col"
            style={{
              height: '520px',
              border: isDragging ? '1px solid rgba(0,255,255,0.5)' : '1px solid rgba(255,255,255,0.07)',
              background: '#0d0d16',
              boxShadow: isDragging ? '0 0 20px rgba(0,255,255,0.15)' : 'none',
              transition: 'all 0.2s',
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault(); setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileUpload(file);
            }}
          >
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 h-11 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs font-bold uppercase tracking-widest bg-transparent outline-none cursor-pointer"
                  style={{ color: '#00ffff', border: 'none' }}
                >
                  {LANGUAGES.map(l => <option key={l} value={l} style={{ background: '#0d0d16' }}>{l}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,255,0.3)'; e.currentTarget.style.color = '#00ffff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#6b7280'; }}
                >
                  <Upload size={11} /> Upload
                </button>
                {code && (
                  <button onClick={() => setCode('')} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                    <X size={14} />
                  </button>
                )}
                <input ref={fileInputRef} type="file" className="hidden" accept=".js,.ts,.py,.go,.java,.rs,.cpp,.cs,.php,.rb,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 12, bottom: 12 },
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  renderLineHighlight: 'gutter',
                  selectOnLineNumbers: true,
                }}
              />
            </div>
          </div>

          {/* Analyze Button */}
          <motion.button
            onClick={handleAnalyze}
            disabled={isLoading || !code.trim()}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-neon w-full py-3.5 font-black text-sm uppercase tracking-widest"
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Code2 size={16} /> Analyze Code</>
            )}
          </motion.button>

          {error && (
            <div className="p-3 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff6666' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}
        </div>

        {/* ========== RIGHT: RESULTS ========== */}
        <div className="flex flex-col gap-4" style={{ minHeight: '520px' }}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 rounded-xl flex flex-col items-center justify-center gap-5 text-center p-8"
                style={{ height: '520px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d0d16' }}>
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-2 border-[#00ffff20]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00ffff] animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#8b5cf6] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                  <Bot size={20} className="absolute inset-0 m-auto" style={{ color: '#00ffff' }} />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">AI Analysis Running</h3>
                  <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Scanning for vulnerabilities, patterns & optimizations...</p>
                </div>
                <div className="flex gap-2">
                  {['Parsing AST', 'Security Scan', 'Optimization'].map((t, i) => (
                    <div key={t} className="text-[10px] font-bold px-2 py-1 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s`, background: 'rgba(0,255,255,0.08)', color: '#00ffff', border: '1px solid rgba(0,255,255,0.2)' }}>{t}</div>
                  ))}
                </div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                {/* Score Card */}
                <div className="p-5 rounded-xl flex items-center gap-5" style={{ border: `1px solid ${getScoreColor(result.score)}30`, background: `${getScoreColor(result.score)}08` }}>
                  {/* Circular score */}
                  <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={getScoreColor(result.score)} strokeWidth="2.5"
                        strokeDasharray={`${(result.score / 100) * 94.2} 94.2`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-black" style={{ color: getScoreColor(result.score) }}>{result.score}</span>
                  </div>
                  <div>
                    <div className="text-lg font-black text-white">
                      {result.score >= 80 ? '✅ Great Code' : result.score >= 60 ? '⚠️ Needs Work' : '❌ Critical Issues'}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                      {result.issues?.length || 0} issue{result.issues?.length !== 1 ? 's' : ''} detected • {result.language}
                    </div>
                    {result.explanation && (
                      <p className="text-xs mt-2 leading-relaxed" style={{ color: '#9ca3af' }}>{result.explanation}</p>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {[
                    { id: 'issues', label: `Issues (${result.issues?.length || 0})` },
                    { id: 'optimized', label: 'Optimized' },
                    { id: 'chat', label: '💬 Ask AI' },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200"
                      style={activeTab === tab.id ? { background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '1px solid rgba(0,255,255,0.2)' } : { color: '#6b7280' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="rounded-xl overflow-hidden" style={{ minHeight: '300px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d0d16' }}>

                  {/* Issues Tab */}
                  {activeTab === 'issues' && (
                    <div className="overflow-y-auto max-h-96 divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      {result.issues?.length === 0 ? (
                        <div className="p-10 text-center">
                          <CheckCircle2 size={32} className="mx-auto mb-3" style={{ color: '#00ff9f' }} />
                          <div className="font-bold text-white">Perfect Score!</div>
                          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>No issues detected in your code.</div>
                        </div>
                      ) : result.issues.map((issue: any, i: number) => {
                        const cfg = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.low;
                        const IssueIcon = cfg.icon;
                        return (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="p-4 space-y-2" style={{ borderLeft: `3px solid ${cfg.borderColor}`, background: cfg.bgColor }}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <IssueIcon size={14} style={{ color: issue.severity === 'critical' ? '#ff4444' : issue.severity === 'high' ? '#ff9600' : issue.severity === 'medium' ? '#8b5cf6' : '#00ff9f' }} />
                                <span className="text-sm font-bold text-white">{issue.title}</span>
                              </div>
                              <span className={cfg.badgeClass}>{issue.type}</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{issue.description}</p>
                            {issue.suggestion && (
                              <div className="mt-2 p-3 rounded-lg relative" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1" style={{ color: '#00ffff' }}>
                                  <Lightbulb size={10} /> AI Fix
                                </div>
                                <p className="text-xs font-mono leading-relaxed" style={{ color: '#d1fae5' }}>{issue.suggestion}</p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Optimized Tab */}
                  {activeTab === 'optimized' && (
                    <div className="p-4">
                      {result.optimizedCode ? (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold" style={{ color: '#00ff9f' }}>✨ Optimized Version</span>
                            <button
                              onClick={() => copyToClipboard(result.optimizedCode)}
                              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-all"
                              style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}
                            >
                              <Copy size={10} /> Copy
                            </button>
                          </div>
                          <MonacoEditor
                            height="320px"
                            language={language}
                            value={result.optimizedCode}
                            theme="vs-dark"
                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", scrollBeyondLastLine: false, padding: { top: 8 } }}
                          />
                        </div>
                      ) : (
                        <div className="h-56 flex flex-col items-center justify-center text-center">
                          <CheckCircle2 size={28} className="mb-2" style={{ color: '#00ff9f' }} />
                          <div className="text-sm font-bold text-white">No optimization needed</div>
                          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>Your code is already well-optimized!</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chat Tab */}
                  {activeTab === 'chat' && (
                    <div className="flex flex-col h-96">
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.length === 0 && (
                          <div className="text-center py-8">
                            <Bot size={28} className="mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                            <div className="text-xs font-bold text-white">Ask about your code</div>
                            <div className="text-[11px] mt-1" style={{ color: '#6b7280' }}>I have full context of your code and review results.</div>
                            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                              {['Explain the bugs', 'How to fix security issues?', 'Can you refactor this?'].map(q => (
                                <button key={q} onClick={() => setChatInput(q)}
                                  className="text-[10px] px-2 py-1 rounded-full transition-all"
                                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6' }}>
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? '' : ''}`}
                              style={{ background: msg.role === 'user' ? 'rgba(139,92,246,0.2)' : 'rgba(0,255,255,0.1)', border: `1px solid ${msg.role === 'user' ? 'rgba(139,92,246,0.3)' : 'rgba(0,255,255,0.2)'}` }}>
                              {msg.role === 'user' ? <User size={12} style={{ color: '#8b5cf6' }} /> : <Bot size={12} style={{ color: '#00ffff' }} />}
                            </div>
                            <div className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'text-right' : ''}`}
                              style={{ background: msg.role === 'user' ? 'rgba(139,92,246,0.1)' : 'rgba(0,255,255,0.05)', border: `1px solid ${msg.role === 'user' ? 'rgba(139,92,246,0.2)' : 'rgba(0,255,255,0.1)'}`, color: '#d1d5db', whiteSpace: 'pre-wrap' }}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {chatLoading && (
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.2)' }}>
                              <Bot size={12} style={{ color: '#00ffff' }} />
                            </div>
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.1)' }}>
                              <div className="flex gap-1">
                                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="flex gap-2">
                          <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChat()}
                            placeholder="Ask about your code..."
                            className="input-neon flex-1 text-xs py-2"
                          />
                          <button
                            onClick={handleChat}
                            disabled={chatLoading || !chatInput.trim()}
                            className="px-3 py-2 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                            style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.2)', color: '#00ffff' }}
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Re-analyze */}
                <button onClick={handleAnalyze}
                  className="flex items-center gap-1.5 text-xs font-bold transition-colors self-end"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#00ffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                >
                  <RefreshCw size={12} /> Re-analyze
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-4 text-center rounded-xl p-12"
                style={{ height: '520px', border: '1px dashed rgba(255,255,255,0.07)', background: '#0d0d1608' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-float"
                  style={{ background: 'rgba(0,255,255,0.06)', border: '1px solid rgba(0,255,255,0.15)' }}>
                  <Code2 size={28} style={{ color: '#00ffff', opacity: 0.5 }} />
                </div>
                <div>
                  <div className="font-bold text-white">Awaiting Code Submission</div>
                  <p className="text-xs mt-1 max-w-xs" style={{ color: '#6b7280' }}>
                    Paste your code in the editor, upload a file, or drag & drop. Hit Analyze to get instant AI feedback.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Bug Detection', 'Security Scan', 'Optimization', 'Code Chat'].map(f => (
                    <span key={f} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
