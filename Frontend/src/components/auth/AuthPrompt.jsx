import { useNavigate } from 'react-router-dom';

const AuthPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-stream-elevated rounded-full flex items-center justify-center text-4xl mb-6 border-2 border-stream-highlight shadow-lg">
        🔒
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Sign in Required</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Create an account or log in to save your favorites, upload music, and personalize your experience.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-sm">
        <button
          onClick={() => navigate('/login')}
          className="flex-1 bg-stream-accent text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md"
        >
          Log In
        </button>
        <button
          onClick={() => navigate('/register')}
          className="flex-1 bg-transparent border-2 border-stream-highlight text-white py-2 px-6 rounded-lg font-semibold hover:bg-stream-highlight transition-all"
        >
          Sign Up
        </button>
      </div>

      <button
        onClick={() => navigate('/')}
        className="text-gray-400 hover:text-white text-sm font-medium transition-colors border-b border-transparent hover:border-white pb-1"
      >
        Continue Browsing
      </button>
    </div>
  );
};

export default AuthPrompt;
