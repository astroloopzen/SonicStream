import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const EntryRoute = () => {
  const { isAuthenticated, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stream-base">
        <Loader />
      </div>
    );
  }

  return (isAuthenticated || isGuest) ? <Outlet /> : <Navigate to="/welcome" replace />;
};

export default EntryRoute;
