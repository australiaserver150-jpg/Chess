
import React from 'react';
import { Theme } from './types';

export const BOARD_THEMES: Record<string, Theme> = {
  emerald: {
    lightSquare: 'bg-[#eeeed2]',
    darkSquare: 'bg-[#769656]',
    highlight: 'bg-yellow-200/50',
    validMove: 'bg-black/10'
  },
  slate: {
    lightSquare: 'bg-slate-300',
    darkSquare: 'bg-slate-600',
    highlight: 'bg-blue-400/50',
    validMove: 'bg-black/10'
  },
  wood: {
    lightSquare: 'bg-[#eecfa1]',
    darkSquare: 'bg-[#8b4513]',
    highlight: 'bg-yellow-400/40',
    validMove: 'bg-black/20'
  }
};

// Modern, Flat, Bold, High-Contrast Chess Pieces
// Perfectly centered in 45x45 viewBox
export const PIECE_SVGS: Record<string, Record<string, React.ReactNode>> = {
  w: {
    p: (
      <g filter="url(#soft-shadow)">
        <path 
          d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.89 2.41 5.06-1.2 1.08-1.91 2.72-1.91 4.44V32h17v-1.5c0-1.72-.71-3.36-1.91-4.44C33.06 24.89 34 23.03 34 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" 
          fill="url(#gradient-white)" 
          stroke="#1e293b" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    ),
    r: (
      <g filter="url(#soft-shadow)">
        <path 
          d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" 
          transform="translate(0, -2)"
          fill="url(#gradient-white)" 
          stroke="#1e293b" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M34 14l-3 3H14l-3-3" 
          transform="translate(0, -2)"
          fill="url(#gradient-white)" 
          stroke="#1e293b" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M31 17v12.5H14V17" 
          transform="translate(0, -2)"
          fill="url(#gradient-white)" 
          stroke="#1e293b" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M31 29.5l1.5 2.5h-20l1.5-2.5" 
          transform="translate(0, -2)"
          fill="url(#gradient-white)" 
          stroke="#1e293b" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    ),
    n: (
      <g filter="url(#soft-shadow)">
        <path 
          d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" 
          transform="translate(-1, -2)"
          fill="url(#gradient-white)" 
          stroke="#1e293b" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19-2.94-1-3-1 0-4.003-2.6-4-1 0-3 2.646-6.12 5-9 3-5 7-3 11-4z" 
          transform="translate(-1, -2)"
          fill="url(#gradient-white)" 
          stroke="#1e293b" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    ),
    b: (
      <g filter="url(#soft-shadow)">
        <g transform="translate(0, 0)">
          <path 
            d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45V30H9v6z" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-15-2.5-15 0 0 0-.5.5 0 2z" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M22.5 9c-2.1 0-4.3 1.3-6 3 0 0 0 1 .5 2 .5 1 .5 1.5 1 2.5.5 1 2.25 4.3 2.5 5.7.2 1.1 1 1.5 2 1.5s1.75-.4 2-1.5c.25-1.4 2-4.7 2.5-5.7.5-1 .5-1.5 1-2.5.5-1 .5-2 .5-2-1.7-1.7-3.9-3-6-3z" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </g>
    ),
    q: (
      <g filter="url(#soft-shadow)">
        <g transform="translate(0, 0)">
          <path 
            d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
          />
          <path 
            d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11z" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 4.5 3 4.5s2 1 2.5 2.5c.5 1.5.5 2.5.5 2.5s8.5-.5 13 0c0 0 0-1 .5-2.5s2-2 2.5-2.5c0 0 2-2 3-4.5 1-2 2.5-2 2.5-4" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M9 26c0-1.5 6-2 6-2s11.5-4 13-4 11.5 2 13 4c0 0 6 .5 6 2" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </g>
    ),
    k: (
      <g filter="url(#soft-shadow)">
        <g transform="translate(0, 0)">
          <path 
            d="M22.5 11.63V6M20 8h5" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
          />
          <path 
            d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-5 2l-5 4h-13l-5-4s-1-3-5-2c-3 6 6 10.5 6 10.5v7" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" 
            fill="url(#gradient-white)" 
            stroke="#1e293b" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </g>
    )
  },
  b: {
    p: (
      <g filter="url(#soft-shadow)">
        <path 
          d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.89 2.41 5.06-1.2 1.08-1.91 2.72-1.91 4.44V32h17v-1.5c0-1.72-.71-3.36-1.91-4.44C33.06 24.89 34 23.03 34 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" 
          fill="url(#gradient-black)" 
          stroke="#000000" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    ),
    r: (
       <g filter="url(#soft-shadow)">
        <path 
          d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" 
          transform="translate(0, -2)"
          fill="url(#gradient-black)" 
          stroke="#000000" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M34 14l-3 3H14l-3-3" 
          transform="translate(0, -2)"
          fill="url(#gradient-black)" 
          stroke="#000000" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M31 17v12.5H14V17" 
          transform="translate(0, -2)"
          fill="url(#gradient-black)" 
          stroke="#000000" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M31 29.5l1.5 2.5h-20l1.5-2.5" 
          transform="translate(0, -2)"
          fill="url(#gradient-black)" 
          stroke="#000000" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    ),
    n: (
      <g filter="url(#soft-shadow)">
        <path 
          d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" 
          transform="translate(-1, -2)"
          fill="url(#gradient-black)" 
          stroke="#000000" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19-2.94-1-3-1 0-4.003-2.6-4-1 0-3 2.646-6.12 5-9 3-5 7-3 11-4z" 
          transform="translate(-1, -2)"
          fill="url(#gradient-black)" 
          stroke="#000000" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    ),
    b: (
      <g filter="url(#soft-shadow)">
        <g transform="translate(0, 0)">
          <path 
            d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45V30H9v6z" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-15-2.5-15 0 0 0-.5.5 0 2z" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M22.5 9c-2.1 0-4.3 1.3-6 3 0 0 0 1 .5 2 .5 1 .5 1.5 1 2.5.5 1 2.25 4.3 2.5 5.7.2 1.1 1 1.5 2 1.5s1.75-.4 2-1.5c.25-1.4 2-4.7 2.5-5.7.5-1 .5-1.5 1-2.5.5-1 .5-2 .5-2-1.7-1.7-3.9-3-6-3z" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </g>
    ),
    q: (
      <g filter="url(#soft-shadow)">
        <g transform="translate(0, 0)">
          <path 
            d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
          />
          <path 
            d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11z" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 4.5 3 4.5s2 1 2.5 2.5c.5 1.5.5 2.5.5 2.5s8.5-.5 13 0c0 0 0-1 .5-2.5s2-2 2.5-2.5c0 0 2-2 3-4.5 1-2 2.5-2 2.5-4" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M9 26c0-1.5 6-2 6-2s11.5-4 13-4 11.5 2 13 4c0 0 6 .5 6 2" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </g>
    ),
    k: (
      <g filter="url(#soft-shadow)">
        <g transform="translate(0, 0)">
          <path 
            d="M22.5 11.63V6M20 8h5" 
            fill="none" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
          />
          <path 
            d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-5 2l-5 4h-13l-5-4s-1-3-5-2c-3 6 6 10.5 6 10.5v7" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" 
            fill="url(#gradient-black)" 
            stroke="#000000" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </g>
    )
  }
};
