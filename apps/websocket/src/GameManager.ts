import { WebSocket } from "ws";
import { Game } from "./Game.js";
// import { INIT_GAME, MOVE } from "./utils/const";
import { INIT_GAME, MOVE } from "@repo/common/constants";

export class GameManager {
  private games: Game[];
  private waitingPlayer: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.waitingPlayer = null;
    this.users = [];
  }

  addUser(user: WebSocket): void {
    this.users.push(user);
    this.gameHandler(user);
  }

  removeUser(user: WebSocket): void {
    this.users = this.users.filter((u) => u !== user);
    this.games = this.games.filter((game) => {
      if (game.player1 === user || game.player2 === user) {
        game.close();
        return false;
      }
      return true;
    });
    if (this.waitingPlayer === user) {
      this.waitingPlayer = null;
    }
  }

  gameHandler(ws: WebSocket) {
    ws.on("message", (data: string) => {
      const parsedData = JSON.parse(data);

      if (parsedData.type === INIT_GAME) {
        if (this.waitingPlayer === null) {
          this.waitingPlayer = ws;
        } else {
          const game = new Game(this.waitingPlayer, ws);
          this.games.push(game);
          this.waitingPlayer = null;
        }
      } else if (parsedData.type === MOVE) {
        const game = this.games.find(
          (g) => g.player1 === ws || g.player2 === ws,
        );
        if (game) {
          game.makeMove(ws, parsedData.move);
        }
      }
    });
  }
}
