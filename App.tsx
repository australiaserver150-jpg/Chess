
import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import MainMenu from './components/MainMenu';
import VictoryOverlay from './components/VictoryOverlay';
import { getGeminiMove as getEngineMove } from './services/geminiService';
import { soundService } from './services/soundService';
import { Trophy, Users, History, RotateCcw, Box } from 'lucide-react';
import clsx from 'clsx';

type GameMode = 'pve' | 'pvp' | 'online';
type ViewState = 'menu' | 'game';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('pve');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is3D, setIs3D] = useState(false);

  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);

  // 'aiMode' here acts as "Is the engine currently enabled for one side?". 
  // In PvP, this should be false. In PvE, true.
  const [aiMode, setAiMode] = useState<boolean>(true);
  const [playerColor, setPlayerColor] = useState<'w'|'b'>('w');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleStartGame = (mode: 'pve' | 'pvp' | 'online' | '3d') => {
    if (mode === '3d') {
        setGameMode('pve');
        setIs3D(true);
        setAiMode(true);
        setPlayerColor('w');
    } else {
        setGameMode(mode);
        setIs3D(false);
        if (mode === 'pve') {
            setAiMode(true);
            setPlayerColor('w'); // Default to white vs Engine
        } else {
            setAiMode(false);
        }
    }
    
    handleReset();
    setView('game');
  };

  const handleBackToMenu = () => {
    setView('menu');
    setIsFullscreen(false);
    setIs3D(false);
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    soundService.setEnabled(!newState);
  };

  // Helper to process sound and status after a move
  const processMoveResult = (moveResult: any, newGame: Chess) => {
    if (!moveResult) return;

    // 1. Play Sound
    if (newGame.isCheckmate()) {
       soundService.playWinSound();
    } else if (newGame.isGameOver()) {
       soundService.playDrawSound();
    } else if (newGame.inCheck()) {
       soundService.playCheck();
    } else if (moveResult.captured || moveResult.flags.includes('c') || moveResult.flags.includes('e')) {
       soundService.playCapture();
    } else {
       soundService.playMove();
    }

    // 2. Update Status
    if (newGame.isCheckmate()) {
      setGameStatus(`Checkmate! ${newGame.turn() === 'w' ? 'Black' : 'White'} wins.`);
    } else if (newGame.isDraw()) {
      setGameStatus('Draw!');
    } else if (newGame.isCheck()) {
      setGameStatus('Check!');
    } else {
      setGameStatus('');
    }
  };

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    try {
      // Create a temp game instance to check move validity and flags before updating state
      // (Or we can just use the existing game instance since .move() mutates it)
      const moveResult = game.move(move);
      
      if (moveResult) {
        setFen(game.fen());
        setHistory(game.history());
        setLastMove({ from: moveResult.from, to: moveResult.to });
        
        processMoveResult(moveResult, game);
        
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game]);

  // AI Turn Effect
  useEffect(() => {
    // Only run if in PvE mode, AI enabled, game not over, and it's not the player's turn
    if (gameMode !== 'pve' || !aiMode || game.isGameOver() || game.turn() === playerColor) return;

    const playAiTurn = async () => {
      setIsAiThinking(true);
      setErrorMsg(null);
      
      try {
        const validMoves = game.moves();
        if (validMoves.length === 0) return;

        // Call the engine service
        const result = await getEngineMove(game.fen(), validMoves, game.turn());
        
        setAiReasoning(result.reasoning);
        
        const moveResult = game.move(result.bestMove);
        if (moveResult) {
            setFen(game.fen());
            setHistory(game.history());
            setLastMove({ from: moveResult.from, to: moveResult.to });
            processMoveResult(moveResult, game);
        } else {
            throw new Error(`Failed to execute move: ${result.bestMove}`);
        }
      } catch (err: any) {
        console.error("Engine Move Error", err);
        setErrorMsg(err.message || "Engine encountered an error.");
      } finally {
        setIsAiThinking(false);
      }
    };

    // Small delay to allow UI to render "Thinking..." state
    const timer = setTimeout(playAiTurn, 200);
    return () => clearTimeout(timer);

  }, [fen, aiMode, playerColor, game, gameMode]);


  const handleReset = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setHistory([]);
    setGameStatus('');
    setLastMove(null);
    setAiReasoning(null);
    setIsAiThinking(false);
    setErrorMsg(null);
  };

  const handleUndo = () => {
    game.undo();
    if (gameMode === 'pve' && aiMode && game.turn() !== playerColor) {
        game.undo();
    }
    setFen(game.fen());
    setHistory(game.history());
    const lastMoveHistory = game.history({ verbose: true }).pop();
    setLastMove(lastMoveHistory ? { from: lastMoveHistory.from, to: lastMoveHistory.to } : null);
    setAiReasoning(null);
    
    // Recalculate status
    if (game.isCheck()) setGameStatus('Check!');
    else setGameStatus('');
  };

  const toggleAiMode = () => {
      if (gameMode !== 'pve') return;
      setAiMode(!aiMode);
      handleReset();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (view === 'menu') {
      return <MainMenu onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 transition-all relative">
      
      {/* Global SVG Definitions: Modern Flat Design */}
      <svg className="absolute w-0 h-0">
        <defs>
          {/* White Piece Gradient: Crisp White to Soft Grey */}
          <linearGradient id="gradient-white" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Black Piece Gradient: Slate 600 to Slate 900 */}
          <linearGradient id="gradient-black" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Soft Shadow Filter for pop/depth without skeuomorphism */}
          <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
             <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.35"/>
          </filter>
        </defs>
      </svg>

      {/* Victory Overlay */}
      {game.isCheckmate() && (
        <VictoryOverlay 
            winner={game.turn() === 'w' ? 'Black' : 'White'} 
            onReset={handleReset} 
        />
      )}

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
           <div className="w-full h-full flex flex-col items-center justify-center max-w-[100vh]">
              <div className="w-full aspect-square shadow-2xl">
                <ChessBoard 
                  game={game} 
                  onMove={makeMove} 
                  theme="emerald"
                  isAiThinking={isAiThinking}
                  disabled={(gameMode === 'pve' && game.turn() !== playerColor) || isAiThinking}
                  lastMove={lastMove}
                  isFullscreen={true}
                  onToggleFullscreen={toggleFullscreen}
                  is3D={is3D}
               />
              </div>

              {/* Minimal Floating Controls */}
              <div className="mt-6 flex items-center gap-4 bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-full shadow-2xl z-50">
                 <div className="px-4 font-semibold text-slate-200 border-r border-slate-600 pr-4">
                    {gameStatus || `${game.turn() === 'w' ? "White" : "Black"}'s Turn`}
                 </div>
                 <button onClick={handleUndo} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors" title="Undo">
                    <History size={20} />
                 </button>
                 <button onClick={handleReset} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors" title="Reset">
                    <RotateCcw size={20} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Standard Layout (Hidden when fullscreen) */}
      <div className={clsx("w-full lg:w-80 space-y-6 order-2 lg:order-1", isFullscreen && "hidden")}>
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                 <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400">
                    {is3D ? <Box size={24} /> : (gameMode === 'pve' ? <Trophy size={24} /> : <Users size={24} />)}
                 </div>
                 <h1 className="text-xl font-bold">
                    {is3D ? "3D Experience" : (gameMode === 'pve' ? 'Vs Engine' : 'Pass & Play')}
                 </h1>
             </div>
             
             <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                 {is3D 
                   ? "Immersive 3D view. Engine assistance enabled." 
                   : (gameMode === 'pve' 
                        ? "Play against Stockfish 10. Runs locally in your browser." 
                        : "Local multiplayer mode. Pass the device to your friend.")
                 }
             </p>

             <div className="space-y-4">
                 {gameMode === 'pve' && (
                     <>
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                            <span className="text-sm font-medium text-slate-300">Play vs Engine</span>
                            <button 
                                onClick={toggleAiMode}
                                className={clsx(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                    aiMode ? "bg-teal-600" : "bg-slate-600"
                                )}
                            >
                                <span className={clsx(
                                    "inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ml-1",
                                    aiMode ? "translate-x-5" : "translate-x-0"
                                )} />
                            </button>
                        </div>

                        {aiMode && (
                            <div className="flex gap-2 text-sm">
                                <button 
                                    onClick={() => { setPlayerColor('w'); handleReset(); }}
                                    className={clsx("flex-1 py-2 rounded-lg border transition-all", playerColor === 'w' ? "bg-slate-100 text-slate-900 border-white font-bold" : "border-slate-600 text-slate-400 hover:bg-slate-700")}
                                >
                                    Play White
                                </button>
                                <button 
                                    onClick={() => { setPlayerColor('b'); handleReset(); }}
                                    className={clsx("flex-1 py-2 rounded-lg border transition-all", playerColor === 'b' ? "bg-slate-100 text-slate-900 border-white font-bold" : "border-slate-600 text-slate-400 hover:bg-slate-700")}
                                >
                                    Play Black
                                </button>
                            </div>
                        )}
                     </>
                 )}
                 
                 {gameMode === 'pvp' && (
                     <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30 text-indigo-200 text-sm">
                         Playing in offline mode. Engine analysis is disabled for fair play.
                     </div>
                 )}
                 
                  {/* 3D Toggle available in standard view even if not started as 3D */}
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700 mt-2">
                        <span className="text-sm font-medium text-slate-300">3D View</span>
                        <button 
                            onClick={() => setIs3D(!is3D)}
                            className={clsx(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                is3D ? "bg-purple-600" : "bg-slate-600"
                            )}
                        >
                            <span className={clsx(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ml-1",
                                is3D ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                  </div>
             </div>
         </div>

         {errorMsg && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg text-sm">
                 <span className="font-bold block mb-1">Error:</span>
                 {errorMsg}
             </div>
         )}
      </div>

      {/* Main Board Area (Standard Mode) */}
      <div className={clsx("flex-1 w-full order-1 lg:order-2 flex justify-center", isFullscreen && "hidden")}>
         {/* Wrapper controls the maximum size of the board in standard view */}
         <div className="w-full max-w-[85vh] aspect-square" style={{ perspective: '1200px' }}>
            <ChessBoard 
                game={game} 
                onMove={makeMove} 
                theme="wood"
                isAiThinking={isAiThinking}
                disabled={(gameMode === 'pve' && game.turn() !== playerColor) || isAiThinking}
                lastMove={lastMove}
                isFullscreen={false}
                onToggleFullscreen={toggleFullscreen}
                is3D={is3D}
            />
         </div>
      </div>

      {/* Info Panel */}
      <div className={clsx("w-full lg:w-96 h-[600px] order-3", isFullscreen && "hidden")}>
         <GameInfo 
            game={game} 
            history={history} 
            onReset={handleReset} 
            onUndo={handleUndo}
            onExit={handleBackToMenu}
            aiReasoning={aiReasoning}
            gameStatus={gameStatus}
            isMuted={isMuted}
            onToggleMute={toggleMute}
        />
      </div>

    </div>
  );
};

export default App;
