import { Chess } from "chess.js";
import WebSocket from "ws";
import {
  GAME_OVER,
  INIT_GAME,
  MOVE,
  CHECKMATE,
  DRAW,
} from "@repo/common/constants";
export class Game {
  player1: WebSocket;
  player2: WebSocket;
  startTime: Date;
  board: Chess;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.startTime = new Date();
    this.board = new Chess();
    this.player1.send(JSON.stringify({ type: INIT_GAME, color: "white" }));
    this.player2.send(JSON.stringify({ type: INIT_GAME, color: "black" }));
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
      promotion?: string;
    },
  ) {
    if (this.board.turn() === "w" && socket !== this.player1) {
      console.log("Invalid move: It's white's turn.");
      return;
    }
    if (this.board.turn() === "b" && socket !== this.player2) {
      console.log("Invalid move: It's black's turn.");
      return;
    }
    try {
      const moveResult = this.board.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      });
      if (!moveResult) {
        console.log("Invalid move: Move could not be executed.");
        return;
      }
    } catch (e) {
      console.error("Error executing move:", e);
      return;
    }

    if (this.board.isGameOver()) {
      const result = this.board.isCheckmate()
        ? {
            state: CHECKMATE,
            winner: this.board.turn() === "w" ? "black" : "white",
          }
        : { state: DRAW };

      this.player1.send(JSON.stringify({ type: GAME_OVER, result }));
      this.player2.send(JSON.stringify({ type: GAME_OVER, result }));
      console.log("Game Over:", result);
      return;
    }

    const opponent = this.board.turn() === "w" ? this.player1 : this.player2;
    opponent.send(JSON.stringify({ type: MOVE, move }));
  }
  startGame(): void {
    this.startTime = new Date();
  }
  close(): void {
    this.player1.close();
    this.player2.close();
  }

  endGame(): void {
    // this.state = "ended";
  }
}
