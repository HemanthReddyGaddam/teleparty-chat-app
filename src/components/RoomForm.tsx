import { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const RoomForm: React.FC = () => {
  const { isConnected, createChatRoom, joinChatRoom } = useSocket();
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIcon(reader.result as string);
        console.log('Icon selected:', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRoom = async () => {
    if (!nickname) {
      setError('Nickname is required');
      return;
    }
    try {
      const newRoomId = await createChatRoom(nickname, icon || undefined);
      setRoomId(newRoomId);
      setError('');
    } catch (err) {
      setError('Failed to create room');
      console.error(err);
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname || !roomId) {
      setError('Nickname and Room ID are required');
      return;
    }
    try {
      await joinChatRoom(roomId, nickname, icon || undefined);
      setError('');
    } catch (err) {
      setError('Failed to join room');
      console.error(err);
    }
  };

  return (
    <div className="room-form">
      <h2>Join or Create a Chat Room</h2>
      {!isConnected && <p>Connecting to server...</p>}
      <input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        disabled={!isConnected}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleIconChange}
        disabled={!isConnected}
      />
      <button onClick={handleCreateRoom} disabled={!isConnected}>
        Create Room
      </button>
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        disabled={!isConnected}
      />
      <button onClick={handleJoinRoom} disabled={!isConnected}>
        Join Room
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};