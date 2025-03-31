"use client";

import { Chessboard } from "react-chessboard";
import { Chess, type Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { GAME_OVER, MOVE } from "@repo/common/constants";
import ChessMoves from "./ChessMoves";
import ChessTimer from "./ChessTimer";
import GameVictory from "./GameVictory";
import GameResult from "./GameResult";
import { Sparkles } from "lucide-react";

interface PlayGameProps {
  socket: WebSocket;
  color: "white" | "black";
}

export function PlayGame({ socket, color }: PlayGameProps) {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<string | null>(null);
  const [activePlayer, setActivePlayer] = useState<"white" | "black">("white"); // White starts
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showLoss, setShowLoss] = useState<boolean>(false);
  const [showDraw, setShowDraw] = useState<boolean>(false);
  const [winner, setWinner] = useState<"white" | "black" | null>(null);

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === MOVE) {
        try {
          console.log(data.move);
          const move = data.move;
          game.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });

          // Update active player after move
          setActivePlayer(game.turn() === "w" ? "white" : "black");
          setFen(game.fen());
        } catch (e) {
          console.log(e);
        }
      }
      if (data.type === GAME_OVER) {
        console.log(data.result);
        setGameStatus(data.result);

        // Determine result based on data
        if (data.result.includes("White wins")) {
          const playerWon = color === "white";
          if (playerWon) {
            setWinner("white");
            setShowVictory(true);
          } else {
            setShowLoss(true);
          }
        } else if (data.result.includes("Black wins")) {
          const playerWon = color === "black";
          if (playerWon) {
            setWinner("black");
            setShowVictory(true);
          } else {
            setShowLoss(true);
          }
        } else if (data.result.includes("Draw")) {
          setShowDraw(true);
        }
      }
    };

    return () => {
      socket.onmessage = null; // Cleanup to prevent memory leaks
    };
  }, [socket, color]);

  function makeAMove(move: { from: string; to: string; promotion: string }) {
    let result;
    try {
      const piece = game.get(move.from as Square);
      if (!piece || piece.color !== color[0]) {
        return false;
      }
      result = game.move(move);
      setLastMove(`${move.from} → ${move.to}`);

      // Update active player after move
      setActivePlayer(game.turn() === "w" ? "white" : "black");
      setFen(game.fen());

      // Check if game is over after move
      if (game.isGameOver()) {
        // For demo purposes, let's set a winner when game is over
        if (game.isCheckmate()) {
          // The player who just moved won
          const winningColor = game.turn() === "w" ? "black" : "white";
          const playerWon = winningColor === color;

          if (playerWon) {
            setWinner(winningColor);
            setShowVictory(true);
          } else {
            setShowLoss(true);
          }

          setGameStatus(
            `${winningColor === "white" ? "White" : "Black"} wins by checkmate`,
          );
        } else if (game.isDraw()) {
          setShowDraw(true);
          setGameStatus("Game ended in a draw");
        } else {
          setGameStatus("Game over");
        }
      }
    } catch (error: any) {
      console.log(error.message);
      console.log("Invalid move", error);
      return false;
    }
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    console.log(`Dropped: ${sourceSquare} to ${targetSquare}`);
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move) {
      socket.send(JSON.stringify({ type: MOVE, move }));
      return true;
    } else {
      console.log("Invalid move");
      return false;
    }
  }

  // For demo purposes - functions to trigger different result animations
  const triggerVictory = (winnerColor: "white" | "black") => {
    setWinner(winnerColor);
    setShowVictory(true);
  };

  const triggerLoss = () => {
    setShowLoss(true);
  };

  const triggerDraw = () => {
    setShowDraw(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E9FFD1] to-[#FFFAC0] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-full">
            <div className="flex justify-center">
              <Sparkles className="text-[#CDDC39] h-8 w-8 animate-pulse" />
              <Sparkles className="text-[#8BC34A] h-8 w-8 animate-pulse delay-100" />
              <Sparkles className="text-[#CDDC39] h-8 w-8 animate-pulse delay-200" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#558B2F] to-[#827717] mb-2 pt-6">
            Chess Battle Arena
          </h1>
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] text-white font-medium shadow-lg">
            Playing as <span className="font-bold">{color}</span>
          </div>
        </div>

        {/* Game Status */}
        {gameStatus && (
          <div className="text-center mb-6">
            <div className="inline-block px-6 py-2 rounded-lg bg-[#8BC34A]/20 border-2 border-[#8BC34A] text-[#33691E] font-bold">
              {gameStatus}
            </div>
          </div>
        )}

        {/* Last Move */}
        {lastMove && (
          <div className="text-center mb-6 animate-fadeIn">
            <div className="inline-block px-4 py-1 rounded-full bg-[#CDDC39]/30 text-[#827717] font-medium">
              Last move: {lastMove}
            </div>
          </div>
        )}

        {/* Demo buttons (for testing result animations) */}
        <div className="text-center mb-6">
          <button
            onClick={() => triggerVictory(color)}
            className="px-4 py-2 bg-white text-[#558B2F] rounded-lg border border-[#8BC34A] mr-4 hover:bg-[#F9FBE7]"
          >
            Demo: Victory
          </button>
          <button
            onClick={triggerLoss}
            className="px-4 py-2 bg-[#33691E] text-white rounded-lg border border-[#8BC34A] mr-4 hover:bg-[#558B2F]"
          >
            Demo: Loss
          </button>
          <button
            onClick={triggerDraw}
            className="px-4 py-2 bg-[#CDDC39] text-[#33691E] rounded-lg border border-[#8BC34A] hover:bg-[#DCEDC8]"
          >
            Demo: Draw
          </button>
        </div>

        {/* Game Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mt-4">
          {/* Left Column - Timer and Chessboard */}
          <div className="flex flex-col gap-6 items-center">
            {/* Timer */}
            <ChessTimer
              initialTimeInMinutes={15}
              activePlayer={activePlayer}
              gameStatus={gameStatus}
            />

            {/* Chessboard Container */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] rounded-xl opacity-70 blur-lg"></div>
              <div className="relative bg-white p-3 rounded-xl shadow-xl">
                <Chessboard
                  position={fen}
                  onPieceDrop={onDrop}
                  boardWidth={380}
                  boardOrientation={color}
                  customBoardStyle={{
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  customDarkSquareStyle={{ backgroundColor: "#558B2F" }}
                  customLightSquareStyle={{ backgroundColor: "#F9FBE7" }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Moves Container */}
          <div className="w-full md:w-auto">
            <ChessMoves moves={game.history()} title="Battle Moves" />
          </div>
        </div>
      </div>

      {/* Result Animations */}
      {showVictory && winner && (
        <GameVictory winner={winner} onComplete={() => setShowVictory(false)} />
      )}

      {showLoss && (
        <GameResult
          type="loss"
          playerColor={color}
          onComplete={() => setShowLoss(false)}
        />
      )}

      {showDraw && (
        <GameResult
          type="draw"
          playerColor={color}
          onComplete={() => setShowDraw(false)}
        />
      )}
    </div>
  );
}
