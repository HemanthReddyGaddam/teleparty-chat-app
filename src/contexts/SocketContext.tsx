import { createContext, useContext, useEffect, useState } from 'react';
import { TelepartyClient, SocketMessageTypes } from 'teleparty-websocket-lib';
import type { SocketEventHandler, SessionChatMessage, MessageList } from 'teleparty-websocket-lib';
import type { TypingMessageData } from '../types';

interface SocketMessage {
  type: string;
  data: any;
}

interface SocketContextType {
  client: TelepartyClient | null;
  isConnected: boolean;
  messages: SessionChatMessage[];
  anyoneTyping: boolean;
  createChatRoom: (nickname: string, icon?: string) => Promise<string>;
  joinChatRoom: (roomId: string, nickname: string, icon?: string) => Promise<void>;
  sendMessage: (message: string) => void;
  setTyping: (typing: boolean) => void;
  setCurrentNickname: (nickname: string) => void;
  currentNickname: string; // Added to expose the state value
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client] = useState<TelepartyClient>(() => {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      },
      onClose: () => {
        setIsConnected(false);
        alert('Connection lost. Please reload the app.');
      },
      onMessage: (message: SocketMessage) => {
        console.log('Message received:', message.type, message.data);
        if (message.type === 'sendMessage') {
          const messageData = message.data as SessionChatMessage;
          setMessages((prev) => [...prev, messageData]); // Append new message
        } else if (message.type === 'userList') {
          console.log('User list received:', message.data);
        } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const typingData = message.data as TypingMessageData;
          setAnyoneTyping(typingData.anyoneTyping);
        }
      }
    };
    return new TelepartyClient(eventHandler);
  });
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [anyoneTyping, setAnyoneTyping] = useState(false);
  const [currentNickname, setCurrentNickname] = useState('');

  const createChatRoom = async (nickname: string, icon?: string): Promise<string> => {
    if (!isConnected) throw new Error('Socket not connected');
    const roomId = await client.createChatRoom(nickname, icon);
    return roomId;
  };

  const joinChatRoom = async (roomId: string, nickname: string, icon?: string): Promise<void> => {
    if (!isConnected) throw new Error('Socket not connected');
    await client.joinChatRoom(nickname, roomId, icon);
  };

  const sendMessage = (message: string) => {
    if (!isConnected) return;
    client.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body: message });
  };

  const setTyping = (typing: boolean) => {
    if (!isConnected) return;
    client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, { typing });
  };

  return (
    <SocketContext.Provider value={{ client, isConnected, messages, anyoneTyping, createChatRoom, joinChatRoom, sendMessage, setTyping, setCurrentNickname, currentNickname }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};