import { WebSocket, WebSocketServer } from "ws";

import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8081 });

const gameManager = new GameManager();

wss.on("connection", (ws: WebSocket) => {
  gameManager.addUser(ws);

  ws.send("Hello, I am a WebSocket server");
});
