import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShoppingBag, Eye } from 'lucide-react';

const cities = [
  { name: 'Bangalore', x: 40, y: 70 },
  { name: 'Chennai', x: 45, y: 75 },
  { name: 'Mumbai', x: 25, y: 55 },
  { name: 'Delhi', x: 35, y: 30 },
  { name: 'Kochi', x: 38, y: 85 },
  { name: 'Coimbatore', x: 40, y: 80 },
  { name: 'Hyderabad', x: 40, y: 60 },
  { name: 'Pune', x: 27, y: 58 },
  { name: 'Kolkata', x: 65, y: 50 },
];

export function LiveIndiaMap() {
  const [activeDots, setActiveDots] = useState<any[]>([]);
  const [recentAction, setRecentAction] = useState<any>(null);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    
    // Simulate live actions
    const interval = setInterval(() => {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const isPurchase = Math.random() > 0.5;
      const dot = {
        id: Math.random().toString(),
        city,
        isPurchase,
        time: Date.now()
      };
      
      setActiveDots(prev => [...prev, dot]);
      setRecentAction(dot);

      const t = setTimeout(() => {
        setActiveDots(prev => prev.filter(d => d.id !== dot.id));
      }, 4000);
      timeouts.push(t);
    }, 3500);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden h-[400px]">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-charcoal">Live Traffic & Sales</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Real-time activity across India</p>
        </div>
        <div className="flex items-center text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" /> Live
        </div>
      </div>

      {/* Abstract Map Visualization */}
      <div className="absolute inset-0 top-16 flex items-center justify-center opacity-80">
        <div className="relative w-full max-w-[300px] aspect-[3/4]">
           {/* Abstract India Shape Placeholder */}
           <svg viewBox="0 0 100 120" className="w-full h-full text-gray-100 fill-current drop-shadow-sm">
             <path d="M40,5 C45,5 50,15 55,20 C60,25 70,30 75,40 C80,50 85,60 80,70 C75,80 65,90 55,100 C50,105 45,115 40,115 C35,115 30,105 25,100 C15,90 5,80 5,70 C5,60 10,50 15,40 C20,30 30,25 35,20 C40,15 35,10 40,5 Z" />
           </svg>

           {activeDots.map(dot => (
             <motion.div
               key={dot.id}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
               exit={{ scale: 0, opacity: 0 }}
               className="absolute"
               style={{ left: `${dot.city.x}%`, top: `${dot.city.y}%` }}
             >
               <span className="relative flex h-3 w-3">
                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dot.isPurchase ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
                 <span className={`relative inline-flex rounded-full h-3 w-3 ${dot.isPurchase ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
               </span>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Recent Action Overlay */}
      <AnimatePresence mode="wait">
        {recentAction && (
          <motion.div
            key={recentAction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg rounded-xl p-3 flex items-center gap-3 z-10"
          >
            <div className={`p-2 rounded-full ${recentAction.isPurchase ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
              {recentAction.isPurchase ? <ShoppingBag size={14} /> : <Eye size={14} />}
            </div>
            <div>
              <p className="text-xs font-bold text-charcoal">
                Someone from {recentAction.city.name}
              </p>
              <p className="text-[10px] text-gray-500">
                {recentAction.isPurchase ? 'just purchased an item' : 'is currently browsing'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
