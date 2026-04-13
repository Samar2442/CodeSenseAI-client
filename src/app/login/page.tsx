'use client';

import { useState, SyntheticEvent, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';

function AuthContent() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('tab') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLogin(searchParams.get('tab') !== 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isLogin && !acceptedTerms) {
      setError('Please accept the Terms & Conditions.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email, password } 
        : { email, password, name: `${firstName} ${lastName}`.trim() };
      
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('auth-change'));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  const AppleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.24 11.51c-.02-2.31 1.89-3.41 1.98-3.46-1.07-1.57-2.74-1.78-3.34-1.8-1.42-.14-2.77.84-3.51.84-.73 0-1.84-.81-3.02-.79-1.52.02-2.92.88-3.7 2.24-1.59 2.76-.41 6.84 1.15 9.09.76 1.1 1.66 2.33 2.85 2.29 1.14-.05 1.58-.74 2.96-.74 1.36 0 1.77.74 2.96.72 1.21-.02 1.99-1.12 2.74-2.22.87-1.27 1.23-2.51 1.25-2.58-.03-.02-2.42-.93-2.32-3.59zM15.01 5.39c.63-.76 1.05-1.82.93-2.88-.93.04-2.08.62-2.72 1.39-.57.68-1.07 1.77-.92 2.8 1.04.08 2.07-.55 2.71-1.31z"/>
    </svg>
  );

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-[#0bd1ff]/10 via-[#0f172a] to-[#7000ff]/10">
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-3xl z-0 pointer-events-none"></div>

      <div className="w-full max-w-[1100px] min-h-[680px] bg-[#13151f]/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] relative z-10 border border-white/10 ring-1 ring-white/5">
        
        {/* Left Card Background Container */}
        <div className="relative w-full md:w-[45%] h-[250px] md:h-auto p-10 flex flex-col justify-between shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6b47ff] to-[#3a1cbf] opacity-90 transition-opacity duration-1000"></div>
          {/* Topographic/Texture Overlay using pure CSS */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(255,255,255,0.1),_transparent_40%)]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-20 flex justify-between items-center w-full">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tighter text-white">CodeSense</span>
            </Link>
            <Link href="/" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-semibold text-[11px] text-white flex items-center gap-2 border border-white/10">
              Back to website <span className="text-xs">▶</span>
            </Link>
          </div>

          <div className="relative z-20 mt-auto pb-6">
            <h2 className="text-4xl font-semibold leading-[1.1] text-white tracking-tight drop-shadow-md">
              Capturing Metrics,<br/> Creating Excellence.
            </h2>
            <div className="flex gap-2 items-center mt-10">
              <div className="h-1.5 w-8 rounded-full bg-white/20"></div>
              <div className="h-1.5 w-8 rounded-full bg-white/20"></div>
              <div className="h-1.5 w-12 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="w-full md:w-[55%] px-8 py-10 md:px-14 md:py-16 flex flex-col justify-center h-full bg-[#181a25]/95 relative items-center">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-[420px] mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2">
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              
              <div className="flex items-center gap-2 text-[#a1a1aa] mb-8 text-sm">
                <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }} 
                  className="text-white font-medium hover:text-[#a085ff] transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-[#a085ff]"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Inputs */}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                     <input 
                       type="text" 
                       placeholder="First name"
                       value={firstName}
                       onChange={(e) => setFirstName(e.target.value)}
                       className="w-full bg-[#222433] border border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-[#7651FF] focus:ring-1 focus:ring-[#7651FF]/50 transition-all text-white placeholder:text-[#7f7f8f] text-[15px]"
                       required
                     />
                     <input 
                       type="text" 
                       placeholder="Last name"
                       value={lastName}
                       onChange={(e) => setLastName(e.target.value)}
                       className="w-full bg-[#222433] border border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-[#7651FF] focus:ring-1 focus:ring-[#7651FF]/50 transition-all text-white placeholder:text-[#7f7f8f] text-[15px]"
                       required
                     />
                  </div>
                )}

                <input 
                  type="email" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#222433] border border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-[#7651FF] focus:ring-1 focus:ring-[#7651FF]/50 transition-all text-white placeholder:text-[#7f7f8f] text-[15px]"
                  required
                />

                <div className="relative group">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#222433] border border-white/5 rounded-xl pl-4 pr-12 py-3.5 outline-none focus:border-[#7651FF] focus:ring-1 focus:ring-[#7651FF]/50 transition-all text-white placeholder:text-[#7f7f8f] text-[15px]"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7f7f8f] hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Checkboxes & Helpers */}
                {!isLogin ? (
                  <div className="flex items-center gap-3 pt-2 mb-2">
                    <button 
                      type="button" 
                      onClick={() => setAcceptedTerms(!acceptedTerms)}
                      className={`w-[18px] h-[18px] rounded transition-all flex items-center justify-center shrink-0 border ${acceptedTerms ? 'bg-[#7651FF] border-[#7651FF]' : 'bg-[#222433] border-white/20 hover:border-white/40'}`}
                    >
                      <Check size={12} className={`text-white transition-opacity ${acceptedTerms ? 'opacity-100' : 'opacity-0'} stroke-[4px]`} />
                    </button>
                    <span className="text-[14px] text-[#a1a1aa]">
                      I agree to the <a href="#" className="text-white hover:text-[#7651FF] underline decoration-white/30 underline-offset-2">Terms & Conditions</a>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 mb-2">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className={`w-[18px] h-[18px] rounded transition-all flex items-center justify-center shrink-0 border ${acceptedTerms ? 'bg-[#7651FF] border-[#7651FF]' : 'bg-[#222433] border-white/20 hover:border-white/40'}`}
                      >
                         <Check size={12} className={`text-white transition-opacity ${acceptedTerms ? 'opacity-100' : 'opacity-0'} stroke-[4px]`} />
                      </button>
                      <span className="text-[14px] text-[#a1a1aa]">Remember me</span>
                    </div>
                    <a href="#" className="text-[14px] text-[#a1a1aa] hover:text-white transition-colors">Forgot password?</a>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 text-[15px] mt-4 flex items-center justify-center gap-2 bg-[#7651FF] hover:bg-[#856df5] font-semibold rounded-xl text-white transition-all active:scale-[0.98] shadow-[0_5px_20px_rgba(118,81,255,0.3)] disabled:opacity-50"
                >
                  {loading ? <span className="animate-pulse">{isLogin ? 'Authenticating...' : 'Creating...'}</span> : (isLogin ? 'Log in' : 'Create account')}
                </button>

                {/* Divider */}
                <div className="flex items-center py-6">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="px-4 text-[11px] text-[#7f7f8f] uppercase tracking-widest font-semibold flex-shrink-0">{isLogin ? 'Or log in with' : 'Or register with'}</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex items-center justify-center gap-3 py-3.5 bg-[#222433] border border-white/5 rounded-xl hover:bg-[#2a2c3d] hover:border-white/10 transition-all text-sm font-semibold text-white/90">
                    <GoogleIcon />
                    Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-3 py-3.5 bg-[#222433] border border-white/5 rounded-xl hover:bg-[#2a2c3d] hover:border-white/10 transition-all text-sm font-semibold text-white/90">
                    <AppleIcon />
                    Apple
                  </button>
                </div>

              </form>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </main>
  );
}

export default function AuthPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Loading authentication...</div>}>
      <AuthContent />
    </Suspense>
  );
}
