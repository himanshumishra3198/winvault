"use client";

import { useState } from "react";
import { ScrollArea, ScrollBar } from "@repo/ui/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

interface ChessMovesProps {
  moves: string[];
  title?: string;
}

export default function ChessMoves({
  moves = [],
  title = "Game Moves",
}: ChessMovesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Format moves into pairs (white move, black move)
  const formatMoves = (movesList: string[]) => {
    const formattedMoves = [];

    for (let i = 0; i < movesList.length; i += 2) {
      formattedMoves.push({
        moveNumber: Math.floor(i / 2) + 1,
        whiteMove: movesList[i],
        blackMove: movesList[i + 1] || null,
      });
    }

    return formattedMoves;
  };

  const formattedMoves = formatMoves(moves);

  return (
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-r from-[#CDDC39] to-[#8BC34A] rounded-xl opacity-70 blur-lg"></div>
      <div className="relative border-2 border-[#8BC34A] bg-[#FAFFD1] rounded-xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] py-3 px-4">
          <h3 className="text-center font-bold text-white text-xl tracking-wide drop-shadow-sm">
            {title}
          </h3>
        </div>
        <ScrollArea className="h-72 w-48 p-4">
          {formattedMoves.length > 0 ? (
            <div className="space-y-2">
              {formattedMoves.map((movePair, index) => (
                <div
                  key={index}
                  className="flex items-center transition-all duration-200 rounded-lg hover:bg-[#CDDC39]/20 p-1"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="w-10 font-bold text-[#558B2F] flex items-center">
                    {movePair.moveNumber}.
                  </div>
                  <div className="flex-1 px-3 py-1 rounded-md">
                    <div className="flex items-center">
                      {hoveredIndex === index && (
                        <ChevronRight className="h-4 w-4 text-[#8BC34A] mr-1" />
                      )}
                      <span className="font-medium text-[#33691E] mr-6">
                        {movePair.whiteMove}
                      </span>
                      {movePair.blackMove && (
                        <span className="font-medium text-[#827717]">
                          {movePair.blackMove}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#827717] italic">
                No moves yet! Make your first move.
              </p>
            </div>
          )}
          {/* Scrollbar added here */}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}
