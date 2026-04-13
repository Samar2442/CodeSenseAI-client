'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-24 overflow-hidden px-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left Col: Text */}
        <div className="flex flex-col items-start gap-8 md:gap-10 text-left">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs md:text-sm font-black tracking-widest uppercase backdrop-blur-2xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Next-Gen AI Analysis V2.0
          </motion.div>
          
          <div className="flex flex-col gap-6">
              <motion.h1 variants={itemVariants} className="text-5xl md:text-[5.5rem] font-black leading-[1.05] tracking-tighter uppercase text-white">
                Review Code <br />
                <span className="gradient-text italic">Like a Pro</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground/90 max-w-lg leading-relaxed font-bold tracking-tight">
                Elevate your engineering standards with the world's most advanced AI-powered analysis platform.
              </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <Link href="/signup" className="btn-neon px-12 py-5 w-full sm:w-auto uppercase tracking-widest text-center text-sm font-bold">
              Sign Up Free
            </Link>
            <button className="glass-solid px-12 py-5 w-full sm:w-auto hover:bg-white/30 transition-all font-black border border-white/40 text-white shadow-2xl uppercase tracking-widest text-sm">
              Explore Demo
            </button>
          </motion.div>
        </div>

        {/* Right Col: Mockup Preview */}
        <motion.div 
          variants={itemVariants}
          className="relative group w-full"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
          <div className="relative glass p-2 md:p-6 rounded-[2.5rem] border-white/20 shadow-2xl overflow-hidden bg-black/60">
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/90 aspect-video flex flex-col justify-center">
               <div className="p-6 md:p-8 text-left w-full font-mono text-xs md:text-sm leading-relaxed overflow-hidden">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <p className="text-secondary/80 italic font-bold mb-4">// Initializing Codesense AI Analysis...</p>
                  <p className="text-primary flex flex-wrap items-center gap-3 font-black text-sm md:text-base mb-6">
                    <span className="w-1.5 h-4 bg-primary animate-pulse"></span>
                    Critical Vulnerability found in authentication.ts:L42
                  </p>
                  <div className="p-4 md:p-6 rounded-2xl bg-white/5 border-l-[4px] border-accent backdrop-blur-xl">
                      <span className="text-accent font-black block mb-2 text-[10px] md:text-xs tracking-widest uppercase">AI RECOMMENDATION:</span>
                      <p className="text-muted-foreground/90 font-bold">The current implementation of JWT validation lacks 'audience' and 'issuer' checks. This could lead to token substitution attacks. Deploying recommended fix...</p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
