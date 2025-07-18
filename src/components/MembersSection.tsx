import { useSocket } from '../contexts/SocketContext';

export const MembersSection: React.FC = () => {
  const { currentNickname } = useSocket();
  // Placeholder: Only show current user for now
  return (
    <aside className="members-section">
      <h4>Members</h4>
      <ul className="member-list">
        <li className="you">
          <span className="member-icon">👤</span>
          {currentNickname ? `You are ${currentNickname}` : 'You'}
        </li>
      </ul>
    </aside>
  );
}; 