'use client';
import { useState } from 'react';
import { ShieldCheck, Zap, AlertTriangle, ChevronLeft, ChevronRight, Download, Share2, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ReviewPage = ({ params }: { params: { id: string } }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bugs' | 'optimizations' | 'security'>('overview');

  const issues = [
    { type: 'bug', severity: 'high', title: 'Potential Nulla Pointer Exception', description: 'Variable "items" could be undefined when accessed in line 42.', suggestion: 'Add a null check before accessing items.length' },
    { type: 'optimization', severity: 'medium', title: 'Inefficient Loop', description: 'Nested loops results in O(n^2) complexity.', suggestion: 'Consider using a Map for O(1) lookups.' },
    { type: 'security', severity: 'critical', title: 'Hardcoded API Key', description: 'Found a string resembling a private key in config.ts', suggestion: 'Move keys to .env variables.' }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
               <ChevronLeft size={20} />
            </Link>
            <div>
               <h1 className="text-2xl font-bold flex flex-wrap items-center gap-3">
                  Analysis: <span className="text-primary truncate max-w-[200px]">auth_service.ts</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">SCORE: 68/100</span>
               </h1>
               <p className="text-sm text-muted-foreground">Completed on March 27, 2026 • 2,450 lines of code</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="glass px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/5">
               <Download size={16} /> Export PDF
            </button>
            <button className="btn-neon px-4 py-2 flex items-center gap-2 text-sm">
               <Share2 size={16} /> Share Report
            </button>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="glass p-6 text-center border-primary/20 bg-primary/[0.02]">
            <div className="text-3xl font-bold text-primary mb-1">68</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Health Score</div>
         </div>
         <div className="glass p-6 text-center border-accent/20 bg-accent/[0.02]">
            <div className="text-3xl font-bold text-accent mb-1">12</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Bugs Found</div>
         </div>
         <div className="glass p-6 text-center border-secondary/20 bg-secondary/[0.02]">
            <div className="text-3xl font-bold text-secondary mb-1">08</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Optimizations</div>
         </div>
         <div className="glass p-6 text-center border-destructive/20 bg-destructive/[0.02]">
            <div className="text-3xl font-bold text-destructive mb-1">02</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Security Risks</div>
         </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
         {['overview', 'bugs', 'optimizations', 'security'].map((tab) => (
           <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
               activeTab === tab ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'
            }`}
           >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-4">
            {issues.map((issue, i) => (
               <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass p-6 border-l-4 ${
                  issue.severity === 'critical' ? 'border-destructive' : 
                  issue.severity === 'high' ? 'border-accent' : 'border-secondary'
                }`}
               >
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-3">
                        {issue.type === 'bug' && <AlertTriangle className="text-accent" />}
                        {issue.type === 'optimization' && <Zap className="text-secondary" />}
                        {issue.type === 'security' && <ShieldCheck className="text-destructive" />}
                        <h3 className="font-bold text-lg">{issue.title}</h3>
                     </div>
                     <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        issue.severity === 'critical' ? 'border-destructive/20 text-destructive bg-destructive/5' :
                        issue.severity === 'high' ? 'border-accent/20 text-accent bg-accent/5' : 'border-secondary/20 text-secondary bg-secondary/5'
                     }`}>
                        {issue.severity}
                     </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{issue.description}</p>
                  <div className="bg-white/5 p-4 rounded-lg space-y-2">
                     <div className="text-xs font-bold text-primary flex items-center gap-2">
                        <Sparkles size={14} /> AI Recommendation
                     </div>
                     <p className="text-sm font-mono text-white/80">{issue.suggestion}</p>
                     <button className="text-xs text-primary font-bold hover:underline mt-2">Apply Auto-Fix →</button>
                  </div>
               </motion.div>
            ))}
         </div>

         <div className="space-y-6">
            <div className="glass p-6 sticky top-24">
               <h3 className="font-bold flex items-center gap-2 mb-6 text-primary">
                  <MessageSquare size={18} />
                  AI Chat Assistant
               </h3>
               <div className="space-y-4 h-[300px] overflow-y-auto mb-4 p-2 text-xs text-muted-foreground italic">
                  Ask me anything about these results or how to improve the code.
               </div>
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask AI..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pr-10 outline-none focus:border-primary transition-colors text-sm"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                     <ChevronRight size={18} />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReviewPage;
