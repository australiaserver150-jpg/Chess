
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';

interface VictoryOverlayProps {
  winner: 'White' | 'Black';
  onReset: () => void;
}

const VictoryOverlay: React.FC<VictoryOverlayProps> = ({ winner, onReset }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Rotating Light Rays */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="w-[200vmax] h-[200vmax] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(251,191,36,0.2)_30deg,transparent_60deg,rgba(251,191,36,0.2)_90deg,transparent_120deg,rgba(251,191,36,0.2)_150deg,transparent_180deg,rgba(251,191,36,0.2)_210deg,transparent_240deg,rgba(251,191,36,0.2)_270deg,transparent_300deg,rgba(251,191,36,0.2)_330deg,transparent_360deg)]"
         />
      </div>

      {/* Rising Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-[1px]"
          initial={{ y: 600, x: (Math.random() - 0.5) * 800, opacity: 0, scale: 0 }}
          animate={{ y: -600, opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 flex flex-col items-center p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 p-8 rounded-full border-4 border-yellow-400/50 shadow-[0_0_60px_rgba(250,204,21,0.4)] backdrop-blur-md"
        >
          <Trophy size={80} className="text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] mb-4 tracking-tighter">
          CHECKMATE
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-3xl text-white font-bold mb-10 drop-shadow-md"
        >
          <span className={winner === 'White' ? "text-white" : "text-slate-400"}>{winner}</span> is Victorious!
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white rounded-full font-bold text-lg shadow-xl shadow-amber-500/20 transition-all border border-yellow-400/30"
        >
          <RotateCcw size={24} className="group-hover:-rotate-180 transition-transform duration-500" />
          New Game
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VictoryOverlay;
