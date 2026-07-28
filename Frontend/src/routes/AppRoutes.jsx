import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Search from '../pages/Search/Search';
import Favorites from '../pages/Favorites/Favorites';
import Playlist from '../pages/Playlist/Playlist';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound/NotFound';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    {/* Auth Routes */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Main App Routes */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/playlist" element={<Playlist />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;