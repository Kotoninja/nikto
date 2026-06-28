import type { WsMessageIncoming } from "./websocketEvents";

class WebSocketClient {
  private socket: WebSocket | null = null;

  connect(url: string, onMessage: (data: WsMessageIncoming) => void) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("Соединение установлено");
    };

    this.socket.onmessage = (event) => {
      const data: WsMessageIncoming = JSON.parse(event.data);
      onMessage(data);
    };

    this.socket.onclose = () => {
      console.log("Соединение закрыто");
    };

    this.socket.onerror = (error) => {
      console.log(`Ошибка: ${error}`);
    };
  }

  send(text: string, username: string) {
    console.log(text,username)
    this.socket?.send(
      JSON.stringify({
        type: "chat.message",
        text,
        username,
      }),
    );
  }

  disconnect() {
    this.socket?.close();
  }
}

export const wsClient = new WebSocketClient();
