import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import type { SessionChatMessage } from 'teleparty-websocket-lib';

export const MessageInput: React.FC = () => {
  const { sendMessage, setTyping, isConnected, currentNickname } = useSocket();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMemberCount, setShowMemberCount] = useState(false);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (isTyping) {
        setTyping(true);
      } else {
        setTyping(false);
      }
    }, 500);

    return () => clearTimeout(typingTimeout);
  }, [isTyping, setTyping]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setIsTyping(true);
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <div className="member-count" onClick={() => setShowMemberCount(!showMemberCount)}>
        👥 1 member{showMemberCount && ` (You are ${currentNickname || 'Unnamed'})`}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!isConnected}
      />
      <button onClick={handleSend} disabled={!isConnected}>
        Send
      </button>
    </div>
  );
};