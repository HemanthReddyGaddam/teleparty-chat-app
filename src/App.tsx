import { SocketProvider } from './contexts/SocketContext';
import { RoomForm } from './components/RoomForm';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import './index.css';

function App() {
  return (
    <SocketProvider>
      <div className="app">
        <h1>Teleparty Chat</h1>
        <RoomForm />
        <ChatWindow />
        <MessageInput />
      </div>
    </SocketProvider>
  );
}

export default App;