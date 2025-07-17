import { useSocket } from '../contexts/SocketContext';
import type { SessionChatMessage } from 'teleparty-websocket-lib';

export const ChatWindow: React.FC = () => {
  const { messages, anyoneTyping } = useSocket();

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg: SessionChatMessage, index) => (
          <div key={msg.permId} className={msg.isSystemMessage ? 'system-message' : 'user-message'}>
            <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
            {msg.userIcon && <img src={msg.userIcon} alt="User icon" className="user-icon" />}
            {msg.userNickname && <span className="nickname">{msg.userNickname}: </span>}
            <span className="body">{msg.body}</span>
          </div>
        ))}
      </div>
      {anyoneTyping && <p>Someone is typing...</p>}
    </div>
  );
};