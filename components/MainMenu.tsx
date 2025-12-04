
import React, { useState } from 'react';
import { Cpu, Users, Globe, ChevronRight, Swords, WifiOff, Box } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface MainMenuProps {
  onStartGame: (mode: 'pve' | 'pvp' | 'online' | '3d') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [connecting, setConnecting] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);

  const handleOnlineClick = () => {
    setConnecting(true);
    setOnlineError(null);
    // Simulate connection attempt
    setTimeout(() => {
      setConnecting(false);
      setOnlineError("Could not connect to matchmaking server. Please try again later.");
    }, 2000);
  };

  const menuItems = [
    {
      id: 'pve',
      title: 'Play vs Engine',
      description: 'Challenge Stockfish 10 running locally in your browser.',
      icon: Cpu,
      colorClass: 'text-teal-400',
      bgClass: 'bg-teal-500/10',
      borderClass: 'group-hover:border-teal-500/50',
      shadowClass: 'hover:shadow-teal-500/10',
      action: () => onStartGame('pve')
    },
    {
      id: 'pvp',
      title: 'Pass & Play',
      description: 'Offline multiplayer. Play with a friend on the same device.',
      icon: Users,
      colorClass: 'text-indigo-400',
      bgClass: 'bg-indigo-500/10',
      borderClass: 'group-hover:border-indigo-500/50',
      shadowClass: 'hover:shadow-indigo-500/10',
      action: () => onStartGame('pvp')
    },
    {
      id: '3d',
      title: '3D Experience',
      description: 'Play chess with an immersive 3D board perspective.',
      icon: Box,
      colorClass: 'text-purple-400',
      bgClass: 'bg-purple-500/10',
      borderClass: 'group-hover:border-purple-500/50',
      shadowClass: 'hover:shadow-purple-500/10',
      action: () => onStartGame('3d')
    },
    {
      id: 'online',
      title: 'Online Play',
      description: 'Matchmaking with players around the world.',
      icon: Globe,
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-500/10',
      borderClass: 'group-hover:border-rose-500/50',
      shadowClass: 'hover:shadow-rose-500/10',
      action: handleOnlineClick,
      disabled: connecting,
      extra: connecting ? (
        <div className="mt-auto flex items-center gap-2 text-rose-400 text-sm font-semibold">
           <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
           Connecting...
        </div>
      ) : (
         <div className="mt-auto flex items-center text-rose-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
           Find Match <ChevronRight size={16} className="ml-1" />
         </div>
      ),
      error: onlineError
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl shadow-xl mb-4 border border-slate-700">
            <Swords size={48} className="text-teal-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent pb-2">
            Grandmaster Chess
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            The ultimate chess experience. Challenge the engine, play with a friend, or master your strategy.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              disabled={item.disabled}
              className={clsx(
                "group relative flex flex-col items-center text-center p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl transition-all shadow-lg",
                item.borderClass,
                item.shadowClass
              )}
            >
              <div className={clsx("p-4 rounded-full mb-6 transition-colors", item.bgClass, item.colorClass.replace('text-', 'group-hover:bg-').replace('400', '500/20'))}>
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-100">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-6 min-h-[40px]">
                {item.description}
              </p>
              
              {item.extra ? item.extra : (
                <div className={clsx("mt-auto flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity", item.colorClass)}>
                  Start Game <ChevronRight size={16} className="ml-1" />
                </div>
              )}

              {/* Error Toast */}
              {item.error && (
                  <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 border border-red-500 text-white text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                      <WifiOff size={12} />
                      {item.error}
                  </div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="text-slate-500 text-sm mt-8">
            v1.1.0 • Powered by Stockfish.js
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
