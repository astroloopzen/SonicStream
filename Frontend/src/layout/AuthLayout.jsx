import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stream-base p-6">
    <div className="text-3xl font-bold text-stream-accent mb-8">SonicStream</div>
    <div className="w-full max-w-md bg-stream-elevated p-8 rounded-2xl shadow-xl border border-stream-highlight">
      <Outlet />
    </div>
  </div>
);
export default AuthLayout;