import { SocketProvider } from './contexts/SocketContext';
import { RoomForm } from './components/RoomForm';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<RoomForm />} />
            <Route path="/chatroom/:roomId" element={
              <>
                <ChatWindow />
                <MessageInput />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;