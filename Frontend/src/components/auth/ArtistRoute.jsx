import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';
import AuthPrompt from './AuthPrompt';

const ArtistRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stream-base">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPrompt />;
  }

  if (user?.role !== 'artist') {
    // If authenticated but not artist, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ArtistRoute;
