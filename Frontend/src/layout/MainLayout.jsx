import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => (
  <div className="h-screen flex flex-col overflow-hidden bg-stream-base text-white">
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <Navbar />
        <div className="p-6 pb-24 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
    <Footer />
  </div>
);
export default MainLayout;