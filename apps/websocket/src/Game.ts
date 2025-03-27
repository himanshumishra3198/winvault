import { Chess } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "@repo/common/constants";
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
      console.log("exit from here");
      return;
    }
    if (this.board.turn() === "b" && socket !== this.player2) {
      console.log("exit from here2");
      return;
    }
    try {
      this.board.move({ from: move.from, to: move.to });
    } catch (e) {
      console.log(e);
      return;
    }

    if (this.board.isGameOver()) {
      // this.endGame();
      const result = this.board.isCheckmate()
        ? JSON.stringify({
            state: "checkmate",
            winner: this.board.turn() === "w" ? "black" : "white",
          })
        : JSON.stringify({ state: "draw" });

      this.player1.send(JSON.stringify({ type: GAME_OVER, result }));
      this.player2.send(JSON.stringify({ type: GAME_OVER, result }));
      console.log("Game Over");
      return;
    }
    if (this.board.turn() === "w") {
      this.player1.send(JSON.stringify({ type: MOVE, move }));
    } else {
      this.player2.send(JSON.stringify({ type: MOVE, move }));
    }
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
