"use client";
import { useEffect, useState } from "react";
import { INIT_GAME } from "@repo/common/constants";
import { PlayGame } from "~/components/PlayGame";
export default function game() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [color, setColor] = useState<string>("");
  const [renderBoard, setRenderBoard] = useState<boolean>(false);
  useEffect(() => {
    const wss = new WebSocket("ws://localhost:8081");
    setSocket(wss);
    wss.onopen = () => {
      const data = { type: INIT_GAME };
      wss.send(JSON.stringify(data));
      wss.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);

          // Validate the message structure
          if (data && data.type === INIT_GAME && data.color) {
            setColor(data.color);
            setRenderBoard(true);
          } else {
            console.warn("Unexpected message format:", data);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      wss.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === INIT_GAME) {
          setColor(data.color);
          setRenderBoard(true);
        }
      };
    };
    return () => {
      wss.onopen = null;
      wss.onmessage = null; // Cleanup to prevent memory leaks
      wss.close(); // Close the WebSocket connection
    };
  }, []);

  if (socket === null) {
    return <div>Connecting...</div>;
  }

  return renderBoard ? (
    <PlayGame socket={socket} color={color} />
  ) : (
    <div>Waiting for game to start...</div>
  );
}
