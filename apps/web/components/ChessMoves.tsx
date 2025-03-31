"use client";

import { useState } from "react";
import { ScrollArea, ScrollBar } from "@repo/ui/components/ui/scroll-area";

interface ChessMovesProps {
  moves: string[];
  title?: string;
}

export default function ChessMoves({
  moves = [],
  title = "Game Moves",
}: ChessMovesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-2 container">
        {formattedMoves.length > 0 ? (
          formattedMoves.map((movePair, index) => (
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
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#827717] italic">
              No moves yet! Make your first move.
            </p>
          </div>
        )}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
