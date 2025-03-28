import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { GAME_OVER, MOVE } from "@repo/common/constants";
interface PlayGameProps {
  socket: WebSocket;
  color: string;
}

export function PlayGame({ socket, color }: PlayGameProps) {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === MOVE) {
        const move = data.move;
        makeAMove(move);
      }
      if (data.type === GAME_OVER) {
        console.log(data.result);
      }
    };

    return () => {
      socket.onmessage = null; // Cleanup to prevent memory leaks
    };
  }, [socket]);

  function makeAMove(move: { from: string; to: string; promotion: string }) {
    let result;
    try {
      console.log(move);
      result = game.move(move);
      setFen(game.fen());
    } catch (error: any) {
      console.log(error.message);
      console.log("Invalid move", error);
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

  return (
    <div>
      <h1>Play Game</h1>
      <h2>Color: {color}</h2>
      <div>
        <Chessboard position={fen} onPieceDrop={onDrop} />;
      </div>
    </div>
  );
}
