import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiAlertCircle
} from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Log in to continue to SonicStream</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
          <FiAlertCircle className="text-xl shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiMail />
          </div>
          <input
            type="email"
            required
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-stream-accent focus:ring-1 focus:ring-stream-accent transition-all peer"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiLock />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-stream-accent focus:ring-1 focus:ring-stream-accent transition-all"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="rounded border-white/10 bg-black/20 text-stream-accent focus:ring-stream-accent/50 cursor-pointer" />
            <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-stream-accent hover:text-white transition-colors">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-stream-accent hover:bg-stream-accent/90 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2 mt-4"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-white font-semibold hover:text-stream-accent transition-colors">
          Sign up for free
        </Link>
      </p>
    </div>
  );
};

export default Login;