'use client';
import { useState, useCallback, useRef } from 'react';
import { File, Code, Zap, AlertTriangle, CheckCircle, ShieldCheck, Upload, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File is too large (max 5MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target?.result as string);
      showToast(`Loaded ${file.name}`, 'success');
      
      const ext = file.name.split('.').pop()?.toLowerCase();
      const map: Record<string, string> = { js: 'javascript', ts: 'typescript', py: 'python', java: 'java', go: 'go', rs: 'rust', cpp: 'cpp', c: 'cpp' };
      if (ext && map[ext]) setLanguage(map[ext]);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartAnalysis = async () => {
    if (!code.trim()) {
      setError("Please paste some code to analyze.");
      return;
    }
    setError('');
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Not authenticated");

      const res = await fetch('http://localhost:5000/api/code-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, language })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to analyze');
      
      const parsedContent = JSON.parse(data.content);
      setResult({ ...parsedContent, finalScore: data.score, createdAt: data.createdAt });
      showToast('Analysis complete!', 'success');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
      showToast(err.message || 'Analysis failed', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-8 right-8 z-50 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border flex items-center gap-3 backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-red-500/10 border-red-500/20 text-red-100'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-500"/> : <AlertTriangle size={20} className="text-red-500" />}
            <span className="font-semibold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100"><X size={16}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Code Review & Analysis</h1>
        <p className="text-muted-foreground mt-1">Paste your code below to trigger our AI analysis pipelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Side */}
        <div className="glass flex flex-col p-6 h-[600px] border border-white/5 rounded-xl">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2 text-primary">
                 <Code size={20} />
                 Source Code
              </h3>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload} 
                  accept=".js,.ts,.py,.java,.go,.rs,.cpp,.c,.txt" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-muted-foreground hover:text-white"
                >
                   <Upload size={14} /> File
                </button>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-sm font-semibold capitalize outline-none focus:border-primary text-white"
                >
                 <option value="javascript">JavaScript</option>
                 <option value="typescript">TypeScript</option>
                 <option value="python">Python</option>
                 <option value="java">Java</option>
                 <option value="go">Go</option>
                 <option value="rust">Rust</option>
                 <option value="cpp">C++</option>
              </select>
              </div>
           </div>
           
           <textarea
             value={code}
             onChange={(e) => setCode(e.target.value)}
             placeholder="Paste your source code here..."
             className="flex-1 w-full bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-xs md:text-sm text-green-400 outline-none focus:border-primary/50 transition-colors resize-none scrollbar-thin shadow-inner"
             spellCheck="false"
           />
           
           {error && (
             <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-bold flex items-center gap-2">
               <AlertTriangle size={16} />
               {error}
             </div>
           )}

           <button 
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className={`btn-neon mt-4 py-4 w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest ${isAnalyzing && 'opacity-60 cursor-not-allowed border-transparent'}`}
           >
              {isAnalyzing ? (
                <>
                  <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  Processing Intelligence...
                </>
              ) : (
                <>AI Analyze Code</>
              )}
           </button>
        </div>

        {/* Results Side */}
        <div className="glass p-6 border border-white/5 rounded-xl overflow-hidden flex flex-col h-[600px] relative">
           <h3 className="font-bold flex items-center gap-2 mb-6">
              <Zap size={20} className="text-accent" />
              AI Explanation Panel
           </h3>
           
           {isAnalyzing && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-sm">
                <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                   <div className="absolute inset-0 rounded-full border-4 border-primary/20 blur-sm"></div>
                   <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-b-primary animate-spin"></div>
                   <Zap size={24} className="text-primary animate-pulse" />
                </div>
                <h4 className="font-bold text-xl uppercase tracking-widest text-primary shadow-[0_0_15px_rgba(0,242,255,0.4)]">Scanning Tokens</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                   Our neural network is building AST trees, verifying cyclic dependencies, and scoring complexity metrics.
                </p>
             </div>
           )}

           {!result && !isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                 <ShieldCheck size={64} className="text-muted-foreground" />
                 <p className="max-w-[250px] text-sm">
                   Awaiting analysis. Paste code and press analyze to begin the process.
                 </p>
              </div>
           ) : result ? (
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                 {/* Score Card */}
                 <div className="p-6 rounded-lg bg-black/30 border border-white/10 flex items-center gap-6">
                    <div className="w-20 h-20 shrink-0 rounded-full border-4 flex items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        style={{ borderColor: result.finalScore > 80 ? '#00f2ff' : result.finalScore > 50 ? '#ffb300' : '#ff0000' }}
                    >
                       <span className="text-2xl font-black">{result.finalScore || result.score || 0}</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Overall Health Score</h4>
                        <p className="text-sm text-muted-foreground mt-1">Based on complexity, security, and best practices.</p>
                    </div>
                 </div>
                 
                 {/* AI Insights array rendered dynamically */}
                 <div className="space-y-4">
                    <h4 className="font-bold border-b border-white/10 pb-2 uppercase tracking-wider text-xs">Issues & Suggestions</h4>
                    {result.issues && result.issues.length > 0 ? (
                       result.issues.map((issue: any, idx: number) => (
                           <div key={idx} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg space-y-2">
                              <h5 className="font-bold text-red-400 flex items-center gap-2 text-sm"><AlertTriangle size={16} />{issue.title || "Issue"}</h5>
                              <p className="text-muted-foreground text-sm leading-relaxed">{issue.description || issue.message || issue}</p>
                           </div>
                       ))
                    ) : (
                       <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                          <CheckCircle className="text-emerald-500" size={20} />
                          <p className="text-sm text-emerald-100 font-semibold">No critical issues found! Great code structure.</p>
                       </div>
                    )}
                 </div>

                 {/* Optimizations */}
                 {result.optimizations && Array.isArray(result.optimizations) && (
                     <div className="space-y-4">
                        <h4 className="font-bold border-b border-white/10 pb-2 uppercase tracking-wider text-xs text-primary">Performance Optimizations</h4>
                        {result.optimizations.map((opt: any, idx: number) => (
                            <div key={idx} className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                                <h5 className="font-bold text-primary flex items-center gap-2 text-sm"><Zap size={16} />Suggestion</h5>
                                <p className="text-muted-foreground text-sm leading-relaxed">{opt.description || opt}</p>
                            </div>
                        ))}
                     </div>
                 )}
                 
                 {(result.explanation || result.summary) && (
                     <div className="p-6 glass border border-secondary/20 rounded-lg bg-secondary/5 mt-4">
                         <h4 className="font-bold text-secondary text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Sparkles size={16} /> 
                            Summary
                         </h4>
                         <p className="text-sm leading-relaxed text-slate-300">
                            {result.explanation || result.summary}
                         </p>
                     </div>
                 )}
              </div>
           ) : null}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
