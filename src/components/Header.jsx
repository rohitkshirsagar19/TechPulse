import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
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
            </ul>
        </nav>
    )
}

export default Header;