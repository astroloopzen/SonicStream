import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setIsLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
        <FiCheckCircle className="text-6xl text-green-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
        <p className="text-gray-400">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Join SonicStream</h2>
        <p className="text-gray-400">Sign up for free and start listening</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
          <FiAlertCircle className="text-xl shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiUser />
          </div>
          <input
  type="text"
  name="username"
  required
  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-stream-accent focus:ring-1 focus:ring-stream-accent transition-all"
  placeholder="Username"
  value={formData.username}
  onChange={handleChange}
/>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiMail />
          </div>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-stream-accent focus:ring-1 focus:ring-stream-accent transition-all"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiLock />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-stream-accent focus:ring-1 focus:ring-stream-accent transition-all"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiLock />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            required
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-stream-accent focus:ring-1 focus:ring-stream-accent transition-all"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-stream-accent hover:bg-stream-accent/90 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2 mt-6"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-white font-semibold hover:text-stream-accent transition-colors">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default Register;