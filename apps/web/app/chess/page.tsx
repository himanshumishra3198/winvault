"use client";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { Chessboard } from "react-chessboard";

export default function ChessPage() {
  return (
    <main className="bg-gray-950 w-screen h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-96 h-96">
        <Chessboard />
      </div>
      <div>
        <Button asChild>
          <Link href="/chess/game">Play</Link>
        </Button>
      </div>
    </main>
  );
}
