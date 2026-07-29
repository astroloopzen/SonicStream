import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-stream-base/80 backdrop-blur-lg sticky top-0 z-10 flex items-center justify-between px-6 border-b border-white/5">
      <div className="flex gap-4">
        {/* Navigation arrows */}
        <button className="w-8 h-8 rounded-full bg-stream-elevated flex items-center justify-center hover:bg-stream-highlight transition-colors text-gray-400">
          {'<'}
        </button>
        <button className="w-8 h-8 rounded-full bg-stream-elevated flex items-center justify-center hover:bg-stream-highlight transition-colors text-gray-400">
          {'>'}
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm font-semibold">
        {!isAuthenticated ? (
          <>
            <Link to="/register" className="text-gray-300 hover:text-white transition-colors px-4 py-2">
              Sign up
            </Link>
            <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full hover:scale-105 transition-transform">
              Log in
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-stream-elevated px-4 py-2 rounded-full hover:bg-stream-highlight">
              <FiUser className="text-lg" />
              <span className="hidden md:inline">{user?.name || 'Profile'}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-stream-elevated flex items-center justify-center text-gray-400 hover:text-white hover:bg-stream-highlight transition-colors"
              title="Logout"
            >
              <FiLogOut />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;