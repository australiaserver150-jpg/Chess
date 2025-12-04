import { AIAnalysisResult } from "../types";
import { Chess } from "chess.js";

let engine: Worker | null = null;
let isEngineReady = false;

// We use the asm.js version of stockfish because loading the WASM version from a Blob URL 
// (created via fetch) typically fails to find the relative .wasm file.
// This URL points to a stable, self-contained version.
const STOCKFISH_URL = "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.0/stockfish.js";

async function initEngine() {
  if (engine) return;

  try {
    const response = await fetch(STOCKFISH_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch Stockfish: ${response.statusText}`);
    }
    const scriptContent = await response.text();
    const blob = new Blob([scriptContent], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    
    engine = new Worker(workerUrl);
    
    // Setup listener for global engine events (like ready)
    engine.onmessage = (event) => {
        const line = typeof event.data === 'string' ? event.data : '';
        if (line === 'readyok') {
            isEngineReady = true;
        }
    };

    engine.postMessage("uci");
    
    // Give it a moment to initialize
    await new Promise(resolve => setTimeout(resolve, 200)); 
    engine.postMessage("isready");

  } catch (e) {
    console.error("Failed to initialize Stockfish engine:", e);
    throw e;
  }
}

export const getGeminiMove = async (
  fen: string,
  validMoves: string[],
  playerColor: 'w' | 'b'
): Promise<AIAnalysisResult> => {
    
    if (!engine) {
        await initEngine();
    }

    return new Promise((resolve, reject) => {
        if (!engine) {
            reject(new Error("Engine failed to initialize"));
            return;
        }

        let bestMoveUci = "";
        let evaluation = "Calculating...";

        // Create a listener specific to this move request
        const listener = (event: MessageEvent) => {
            const line = typeof event.data === 'string' ? event.data : '';
            
            if (!line) return;

            // Parse evaluation
            // Example: info depth 10 ... score cp 50 ...
            if (line.startsWith("info") && line.includes("score")) {
                const parts = line.split(" ");
                let scoreIdx = parts.indexOf("score");
                if (scoreIdx !== -1 && parts.length > scoreIdx + 2) {
                    const type = parts[scoreIdx + 1];
                    const val = parseInt(parts[scoreIdx + 2]);
                    
                    if (!isNaN(val)) {
                        if (type === 'mate') {
                            evaluation = `Mate in ${Math.abs(val)}`;
                        } else if (type === 'cp') {
                             const sign = val > 0 ? '+' : '';
                             evaluation = `Score: ${sign}${val / 100}`;
                        }
                    }
                }
            }

            // Parse Best Move
            if (line.startsWith("bestmove")) {
                const parts = line.split(" ");
                if (parts.length >= 2) {
                    bestMoveUci = parts[1];
                    
                    // Cleanup listener
                    engine!.removeEventListener('message', listener);
                    
                    // Convert UCI (e2e4) to SAN (e4)
                    try {
                        const tempGame = new Chess(fen);
                        const from = bestMoveUci.substring(0, 2);
                        const to = bestMoveUci.substring(2, 4);
                        const promotion = bestMoveUci.length > 4 ? bestMoveUci.substring(4, 5) : undefined;

                        const move = tempGame.move({ from, to, promotion });
                        
                        resolve({
                            bestMove: move.san,
                            reasoning: evaluation
                        });
                    } catch (err) {
                        // Fallback: return raw UCI if SAN conversion fails
                         resolve({
                            bestMove: bestMoveUci, 
                            reasoning: evaluation
                        });
                    }
                }
            }
        };

        engine.addEventListener('message', listener);
        engine.postMessage(`position fen ${fen}`);
        engine.postMessage("go depth 12"); 
    });
};