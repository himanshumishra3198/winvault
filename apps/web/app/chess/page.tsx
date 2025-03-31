"use client";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { Chessboard } from "react-chessboard";
import {
  Sparkles,
  Cpu,
  Users,
  Trophy,
  ChevronRight,
  Star,
  Swords,
  Crown,
} from "lucide-react";

export default function ChessPage() {
  const [gameMode, setGameMode] = useState<"computer" | "online" | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [boardPosition, setBoardPosition] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );

  // Randomly change board position every few seconds for visual effect
  useEffect(() => {
    const positions = [
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", // After 1.e4
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", // After 1...e5
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", // After 2.Nf3
      "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", // After 2...Nc6
    ];

    const interval = setInterval(() => {
      let randomPosition =
        positions[Math.floor(Math.random() * positions.length)];

      if (randomPosition) {
        setBoardPosition(randomPosition);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#1A2F14] to-[#0F1A0A] overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#CDDC39]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-[#8BC34A]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-[#CDDC39]/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#8BC34A]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Chess pieces silhouettes in background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-[10%] text-white text-9xl">♞</div>
        <div className="absolute bottom-20 right-[15%] text-white text-9xl">
          ♜
        </div>
        <div className="absolute top-[40%] right-[10%] text-white text-9xl">
          ♝
        </div>
        <div className="absolute bottom-[30%] left-[20%] text-white text-9xl">
          ♛
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-full">
            <div className="flex justify-center">
              <Sparkles className="text-[#CDDC39] h-8 w-8 animate-pulse" />
              <Sparkles className="text-[#8BC34A] h-8 w-8 animate-pulse delay-100" />
              <Sparkles className="text-[#CDDC39] h-8 w-8 animate-pulse delay-200" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] mb-2 pt-6">
            Chess
          </h1>
          <p className="text-[#AED581] text-xl max-w-2xl mx-auto">
            Challenge your mind in the ultimate game of strategy and skill
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-6xl">
          {/* Left side - Chessboard */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute -inset-3 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] rounded-xl opacity-70 blur-lg"></div>
              <div className="relative bg-white p-3 rounded-xl shadow-2xl">
                <Chessboard
                  id="HomeChessboard"
                  position={boardPosition}
                  boardWidth={Math.min(
                    400,
                    typeof window !== "undefined"
                      ? window.innerWidth - 40
                      : 400,
                  )}
                  customDarkSquareStyle={{ backgroundColor: "#558B2F" }}
                  customLightSquareStyle={{ backgroundColor: "#F9FBE7" }}
                  customBoardStyle={{
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center bg-[#33691E]/30 px-4 py-2 rounded-lg">
                <Trophy className="h-5 w-5 text-[#CDDC39] mr-2" />
                <span className="text-[#AED581]">Leaderboards</span>
              </div>
              <div className="flex items-center bg-[#33691E]/30 px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-[#CDDC39] mr-2" />
                <span className="text-[#AED581]">Daily Puzzles</span>
              </div>
              <div className="flex items-center bg-[#33691E]/30 px-4 py-2 rounded-lg">
                <Crown className="h-5 w-5 text-[#CDDC39] mr-2" />
                <span className="text-[#AED581]">Tournaments</span>
              </div>
            </div>
          </div>

          {/* Right side - Game options */}
          <div className="flex flex-col items-center lg:items-start space-y-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] rounded-lg opacity-70 blur-sm"></div>
              <h2 className="relative text-2xl font-bold text-white bg-[#33691E] px-6 py-2 rounded-lg">
                Choose Your Battle
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
              <button
                className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                  gameMode === "computer"
                    ? "border-[#CDDC39] bg-[#33691E]"
                    : "border-[#558B2F] bg-[#1A2F14] hover:bg-[#33691E]/50"
                }`}
                onClick={() => setGameMode("computer")}
              >
                <div className="bg-[#CDDC39]/20 p-3 rounded-full mr-4">
                  <Cpu className="h-8 w-8 text-[#CDDC39]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#CDDC39] font-bold text-lg">
                    vs Computer
                  </h3>
                  <p className="text-[#AED581] text-sm">Challenge the AI</p>
                </div>
              </button>

              <button
                className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                  gameMode === "online"
                    ? "border-[#CDDC39] bg-[#33691E]"
                    : "border-[#558B2F] bg-[#1A2F14] hover:bg-[#33691E]/50"
                }`}
                onClick={() => setGameMode("online")}
              >
                <div className="bg-[#CDDC39]/20 p-3 rounded-full mr-4">
                  <Users className="h-8 w-8 text-[#CDDC39]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#CDDC39] font-bold text-lg">
                    vs Player
                  </h3>
                  <p className="text-[#AED581] text-sm">Play online</p>
                </div>
              </button>
            </div>

            {/* Difficulty selection for computer mode */}
            {gameMode === "computer" && (
              <div className="w-full max-w-xl bg-[#1A2F14] p-6 rounded-xl border-2 border-[#558B2F] animate-fadeIn">
                <h3 className="text-[#CDDC39] font-bold mb-4 flex items-center">
                  <Swords className="h-5 w-5 mr-2" />
                  Select Difficulty
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      className={`py-2 px-4 rounded-lg capitalize transition-all ${
                        difficulty === level
                          ? "bg-[#8BC34A] text-[#33691E] font-bold"
                          : "bg-[#33691E]/30 text-[#AED581] hover:bg-[#33691E]/50"
                      }`}
                      onClick={() => setDifficulty(level as any)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Play button */}
            <Button
              asChild
              className={`mt-6 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] hover:from-[#7CB342] hover:to-[#C0CA33] text-[#33691E] font-bold text-lg px-8 py-6 rounded-xl shadow-lg transition-all ${
                !gameMode
                  ? "opacity-50 pointer-events-none"
                  : "animate-pulse-slow"
              }`}
              disabled={!gameMode}
            >
              <Link
                href={
                  gameMode === "computer"
                    ? `/chess/game?mode=computer&difficulty=${difficulty}`
                    : "/chess/game?mode=online"
                }
              >
                <div className="flex items-center">
                  Start Game
                  <ChevronRight className="ml-2 h-5 w-5" />
                </div>
              </Link>
            </Button>

            {/* Game features */}
            {/* <div className="w-full max-w-xl mt-6">
              <div className="text-[#AED581] space-y-3">
                <div className="flex items-start">
                  <div className="bg-[#33691E] rounded-full p-1 mr-3 mt-1">
                    <Sparkles className="h-4 w-4 text-[#CDDC39]" />
                  </div>
                  <p>Beautiful anime-styled interface with vibrant visuals</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#33691E] rounded-full p-1 mr-3 mt-1">
                    <Sparkles className="h-4 w-4 text-[#CDDC39]" />
                  </div>
                  <p>Multiple difficulty levels to match your skill</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#33691E] rounded-full p-1 mr-3 mt-1">
                    <Sparkles className="h-4 w-4 text-[#CDDC39]" />
                  </div>
                  <p>Real-time online matches with players worldwide</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
