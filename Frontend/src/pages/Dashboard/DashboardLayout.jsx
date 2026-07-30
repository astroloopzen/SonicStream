import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Music, ListMusic, Upload } from 'lucide-react';

const DashboardLayout = () => {
  const navItems = [
    { to: '/dashboard/home', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/dashboard/songs', icon: <Music size={20} />, label: 'My Songs' },
    { to: '/dashboard/playlists', icon: <ListMusic size={20} />, label: 'My Albums' },
    { to: '/dashboard/upload', icon: <Upload size={20} />, label: 'Upload Song' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stream-base text-stream-text">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stream-elevated flex flex-col border-r border-stream-border/10 p-4 shrink-0">
        <h2 className="text-xl font-bold mb-6 text-white uppercase tracking-wider px-2">Artist Panel</h2>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-stream-highlight text-black font-medium'
                    : 'text-stream-text-secondary hover:text-white hover:bg-stream-card'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 relative pb-32"> {/* pb-32 for MusicPlayer */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
