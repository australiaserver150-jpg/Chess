import { Move } from 'chess.js';

export enum PlayerType {
  HUMAN = 'HUMAN',
  AI = 'AI'
}

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  history: string[];
}

export interface AIAnalysisResult {
  bestMove: string;
  reasoning: string;
}

export interface Theme {
  lightSquare: string;
  darkSquare: string;
  highlight: string;
  validMove: string;
}

// Map standard chess.js piece types to our UI expectations
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface PieceProps {
  type: PieceType;
  color: PieceColor;
}