import { useEffect } from "react";
import { wsClient } from "../services/websocketClient";
import { type MessageInterface } from "../types/chat";

export const useWebSocket = (
  setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>,
) => {
  useEffect(() => {
    wsClient.connect("ws://localhost:8000/ws/chat/", (data) => {
      console.log(data);
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          text: data.text,
          timestamp: data.timestamp,
          username: data.username,
        },
      ]);
    });

    return () => {
      wsClient.disconnect();
    };
  }, []);

  return {
    sendMessage: wsClient.send.bind(wsClient),
  };
};
