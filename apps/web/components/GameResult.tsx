"use client";

import { useEffect, useRef, useState } from "react";
import { Scale, X, Handshake, Frown, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

type ResultType = "loss" | "draw";

interface GameResultProps {
  type: ResultType;
  playerColor: "white" | "black";
  onComplete?: () => void;
  durationMs?: number;
}

export default function GameResult({
  type,
  playerColor,
  onComplete,
  durationMs = 3000,
}: GameResultProps) {
  const [visible, setVisible] = useState(true);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Colors based on our anime-inspired green and yellow theme
  const confettiColors =
    type === "draw"
      ? ["#8BC34A", "#CDDC39", "#F9FBE7", "#558B2F", "#DCEDC8"]
      : ["#9E9E9E", "#E0E0E0", "#F5F5F5", "#BDBDBD"];

  useEffect(() => {
    // Create confetti instance
    let confettiInstance: confetti.CreateTypes | null = null;

    if (confettiCanvasRef.current) {
      confettiInstance = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });

      if (type === "draw") {
        // For draw - gentle confetti from top
        confettiInstance({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.3 },
          colors: confettiColors,
          gravity: 0.8,
          scalar: 0.9,
        });
      } else {
        // For loss - falling particles from top, more subdued
        confettiInstance({
          particleCount: 30,
          spread: 50,
          origin: { y: 0 },
          colors: confettiColors,
          gravity: 1.5,
          scalar: 0.7,
        });
      }

      // Set timeout to hide component
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, durationMs);

      return () => {
        clearTimeout(timeout);
        confettiInstance?.reset();
      };
    }
  }, [durationMs, onComplete, type, confettiColors]);

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

      {/* Result message */}
      <div className="relative z-10 animate-slide-up">
        <div className="relative">
          {/* Glow effect - different colors based on result type */}
          <div
            className={`absolute -inset-4 rounded-xl opacity-70 blur-lg animate-pulse ${
              type === "draw"
                ? "bg-gradient-to-r from-[#8BC34A] to-[#CDDC39]"
                : "bg-gradient-to-r from-[#9E9E9E] to-[#BDBDBD]"
            }`}
          ></div>

          {/* Content */}
          <div
            className={`relative bg-white/90 rounded-xl p-8 shadow-2xl border-2 text-center max-w-md ${
              type === "draw" ? "border-[#8BC34A]" : "border-[#9E9E9E]"
            }`}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div
                  className={`absolute -inset-2 rounded-full opacity-70 blur-md animate-pulse ${
                    type === "draw"
                      ? "bg-gradient-to-r from-[#CDDC39] to-[#8BC34A]"
                      : "bg-gradient-to-r from-[#9E9E9E] to-[#BDBDBD]"
                  }`}
                ></div>
                <div
                  className={`relative bg-white rounded-full p-3 shadow-lg border-2 ${
                    type === "draw" ? "border-[#CDDC39]" : "border-[#9E9E9E]"
                  }`}
                >
                  {type === "draw" ? (
                    <Scale className="h-10 w-10 text-[#8BC34A]" />
                  ) : (
                    <Frown className="h-10 w-10 text-[#9E9E9E]" />
                  )}
                </div>
              </div>
            </div>

            <h2
              className={`text-3xl font-bold mt-6 mb-2 ${
                type === "draw"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-[#558B2F] to-[#827717]"
                  : "text-[#616161]"
              }`}
            >
              {type === "draw" ? "Draw!" : "Defeat!"}
            </h2>

            <div className="flex items-center justify-center gap-2 mb-4">
              {type === "draw" && (
                <Sparkles className="h-5 w-5 text-[#CDDC39]" />
              )}
              <p className="text-xl font-semibold">
                {type === "draw" ? (
                  <span className="text-[#558B2F]">
                    The game ended in a draw
                  </span>
                ) : (
                  <span className="text-[#616161]">
                    {playerColor === "white" ? "Black" : "White"} has won the
                    match
                  </span>
                )}
              </p>
              {type === "draw" && (
                <Sparkles className="h-5 w-5 text-[#CDDC39]" />
              )}
            </div>

            <div className="flex justify-center my-4">
              <div className="relative">
                <div
                  className={`absolute -inset-2 rounded-full opacity-70 blur-sm ${
                    type === "draw"
                      ? "bg-gradient-to-r from-[#8BC34A] to-[#CDDC39]"
                      : "bg-gradient-to-r from-[#9E9E9E] to-[#BDBDBD]"
                  }`}
                ></div>
                <div
                  className={`relative p-4 rounded-full ${type === "draw" ? "bg-[#F9FBE7]" : "bg-[#F5F5F5]"}`}
                >
                  {type === "draw" ? (
                    <Handshake className="h-12 w-12 text-[#8BC34A]" />
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <X className="h-16 w-16 text-[#E0E0E0] stroke-1" />
                      </div>
                      <div className="relative">
                        {playerColor === "white" ? (
                          <span className="text-4xl">♔</span>
                        ) : (
                          <span className="text-4xl">♚</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p
              className={`mt-4 ${type === "draw" ? "text-[#558B2F]" : "text-[#757575]"}`}
            >
              {type === "draw"
                ? "Both players demonstrated excellent skill!"
                : "Better luck next time. Every defeat is a lesson!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
