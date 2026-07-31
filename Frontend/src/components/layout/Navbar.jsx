import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiLogOut } from 'react-icons/fi';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/welcome');
  };

  return (
    <header className="h-16 bg-stream-base/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5">
      <div className="flex gap-4">
        {/* Navigation arrows */}
        <button 
          onClick={() => navigate(-1)} 
          className="w-9 h-9 rounded-full bg-stream-elevated/80 flex items-center justify-center hover:bg-stream-highlight transition-all duration-300 text-gray-400 hover:text-white border border-stream-border/10 shadow-sm"
          title="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button 
          onClick={() => navigate(1)} 
          className="w-9 h-9 rounded-full bg-stream-elevated/80 flex items-center justify-center hover:bg-stream-highlight transition-all duration-300 text-gray-400 hover:text-white border border-stream-border/10 shadow-sm"
          title="Go forward"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
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
            {user?.role === 'artist' && (
              <Button variant="secondary" onClick={() => navigate('/dashboard')} className="!py-2 !px-5 text-sm">
                Dashboard
              </Button>
            )}
            {user?.role === 'user' && (
              <Button variant="secondary" onClick={() => navigate('/my-playlists')} className="!py-2 !px-5 text-sm">
                My Playlists
              </Button>
            )}
            <Link to="/profile" className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 bg-stream-elevated/80 pr-4 pl-1.5 py-1.5 rounded-full hover:bg-stream-highlight border border-stream-border/10 hover:border-stream-accent/30 shadow-sm">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-stream-card flex items-center justify-center border border-gray-700">
                  <FiUser className="text-lg" />
                </div>
              )}
              <span className="hidden md:inline font-medium text-sm">{user?.username || 'Profile'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-11 h-11 rounded-full bg-stream-elevated/80 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-stream-highlight transition-all duration-300 border border-stream-border/10 hover:border-red-900/30"
              title="Logout"
            >
              <FiLogOut className="text-lg" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;