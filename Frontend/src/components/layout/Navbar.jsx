import { Link } from 'react-router-dom';

const Navbar = () => (
  <header className="h-16 bg-stream-base/80 backdrop-blur-lg sticky top-0 z-10 flex items-center justify-between px-6">
    <div className="flex gap-4">
      {/* Navigation arrows placeholder */}
    </div>
    <div className="flex items-center gap-6 text-sm font-semibold">
      <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Sign up</Link>
      <Link to="/login" className="bg-white text-black px-8 py-3 rounded-full hover:scale-105 transition-transform">Log in</Link>
    </div>
  </header>
);
export default Navbar;