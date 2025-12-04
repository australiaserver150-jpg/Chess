
import React from 'react';
import { Chess } from 'chess.js';
import { PIECE_SVGS } from '../constants';
import { Clock, History, Cpu, RotateCcw, AlertTriangle, Home, Volume2, VolumeX } from 'lucide-react';

interface GameInfoProps {
  game: Chess;
  history: string[];
  onReset: () => void;
  onUndo: () => void;
  onExit: () => void;
  aiReasoning: string | null;
  gameStatus: string;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ 
    game, 
    history, 
    onReset, 
    onUndo, 
    onExit, 
    aiReasoning, 
    gameStatus,
    isMuted,
    onToggleMute
}) => {
  // Calculate captured pieces
  const getCapturedPieces = () => {
    const board = game.board();
    const currentPieces = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
    
    board.forEach(row => {
      row.forEach(piece => {
        if (piece) {
          currentPieces[piece.color][piece.type]++;
        }
      });
    });

    const startingPieces = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    
    const captured = {
      w: [] as string[],
      b: [] as string[]
    };

    (['p', 'n', 'b', 'r', 'q'] as const).forEach(type => {
      const whiteLoss = startingPieces[type] - currentPieces.w[type];
      const blackLoss = startingPieces[type] - currentPieces.b[type];
      
      for (let i = 0; i < whiteLoss; i++) captured.w.push(type);
      for (let i = 0; i < blackLoss; i++) captured.b.push(type);
    });

    return captured;
  };

  const captured = getCapturedPieces();

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full text-slate-200 border border-slate-700">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
            Game Status
        </h2>
        <div className="flex gap-2">
            {onToggleMute && (
                <button onClick={onToggleMute} className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white" title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            )}
            <div className="w-px h-8 bg-slate-700 mx-1"></div>
            <button onClick={onUndo} className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white" title="Undo">
                <History size={20} />
            </button>
            <button onClick={onReset} className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white" title="New Game">
                <RotateCcw size={20} />
            </button>
            <button onClick={onExit} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400" title="Exit to Menu">
                <Home size={20} />
            </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            {gameStatus ? (
                 <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <AlertTriangle size={18} />
                    <span>{gameStatus}</span>
                 </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-teal-400" />
                    <span className="font-medium">
                        Turn: <span className={game.turn() === 'w' ? "text-white" : "text-slate-400"}>
                            {game.turn() === 'w' ? "White" : "Black"}
                        </span>
                    </span>
                </div>
            )}
        </div>
      </div>

      {/* Captured Pieces */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 h-8">
            <span className="text-xs font-bold text-slate-500 w-12">White Lost</span>
            <div className="flex -space-x-2">
                {captured.w.map((p, i) => (
                    <div key={i} className="w-6 h-6">
                        <svg viewBox="0 0 45 45" className="w-full h-full opacity-80">{PIECE_SVGS.w[p]}</svg>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-2 h-8">
            <span className="text-xs font-bold text-slate-500 w-12">Black Lost</span>
             <div className="flex -space-x-2">
                {captured.b.map((p, i) => (
                    <div key={i} className="w-6 h-6">
                        <svg viewBox="0 0 45 45" className="w-full h-full opacity-80">{PIECE_SVGS.b[p]}</svg>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Move History */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-[150px]">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Move History</h3>
        <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-lg p-2 border border-slate-700">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                    <React.Fragment key={i}>
                        <div className="flex justify-between px-2 py-1 rounded hover:bg-white/5">
                            <span className="text-slate-500 w-6">{i + 1}.</span>
                            <span className="text-slate-200 font-mono">{history[2 * i]}</span>
                        </div>
                        <div className="flex justify-between px-2 py-1 rounded hover:bg-white/5">
                            {history[2 * i + 1] ? (
                                <span className="text-slate-200 font-mono">{history[2 * i + 1]}</span>
                            ) : <span></span>}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
      </div>

      {/* Engine Evaluation */}
      {aiReasoning && (
          <div className="mt-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Cpu size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Engine Evaluation</span>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed font-mono">
                  {aiReasoning}
              </p>
          </div>
      )}

    </div>
  );
};

export default GameInfo;
