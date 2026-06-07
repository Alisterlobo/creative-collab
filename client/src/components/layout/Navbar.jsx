import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-black/10 h-[60px] flex items-center justify-between px-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent"></div>
        <span className="font-syne font-black text-ink text-lg">CreativeCollab</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-1 bg-surface rounded-xl p-1">
        <Link to="/" className="px-4 py-1.5 rounded-lg text-sm font-medium text-ink bg-white shadow-sm">
          Feed
        </Link>
        <Link to="/explore" className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-ink transition-colors">
          Explore
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="hidden md:block bg-ink text-white text-sm font-dm font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
        >
          + Post Work
        </Link>
        <div
          onClick={() => navigate(`/profile/${user?._id}`)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #E8531A, #CC3B9A)' }}
          title={user?.name}
        >
          {initials}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-muted hover:text-ink font-dm transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}