import { useSocket } from '../contexts/SocketContext';
import { useParams } from 'react-router-dom';
import type { SessionChatMessage } from 'teleparty-websocket-lib';
import { useState, useEffect, useRef } from 'react';

export const ChatWindow: React.FC = () => {
  const { messages, anyoneTyping, currentNickname } = useSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom for new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getDisplayNickname = (msgNickname: string | undefined) => {
    if (!msgNickname) return 'Unknown';
    return msgNickname === currentNickname ? 'you' : msgNickname;
  };

  return (
    <div className="chat-window">
      <h3>Chat Room: {roomId}</h3>
      <div className="messages">
        {messages.map((msg: SessionChatMessage, index) => (
          <div
            key={msg.permId }
            className={`message-container ${msg.isSystemMessage ? 'system-message' : ''}`}
          >
            <div className="message-content">
              <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
              {msg.userIcon && <img src={msg.userIcon} alt="User icon" className="user-icon" />}
              <span className="nickname">{getDisplayNickname(msg.userNickname)}:</span>
              <span className="body">{msg.body}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {anyoneTyping && <p className="typing-indicator">Someone is typing...</p>}
    </div>
  );
};