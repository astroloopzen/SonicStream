import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { continueAsGuest } = useContext(AuthContext);

  const handleGuest = () => {
    continueAsGuest();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-2xl">
        🎵
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">Welcome to SonicStream</h1>
      <p className="text-gray-400 mb-10 leading-relaxed max-w-sm">
        Discover new music, create playlists, and vibe to your favorite artists. Let's get started.
      </p>

      <div className="w-full flex flex-col gap-4">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-stream-accent text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md"
        >
          Log In
        </button>
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-transparent border-2 border-stream-highlight text-white py-3 rounded-lg font-semibold hover:bg-stream-highlight transition-all"
        >
          Sign Up
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-stream-highlight w-full">
        <button
          onClick={handleGuest}
          className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          Explore as Guest
        </button>
      </div>
    </div>
  );
};

export default Welcome;
