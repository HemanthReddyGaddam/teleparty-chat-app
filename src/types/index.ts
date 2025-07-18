
export interface SessionChatMessage {
  isSystemMessage: boolean;
  userIcon?: string;
  userNickname?: string;
  body: string;
  permId: string;
  timestamp: number;
}

export interface MessageList {
  messages: SessionChatMessage[];
}

export interface TypingMessageData {
  anyoneTyping: boolean;
  usersTyping: string[];
}