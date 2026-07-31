import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FiUser, FiLock, FiLogOut, FiUploadCloud } from 'react-icons/fi';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Profile Form State
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      if (username !== user?.username) formData.append('username', username);
      if (email !== user?.email) formData.append('email', email);
      if (profilePicture) formData.append('profilePicture', profilePicture);

      const data = await authService.updateProfile(formData);
      updateUser(data.user);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Username or email might be taken.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.updatePassword({ currentPassword, newPassword });
      setSuccess("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/welcome');
  };

  return (
    <div className="pb-24 pt-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'profile' 
                ? 'bg-stream-accent text-white shadow-lg shadow-stream-accent/20 translate-x-1' 
                : 'text-gray-400 hover:text-white hover:bg-stream-highlight/50 hover:translate-x-1'
            }`}
          >
            <FiUser className="text-lg" /> Update Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'password' 
                ? 'bg-stream-accent text-white shadow-lg shadow-stream-accent/20 translate-x-1' 
                : 'text-gray-400 hover:text-white hover:bg-stream-highlight/50 hover:translate-x-1'
            }`}
          >
            <FiLock className="text-lg" /> Change Password
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:translate-x-1"
          >
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-stream-elevated/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-stream-border/10 shadow-xl">
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">{success}</div>}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-stream-card border-2 border-stream-highlight shrink-0">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                      <FiUser />
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-2 border border-stream-border/20 rounded-lg cursor-pointer hover:bg-stream-card transition-colors">
                    <FiUploadCloud />
                    <span>Choose Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-stream-base/50 border border-stream-border/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-stream-accent focus:ring-2 focus:ring-stream-accent/20 transition-all shadow-inner"
                    required
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stream-base/50 border border-stream-border/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-stream-accent focus:ring-2 focus:ring-stream-accent/20 transition-all shadow-inner"
                    required
                  />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8">
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Security</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-stream-base/50 border border-stream-border/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-stream-accent focus:ring-2 focus:ring-stream-accent/20 transition-all shadow-inner"
                    required
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-stream-base/50 border border-stream-border/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-stream-accent focus:ring-2 focus:ring-stream-accent/20 transition-all shadow-inner"
                    minLength={6}
                    required
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-stream-base/50 border border-stream-border/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-stream-accent focus:ring-2 focus:ring-stream-accent/20 transition-all shadow-inner"
                    minLength={6}
                    required
                  />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8">
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
