"use client";

import { useState, useEffect } from "react";
import { Clock, Pause } from "lucide-react";

interface ChessTimerProps {
  initialTimeInMinutes?: number;
  activePlayer: "white" | "black" | null;
  gameStatus?: string | null;
}

export default function ChessTimer({
  initialTimeInMinutes = 10,
  activePlayer,
  gameStatus,
}: ChessTimerProps) {
  const initialTimeInSeconds = initialTimeInMinutes * 60;
  const [whiteTime, setWhiteTime] = useState(initialTimeInSeconds);
  const [blackTime, setBlackTime] = useState(initialTimeInSeconds);

  // Format seconds to mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    if (gameStatus) return; // Stop timer if game is over

    let interval: NodeJS.Timeout | null = null;

    if (activePlayer) {
      interval = setInterval(() => {
        if (activePlayer === "white") {
          setWhiteTime((prev) => Math.max(0, prev - 1));
        } else {
          setBlackTime((prev) => Math.max(0, prev - 1));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activePlayer, gameStatus]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-[380px]">
      {/* Black Player Timer */}
      <div
        className={`relative rounded-xl overflow-hidden ${activePlayer === "black" ? "ring-2 ring-[#CDDC39] ring-offset-2" : ""}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#33691E] to-[#558B2F] opacity-80"></div>
        <div className="relative p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black w-6 h-6 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">♚</span>
            </div>
            <span className="font-medium text-white">Black</span>
          </div>

          <div className="flex items-center gap-2">
            {activePlayer === "black" ? (
              <Clock className="h-5 w-5 text-[#CDDC39] animate-pulse" />
            ) : (
              <Pause className="h-5 w-5 text-white/70" />
            )}
            <span
              className={`font-mono text-xl font-bold ${blackTime < 60 ? "text-red-300" : "text-white"}`}
            >
              {formatTime(blackTime)}
            </span>
          </div>
        </div>
        {activePlayer === "black" && (
          <div className="h-1 bg-[#CDDC39] animate-pulse"></div>
        )}
      </div>

      {/* White Player Timer */}
      <div
        className={`relative rounded-xl overflow-hidden ${activePlayer === "white" ? "ring-2 ring-[#CDDC39] ring-offset-2" : ""}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9FBE7] to-[#DCEDC8] opacity-90"></div>
        <div className="relative p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center border border-gray-200">
              <span className="text-black text-xs">♚</span>
            </div>
            <span className="font-medium text-[#33691E]">White</span>
          </div>

          <div className="flex items-center gap-2">
            {activePlayer === "white" ? (
              <Clock className="h-5 w-5 text-[#8BC34A] animate-pulse" />
            ) : (
              <Pause className="h-5 w-5 text-[#558B2F]/70" />
            )}
            <span
              className={`font-mono text-xl font-bold ${whiteTime < 60 ? "text-red-500" : "text-[#33691E]"}`}
            >
              {formatTime(whiteTime)}
            </span>
          </div>
        </div>
        {activePlayer === "white" && (
          <div className="h-1 bg-[#8BC34A] animate-pulse"></div>
        )}
      </div>
    </div>
  );
}
