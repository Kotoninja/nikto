export const WS_EVENTS = {
  CHAT_MESSAGE: "chat.message",
} as const;

export interface WsMessageOutgoing {
  type: typeof WS_EVENTS.CHAT_MESSAGE;
  text: string;
  username: string;
}

export interface WsMessageIncoming {
  type: typeof WS_EVENTS.CHAT_MESSAGE;
  id: number;
  text: string;
  username: string;
  timestamp: string;
}
