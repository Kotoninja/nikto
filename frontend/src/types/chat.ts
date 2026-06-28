export interface MessageInterface {
  id: number;
  text: string;
  timestamp: string;
  username: string;
}

export interface MessageFieldInterface extends MessageInterface {
  getAvatarColor: (username: string) => string;
  formatTime: (date: string) => string;
}
