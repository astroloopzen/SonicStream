import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="w-20 md:w-64 bg-stream-elevated h-full flex flex-col p-6 transition-all duration-300">
    <div className="text-2xl font-bold text-stream-accent mb-10 hidden md:block">SonicStream</div>
    <div className="text-2xl font-bold text-stream-accent mb-10 md:hidden">SS</div>
    <nav className="flex flex-col gap-6 text-gray-400 font-medium">
      <Link to="/" className="hover:text-white transition-colors">Home</Link>
      <Link to="/search" className="hover:text-white transition-colors">Search</Link>
      <Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link>
    </nav>
  </aside>
);
export default Sidebar;