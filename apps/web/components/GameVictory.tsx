"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Crown, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface GameVictoryProps {
  winner: "white" | "black";
  onComplete?: () => void;
  durationMs?: number;
}

export default function GameVictory({
  winner,
  onComplete,
  durationMs = 3500,
}: GameVictoryProps) {
  const [visible, setVisible] = useState(true);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Colors based on our anime-inspired green and yellow theme
  const confettiColors = [
    "#8BC34A",
    "#CDDC39",
    "#F9FBE7",
    "#558B2F",
    "#827717",
    "#DCEDC8",
  ];

  useEffect(() => {
    // Create confetti instance
    let confettiInstance: confetti.CreateTypes | null = null;

    if (confettiCanvasRef.current) {
      confettiInstance = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });

      // Fire initial burst
      confettiInstance({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors,
        shapes: ["square", "circle"],
        scalar: 1.2,
      });

      // Create ribbon effect
      const ribbonInterval = setInterval(() => {
        confettiInstance?.({
          particleCount: 20,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: confettiColors,
        });

        confettiInstance?.({
          particleCount: 20,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: confettiColors,
        });
      }, 150);

      // Set timeout to hide component
      const timeout = setTimeout(() => {
        clearInterval(ribbonInterval);
        setVisible(false);
        if (onComplete) onComplete();
      }, durationMs);

      return () => {
        clearInterval(ribbonInterval);
        clearTimeout(timeout);
        confettiInstance?.reset();
      };
    }
  }, [durationMs, onComplete, confettiColors]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Victory message */}
      <div className="relative z-10 animate-bounce-in">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] rounded-xl opacity-70 blur-lg animate-pulse"></div>

          {/* Content */}
          <div className="relative bg-white/90 rounded-xl p-8 shadow-2xl border-2 border-[#8BC34A] text-center max-w-md">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#CDDC39] to-[#8BC34A] rounded-full opacity-70 blur-md animate-pulse"></div>
                <div className="relative bg-white rounded-full p-3 shadow-lg border-2 border-[#CDDC39]">
                  {winner === "white" ? (
                    <Crown className="h-10 w-10 text-[#CDDC39]" />
                  ) : (
                    <Crown className="h-10 w-10 text-[#33691E]" />
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-6 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#558B2F] to-[#827717]">
              Victory!
            </h2>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-[#CDDC39]" />
              <p className="text-xl font-semibold">
                {winner === "white" ? (
                  <span className="text-[#33691E]">White</span>
                ) : (
                  <span className="text-[#33691E]">Black</span>
                )}
                <span className="text-[#558B2F]"> wins the match!</span>
              </p>
              <Sparkles className="h-5 w-5 text-[#CDDC39]" />
            </div>

            <div className="flex justify-center my-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] rounded-full opacity-70 blur-sm"></div>
                <div className="relative bg-[#F9FBE7] p-4 rounded-full">
                  <Trophy
                    className={`h-12 w-12 ${winner === "white" ? "text-[#CDDC39]" : "text-[#33691E]"}`}
                  />
                </div>
              </div>
            </div>

            <p className="text-[#558B2F] mt-4">
              Congratulations on your brilliant victory!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
