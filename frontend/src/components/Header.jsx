import { useAuth } from '../auth/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      
    </header>
  );
}