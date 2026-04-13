'use client';
import { FileCode, Clock, ChevronRight, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HistoryPage = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const token = localStorage.getItem('token');
        
        if (!token) {
           router.push('/login');
           return;
        }

        const res = await fetch(`${BASE_URL}/history`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
           if (res.status === 401) router.push('/login');
           throw new Error('Failed to fetch history');
        }

        const data = await res.json();
        setReviews(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [router]);

  // Handle parsing dynamic review components and formatting standard dates
  const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
     });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review History</h1>
          <p className="text-muted-foreground mt-1">Manage and compare all your previous AI code reviews.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search reviews..."
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm w-64"
              />
           </div>
           <button className="glass p-2 hover:bg-white/5">
              <Filter size={20} />
           </button>
        </div>
      </div>

      <div className="glass overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5 grid grid-cols-12 gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
           <div className="col-span-5">Code ID</div>
           <div className="col-span-2">Language</div>
           <div className="col-span-2 text-center">Score</div>
           <div className="col-span-2 text-center">Date</div>
           <div className="col-span-1"></div>
        </div>
        
        {isLoading ? (
           <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        ) : error ? (
           <div className="p-12 text-center flex flex-col items-center text-red-500 gap-4">
              <AlertCircle size={32} />
              <p>{error}</p>
           </div>
        ) : reviews.length === 0 ? (
           <div className="p-12 text-center text-muted-foreground">
              No code reviews executed yet. Submit your first snippet on the Review page!
           </div>
        ) : (
          <div className="divide-y divide-white/5">
             {reviews.map((review) => (
               <div
                  key={review.id} 
                  className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-white/[0.03] transition-colors group cursor-default"
               >
                  <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                     <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
                        <FileCode size={20} className="text-primary" />
                     </div>
                     <span className="font-mono text-xs truncate text-muted-foreground">{review.id}</span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground italic uppercase">{review.language}</div>
                  <div className="col-span-2 text-center">
                     <span className={`font-bold ${review.score > 80 ? 'text-primary' : review.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {review.score}
                     </span>
                  </div>
                  <div className="col-span-2 text-center text-xs text-muted-foreground">{formatDate(review.createdAt)}</div>
                  <div className="col-span-1 flex justify-end">
                     {/* Stubbed forward action without sub-page routing configured beyond standard card visualization */}
                     <ChevronRight size={18} className="text-muted-foreground opacity-50" />
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-2 py-8">
         <button className="glass px-4 py-2 text-sm disabled:opacity-50" disabled>Previous</button>
         <button className="glass px-4 py-2 text-sm bg-primary/10 border-primary/20 text-primary">1</button>
         <button className="glass px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50" disabled>Next</button>
      </div>
    </div>
  );
};

export default HistoryPage;
