import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FiUser, FiSettings, FiMail, FiCalendar, FiStar } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-stream-elevated border-4 border-stream-highlight shadow-xl shrink-0 relative flex items-center justify-center">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <FiUser className="text-7xl text-gray-500" />
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm font-bold tracking-widest text-stream-highlight uppercase mb-2">Profile</p>
          <h1 className="text-5xl font-black mb-4">{user?.username || 'User'}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5"><FiMail /> {user?.email}</span>
            <span className="flex items-center gap-1.5"><FiStar /> {user?.role === 'artist' ? 'Artist' : 'User'}</span>
            <span className="flex items-center gap-1.5"><FiCalendar /> Joined {formatDate(user?.createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0">
          <Button onClick={() => navigate('/settings')} className="flex items-center gap-2 rounded-full px-6">
            <FiSettings /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="bg-stream-elevated rounded-xl p-8 border border-stream-border/5 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-gray-400 leading-relaxed max-w-3xl">
          Welcome to your SonicStream profile! Here you can manage your account details and settings. 
          As a {user?.role === 'artist' ? 'registered Artist, you also have access to the Dashboard where you can upload and manage your music' : 'User, you can explore the platform, favorite your best tracks, and discover new music'}. 
          Click the "Edit Profile" button to change your avatar, update your email, or modify your security settings.
        </p>
      </div>
    </div>
  );
};

export default Profile;