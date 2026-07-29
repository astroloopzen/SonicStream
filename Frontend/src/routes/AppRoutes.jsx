import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Welcome from '../pages/Welcome/Welcome';
import Search from '../pages/Search/Search';
import Favorites from '../pages/Favorites/Favorites';
import Playlist from '../pages/Playlist/Playlist';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound/NotFound';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import EntryRoute from '../components/auth/EntryRoute';
import Album from '../pages/Album/Album';
import Artist from '../pages/Artist/Artist';

const AppRoutes = () => (
  <Routes>
    {/* Auth Routes */}
    <Route element={<AuthLayout />}>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Main App Routes guarded by EntryRoute */}
    <Route element={<EntryRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/album/:albumId" element={<Album />} />
        <Route path="/artist/:artistId" element={<Artist />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;