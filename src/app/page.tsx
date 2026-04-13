'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/ui/Hero';

const features = [
  {
    title: "AI Code Analysis",
    description: "Real-time deep scanning of your codebase using industry-leading LLMs tuned specifically for engineering excellence.",
    icon: "🧠",
    color: "from-primary/20"
  },
  {
    title: "Security Scanner",
    description: "Detect SQL injections, XSS vulnerabilities, and outdated dependencies before they hit production environments.",
    icon: "🛡️",
    color: "from-secondary/20"
  },
  {
    title: "Optimization Tips",
    description: "Get detailed advice on time and space complexity with ready-to-use refactored code snippets for instant performance gains.",
    icon: "⚡",
    color: "from-accent/20"
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen selection:bg-primary selection:text-black max-w-7xl mx-auto px-6 mt-20 space-y-10 flex flex-col overflow-x-hidden">
      <Navbar />
      <Hero />
      
      <section id="features" className="py-12 md:py-24 relative z-10 flex flex-col gap-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-6xl md:text-[6rem] font-black mb-10 tracking-tighter uppercase text-white">
            Core <span className="gradient-text">Power</span>
          </h2>
          <p className="text-muted-foreground/80 text-xl md:text-3xl max-w-4xl mx-auto font-bold leading-relaxed">
            Unleash the full potential of your development workflow with our suite of intelligent tools.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="glass p-8 flex flex-col items-center text-center gap-6 hover:border-primary/60 hover:shadow-neon transition-all group relative overflow-hidden h-full rounded-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
              
              <div className="w-24 h-24 rounded-[2rem] bg-black/40 flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative z-10 border border-white/10 shadow-inner overflow-hidden shrink-0">
                 <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                 <span className="relative z-10">{feature.icon}</span>
              </div>
              
              <div className="relative z-10 flex-1 space-y-4 flex flex-col">
                <h3 className="text-2xl font-black group-hover:text-primary transition-colors tracking-tighter uppercase">{feature.title}</h3>
                <p className="text-muted-foreground/90 leading-relaxed text-lg font-semibold flex-1">
                  {feature.description}
                </p>
              </div>

              <div className="mt-4 relative z-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <button className="text-primary font-black flex items-center justify-center gap-2 text-sm uppercase tracking-[0.2em] hover:scale-105 transition-transform">
                  Details <span className="group-hover:translate-x-2 transition-transform text-xl">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section className="py-16 md:py-24 border-t border-white/10 relative overflow-hidden bg-white/[0.01]">
        <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 animate-pulse"></div>
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-10">
           <h2 className="text-5xl md:text-[7rem] font-black leading-[0.9] text-white uppercase tracking-tighter">Ready to <br/><span className="gradient-text italic">Ascend?</span></h2>
           <button className="btn-neon text-2xl md:text-3xl px-24 py-8 uppercase tracking-[0.2em]">Deploy Now</button>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center relative z-10 bg-black/60 backdrop-blur-3xl rounded-xl w-full">
        <div className="w-full flex flex-col items-center gap-12">
           <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              {['Twitter', 'GitHub', 'Discord', 'Docs', 'Status'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-muted-foreground/60 hover:text-primary transition-all hover:-translate-y-2 uppercase text-xs md:text-sm font-black tracking-[0.3em] inline-block px-4 py-2 border border-transparent hover:border-primary/20 rounded-lg hover:bg-primary/5"
                >
                  {social}
                </a>
              ))}
           </div>
           
           <div className="flex flex-col items-center gap-8">
             <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-3xl shadow-neon transition-transform hover:scale-110 hover:rotate-6">C</div>
             <div className="space-y-4">
               <p className="tracking-[0.5em] uppercase text-[10px] md:text-xs font-black text-muted-foreground/50">© 2026 CodeSense AI. Engineered for Eternity.</p>
               <p className="text-[10px] text-muted-foreground/20 italic">v2.4.8-stable // Cluster-Alpha-01</p>
             </div>
           </div>
        </div>
      </footer>
    </main>
  );
}
