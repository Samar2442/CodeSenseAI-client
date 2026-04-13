'use client';
import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Play, Save, Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const EditorPage = () => {
  const [code, setCode] = useState(`// Paste your code here to analyze...
function calculateTotal(items) {
  let total = 0;
  for(let i=0; i<items.length; i++) {
    total += items[i].price;
  }
  return total;
}`);

  const handleAnalyze = () => {
    alert("AI Analysis triggered for this snippet!");
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link href="/dashboard/upload" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <ChevronLeft size={20} />
           </Link>
           <div>
              <h1 className="text-xl font-bold">Quick Editor</h1>
              <p className="text-xs text-muted-foreground">Paste and analyze code snippets instantly.</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="glass px-4 py-2 flex items-center gap-2 text-sm">
              <Save size={16} /> Save Snippet
           </button>
           <button onClick={handleAnalyze} className="btn-neon px-6 py-2 flex items-center gap-2 text-sm">
              <Sparkles size={16} /> Run AI Review
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
        {/* Editor Area */}
        <div className="glass flex flex-col overflow-hidden border-primary/20">
           <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>snippet.js</span>
              <span>JavaScript</span>
           </div>
           <textarea 
            className="flex-1 bg-transparent p-6 font-mono text-sm outline-none resize-none hide-scrollbar w-full h-full text-transparent caret-primary z-10 absolute inset-0 pt-14"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
           />
           <div className="flex-1 p-6 font-mono text-sm overflow-auto pointer-events-none pt-14">
             <Highlight theme={themes.vsDark} code={code} language="javascript">
               {({ className, style, tokens, getLineProps, getTokenProps }) => (
                 <pre className={className} style={{ ...style, background: 'transparent' }}>
                   {tokens.map((line, i) => (
                     <div key={i} {...getLineProps({ line, key: i })}>
                       <span className="inline-block w-8 text-muted-foreground/30 select-none">{i + 1}</span>
                       {line.map((token, key) => (
                         <span key={key} {...getTokenProps({ token, key })} />
                       ))}
                     </div>
                   ))}
                 </pre>
               )}
             </Highlight>
           </div>
        </div>

        {/* AI Results Area (Mock) */}
        <div className="glass flex flex-col overflow-hidden bg-white/[0.01]">
           <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2 text-xs font-bold text-primary italic uppercase">
              <Sparkles size={14} /> AI Analysis Results
           </div>
           <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="text-center py-12">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Sparkles size={32} className="text-muted-foreground opacity-20" />
                 </div>
                 <h3 className="text-muted-foreground text-sm italic">Ready to analyze. Click "Run AI Review" to begin.</h3>
              </div>
              
              {/* This will be populated after analysis */}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
