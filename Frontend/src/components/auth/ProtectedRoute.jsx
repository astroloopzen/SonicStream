import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';
import AuthPrompt from './AuthPrompt';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stream-base">
        <Loader />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <AuthPrompt />;
};

export default ProtectedRoute;