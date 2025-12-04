
import React, { useState, useEffect } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { PIECE_SVGS, BOARD_THEMES } from '../constants';
import { PieceType, PieceColor, Theme } from '../types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ChessBoardProps {
  game: Chess;
  onMove: (move: { from: string; to: string; promotion?: string }) => boolean;
  theme?: string;
  isAiThinking: boolean;
  disabled: boolean;
  lastMove: { from: string; to: string } | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  is3D?: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  game, 
  onMove, 
  theme = 'emerald', 
  isAiThinking, 
  disabled,
  lastMove,
  isFullscreen,
  onToggleFullscreen,
  is3D = false
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const boardTheme = BOARD_THEMES[theme] || BOARD_THEMES.emerald;

  // Clear selection if game updates externally (e.g. AI move)
  useEffect(() => {
    setSelectedSquare(null);
    setValidMoves([]);
  }, [game.fen()]);

  const getPieceAt = (square: Square) => {
    return game.get(square);
  };

  const handleSquareClick = (square: Square) => {
    if (disabled || isAiThinking) return;

    // If clicking the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    const piece = getPieceAt(square);
    const isPieceMine = piece && piece.color === game.turn();

    // If a square is selected, try to move to the clicked square
    if (selectedSquare) {
      // Check if clicked square is a valid destination
      const move = validMoves.find(m => m.to === square);
      
      if (move) {
        // Execute move
        onMove({ from: selectedSquare, to: square, promotion: 'q' }); // Auto-promote to queen for simplicity in this UI
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
      
      // If clicking another of my pieces, switch selection
      if (isPieceMine) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setValidMoves(moves);
        return;
      }

      // If clicking empty square or enemy piece that isn't a valid move, deselect
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // If no square selected, select if it's my piece
      if (isPieceMine) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setValidMoves(moves);
      }
    }
  };

  const isSquareHighlighted = (sq: string) => {
    return selectedSquare === sq || (lastMove && (lastMove.from === sq || lastMove.to === sq));
  };
  
  const isValidDestination = (sq: string) => {
    return validMoves.some(m => m.to === sq);
  };

  const isCheckSquare = (sq: string) => {
    const piece = getPieceAt(sq as Square);
    if (!piece || piece.type !== 'k') return false;
    return game.inCheck() && piece.color === game.turn();
  };

  // Helper to get coordinates for animation
  const getSquareCoords = (sq: string) => {
    const fileIdx = sq.charCodeAt(0) - 97; // a=0, h=7
    const rankIdx = 8 - parseInt(sq[1]);   // 8=0, 1=7
    return { x: fileIdx, y: rankIdx };
  };

  // Calculate animation origin for a piece arriving at 'square'
  const getAnimationOrigin = (square: string, piece: { type: PieceType; color: PieceColor } | null) => {
    if (!lastMove || !piece) return null;

    let fromSq = lastMove.from;
    let toSq = lastMove.to;

    // Standard Move Animation
    if (square === toSq) {
      const from = getSquareCoords(fromSq);
      const to = getSquareCoords(toSq);
      return { 
        x: (from.x - to.x) * 100 + '%', 
        y: (from.y - to.y) * 100 + '%' 
      };
    }

    // Castling Animation Support (Rook Move)
    // Detect if the last move was a King castle
    if (getPieceAt(toSq as Square)?.type === 'k' && Math.abs(getSquareCoords(fromSq).x - getSquareCoords(toSq).x) > 1) {
        // White King Side: e1->g1. Rook h1->f1
        if (fromSq === 'e1' && toSq === 'g1' && square === 'f1') {
             return { x: '200%', y: '0%' }; // From h1 (file 7) to f1 (file 5) -> +2 squares diff
        }
        // White Queen Side: e1->c1. Rook a1->d1
        if (fromSq === 'e1' && toSq === 'c1' && square === 'd1') {
             return { x: '-300%', y: '0%' }; // From a1 (0) to d1 (3) -> -3 squares
        }
        // Black King Side: e8->g8. Rook h8->f8
        if (fromSq === 'e8' && toSq === 'g8' && square === 'f8') {
             return { x: '200%', y: '0%' };
        }
        // Black Queen Side: e8->c8. Rook a8->d8
        if (fromSq === 'e8' && toSq === 'c8' && square === 'd8') {
             return { x: '-300%', y: '0%' };
        }
    }

    return null;
  };

  return (
    <div 
      className={clsx(
        "relative select-none touch-none w-full h-full mx-auto shadow-2xl rounded-lg border-4 border-slate-800 transition-transform duration-700 ease-in-out",
        !is3D && "overflow-hidden"
      )}
      style={is3D ? { 
        transform: 'rotateX(35deg) scale(0.9)', 
        transformStyle: 'preserve-3d',
        boxShadow: '0 50px 80px -20px rgba(0,0,0,0.7)'
      } : {}}
    >
      
      {/* Fullscreen Toggle */}
      {onToggleFullscreen && (
        <button 
          onClick={onToggleFullscreen}
          className="absolute top-2 right-2 z-30 p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-sm transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          style={is3D ? { transform: 'rotateX(-35deg) translateY(-20px)' } : {}}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      )}

      {/* Board Grid */}
      <div 
        className="grid grid-cols-8 grid-rows-8 h-full w-full"
        style={is3D ? { transformStyle: 'preserve-3d' } : {}}
      >
        {RANKS.map((rank, rankIndex) => (
          FILES.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            const piece = getPieceAt(square);
            const isHighlighted = isSquareHighlighted(square);
            const isDest = isValidDestination(square);
            const isKingInCheck = isCheckSquare(square);

            const baseColor = isLight ? boardTheme.lightSquare : boardTheme.darkSquare;
            const animOrigin = getAnimationOrigin(square, piece);

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={clsx(
                  "relative w-full h-full flex items-center justify-center cursor-pointer",
                  baseColor,
                  isHighlighted && boardTheme.highlight,
                  isKingInCheck && "bg-red-500/80 ring-inset ring-4 ring-red-600",
                )}
                style={is3D ? { transformStyle: 'preserve-3d' } : {}}
              >
                 {/* Rank/File Labels - Hide in 3D for cleaner look or adjust position */}
                 {!is3D && fileIndex === 0 && (
                  <span className={clsx("absolute top-0.5 left-0.5 text-[10px] sm:text-xs font-bold select-none", isLight ? "text-slate-600" : "text-slate-200")}>
                    {rank}
                  </span>
                )}
                {!is3D && rankIndex === 7 && (
                  <span className={clsx("absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-bold select-none", isLight ? "text-slate-600" : "text-slate-200")}>
                    {file}
                  </span>
                )}

                {/* Valid Move Marker */}
                {isDest && !piece && (
                   <div 
                    className={clsx("w-1/3 h-1/3 rounded-full opacity-50", boardTheme.validMove.replace('bg-', 'bg-black'))} 
                    style={is3D ? { transform: 'rotateX(-35deg) scale(1.2)' } : {}}
                   />
                )}
                {isDest && piece && (
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-black/20" 
                      style={is3D ? { transform: 'rotateX(-35deg) scale(1.1) translateY(10%)' } : {}}
                    />
                )}

                {/* Piece Rendering */}
                <div 
                  className={clsx("w-full h-full p-[2%] pointer-events-none", animOrigin ? "z-20" : "z-10")}
                  style={is3D ? { 
                    transform: 'rotateX(-35deg) translateY(-25%) scale(1.3)', 
                    transformOrigin: '50% 90%',
                    filter: 'drop-shadow(0 10px 5px rgba(0,0,0,0.4))'
                  } : {}}
                >
                    <AnimatePresence mode='popLayout'>
                        {piece && (
                            <motion.div
                                key={`${piece.type}-${piece.color}-${square}`} 
                                initial={animOrigin ? { x: animOrigin.x, y: animOrigin.y, scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                                animate={{ x: '0%', y: '0%', scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 260, 
                                    damping: 20,
                                    mass: 0.8
                                }}
                                className="w-full h-full"
                            >
                                <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-lg">
                                    {PIECE_SVGS[piece.color][piece.type]}
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
              </div>
            );
          })
        ))}
      </div>
      
      {isAiThinking && (
        <div 
            className="absolute inset-0 z-30 bg-black/10 backdrop-blur-[1px] flex items-center justify-center"
            style={is3D ? { transform: 'translateZ(50px) rotateX(-35deg)' } : {}}
        >
            <div className="bg-white/90 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-pulse">
                <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}/>
                <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}/>
                <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}/>
                <span className="font-semibold text-indigo-900">Engine thinking...</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
