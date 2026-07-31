import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <aside className="w-20 md:w-64 bg-stream-elevated h-full flex flex-col p-6 transition-all duration-300 flex-shrink-0 overflow-y-auto border-r border-white/5">
    <div className="text-2xl font-black text-white mb-10 hidden md:block tracking-tighter">
      Sonic<span className="text-stream-accent">Stream</span>
    </div>
    <div className="text-2xl font-black text-stream-accent mb-10 md:hidden flex justify-center">SS</div>
    <nav className="flex flex-col gap-2 text-gray-400 font-medium">
      <NavLink 
        to="/" 
        className={({isActive}) => `px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-stream-highlight text-white font-bold' : 'hover:text-white hover:bg-stream-card'}`}
      >
        Home
      </NavLink>
      <NavLink 
        to="/search" 
        className={({isActive}) => `px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-stream-highlight text-white font-bold' : 'hover:text-white hover:bg-stream-card'}`}
      >
        Search
      </NavLink>
      <NavLink 
        to="/favorites" 
        className={({isActive}) => `px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-stream-highlight text-white font-bold' : 'hover:text-white hover:bg-stream-card'}`}
      >
        Favorites
      </NavLink>
    </nav>
  </aside>
);
export default Sidebar;