export interface MessageInterface {
  id: number;
  text: string;
  timestamp: Date;
  username: string;
}

export interface MessageFieldInterface extends MessageInterface {
  getAvatarColor: (username: string) => string;
  formatTime: (date: string) => string;
}
