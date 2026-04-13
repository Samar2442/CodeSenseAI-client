'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Code2, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CodeReviewPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewResult, setReviewResult] = useState<any>(null);
  
  const handleAnalyze = async () => {
    console.log("Button clicked");
    
    if (!code.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log("Sending request");
      
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem('token');
      
      console.log(`Payload mapping to: ${BASE_URL}/code-review`);
      
      const res = await fetch(`${BASE_URL}/code-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ code, language })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
           window.location.href = '/login';
        }
        throw new Error(data.message || 'Failed to analyze code');
      }

      setReviewResult(JSON.parse(data.content));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full pb-10">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Code Review</h1>
           <p className="text-muted-foreground mt-1">Paste your code below to identify bugs, optimize performance, and harden security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col: Editor */}
        <div className="flex flex-col h-full gap-4">
          <div className="glass flex border border-white/10 rounded-xl overflow-hidden shadow-neon bg-black/40 h-[600px] flex-col">
             <div className="h-12 border-b border-white/10 flex items-center px-4 bg-white/5">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-none text-sm text-white/80 focus:ring-0 outline-none font-medium uppercase tracking-widest cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                  <option value="rust">Rust</option>
                </select>
             </div>
             <textarea 
               value={code}
               onChange={(e) => setCode(e.target.value)}
               placeholder="Paste your source code here..."
               className="w-full flex-1 bg-transparent border-none p-6 text-sm md:text-base resize-none font-mono focus:ring-0 outline-none text-white/90 placeholder:text-white/20 leading-relaxed"
             />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button 
             onClick={handleAnalyze} 
             disabled={isLoading || !code.trim()}
             className="btn-neon w-full py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm disabled:opacity-50"
          >
             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Code2 className="w-5 h-5" />}
             {isLoading ? 'Analyzing Source Code...' : 'Analyze Code'}
          </button>
        </div>

        {/* Right Col: Results */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="h-[600px] glass rounded-xl border border-white/10 flex flex-col items-center justify-center gap-4 text-center p-8 bg-black/20">
               <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
               <h3 className="text-xl font-bold mt-4 tracking-tighter">AI is inspecting your code</h3>
               <p className="text-muted-foreground">Scanning for vulnerabilities, evaluating time-complexity models, and determining optimal refactoring solutions.</p>
            </div>
          ) : reviewResult ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-xl border border-white/10 bg-black/40 h-[600px] overflow-y-auto space-y-6"
            >
               <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="font-bold text-lg">Analysis Complete</h3>
                  <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold">
                    Score: {reviewResult.score}/100
                  </div>
               </div>

               {reviewResult.issues?.length > 0 ? (
                 <div className="space-y-4">
                   {reviewResult.issues.map((issue: any, index: number) => (
                     <div key={index} className={`p-4 rounded-xl border flex flex-col gap-2 ${
                       issue.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' : 
                       issue.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' : 
                       'bg-primary/5 border-primary/20'
                     }`}>
                       <div className="flex items-center gap-2">
                         {issue.severity === 'critical' || issue.severity === 'high' ? 
                           <AlertTriangle size={16} className="text-red-400" /> : 
                           <Lightbulb size={16} className="text-primary" />
                         }
                         <span className="font-bold uppercase tracking-wider text-xs">{issue.type} • {issue.severity}</span>
                       </div>
                       <h4 className="font-bold text-base">{issue.title}</h4>
                       <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>
                       {issue.suggestion && (
                         <div className="mt-2 p-3 bg-black/50 rounded-lg text-sm font-mono text-green-400/90 whitespace-pre-wrap overflow-x-auto border border-white/5">
                           {issue.suggestion}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                     <CheckCircle2 size={32} />
                   </div>
                   <h3 className="font-bold text-lg">Code looks perfect!</h3>
                   <p className="text-sm text-muted-foreground">No critical bugs or vulnerabilities were detected in this snippet.</p>
                 </div>
               )}
            </motion.div>
          ) : (
            <div className="h-[600px] glass rounded-xl border border-white/10 flex flex-col items-center justify-center gap-4 text-center p-8 bg-black/20 text-muted-foreground/50 border-dashed">
               <Code2 size={48} className="opacity-20" />
               <p>Awaiting code snippet...<br/>Output will be populated here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
