import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { SocketMessageTypes } from 'teleparty-websocket-lib';

export const MessageInput: React.FC = () => {
  const { sendMessage, setTyping, isConnected } = useSocket();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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