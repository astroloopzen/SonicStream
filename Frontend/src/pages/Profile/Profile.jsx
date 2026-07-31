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
    <div className="pb-32 pt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 pb-8 border-b border-stream-border/10">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden bg-stream-elevated border-4 border-stream-accent/20 shadow-2xl shadow-stream-accent/10 shrink-0 relative flex items-center justify-center">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <FiUser className="text-7xl text-gray-500" />
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm font-bold tracking-widest text-stream-accent uppercase mb-2">Profile</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tighter text-white">{user?.username || 'User'}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-sm text-gray-400 font-medium bg-stream-elevated/30 w-fit md:mx-0 mx-auto py-2 px-4 rounded-full border border-stream-border/5">
            <span className="flex items-center gap-2"><FiMail className="text-stream-accent" /> {user?.email}</span>
            <span className="flex items-center gap-2"><FiStar className="text-stream-accent" /> {user?.role === 'artist' ? 'Artist' : 'User'}</span>
            <span className="flex items-center gap-2"><FiCalendar className="text-stream-accent" /> Joined {formatDate(user?.createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-8 md:mt-0">
          <Button onClick={() => navigate('/settings')} className="flex items-center justify-center gap-2 w-full md:w-auto">
            <FiSettings className="text-lg" /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="bg-stream-elevated/50 backdrop-blur-md rounded-2xl p-8 sm:p-10 border border-stream-border/10 shadow-xl max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
          <FiUser className="text-stream-accent" /> About
        </h2>
        <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
          Welcome to your SonicStream profile! Here you can manage your account details and settings. 
          As a <span className="font-semibold text-white">{user?.role === 'artist' ? 'registered Artist' : 'User'}</span>, 
          {user?.role === 'artist' ? ' you have access to the Dashboard where you can upload and manage your music' : ' you can explore the platform, favorite your best tracks, and discover new music'}. 
          Click the "Edit Profile" button above to change your avatar, update your email, or modify your security settings.
        </p>
      </div>
    </div>
  );
};

export default Profile;