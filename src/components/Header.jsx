// src/components/Header.jsx
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Header() {
  const { user, logout } = useUser();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold">TechPulse</h2>
      <ul className="flex gap-4">
        <li>
          <Link to="/" className="hover:text-blue-400">Home</Link>
        </li>
        <li>
          <Link to="/profile" className="hover:text-blue-400">Profile</Link>
        </li>
        <li>
          <Link to="/notifications" className="hover:text-blue-400">Notifications</Link>
        </li>
        {user ? (
          <>
            <li>
              <span className="text-gray-300">Welcome, {user.username}</span>
            </li>
            <li>
              <button
                onClick={logout}
                className="hover:text-blue-400"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup" className="hover:text-blue-400">Sign Up</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400">Log In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
export default Header;