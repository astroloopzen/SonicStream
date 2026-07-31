import { useState, useEffect } from 'react';
import { musicService } from '../../services/musicService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { ListMusic, Edit2, Trash2, Plus, Play } from 'lucide-react';
import PlaylistForm from '../../components/dashboard/PlaylistForm';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MyPlaylists = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await musicService.getPlaylists();
      const userPlaylists = (res.playlists || []).filter(p => p.user?._id === (user?.id || user?._id));
      setPlaylists(userPlaylists);
      setError(null);
    } catch (err) {
      setError('Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchPlaylists();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await musicService.deletePlaylist(id);
        fetchPlaylists(); // refresh
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete playlist");
      }
    }
  };

  const handleCreateSubmit = async (data) => {
    try {
      await musicService.createPlaylist(data);
      setIsCreating(false);
      fetchPlaylists();
    } catch (err) {
      alert("Failed to create playlist");
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await musicService.updatePlaylist(editingPlaylist._id, data);
      setEditingPlaylist(null);
      fetchPlaylists();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update playlist");
    }
  };

  if (loading) return <div className="pt-20"><Loader /></div>;
  if (error) return <div className="pt-20"><EmptyState icon={ListMusic} title="Error" description={error} /></div>;

  if (isCreating) {
    return (
      <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Create New Playlist</h1>
        <div className="bg-stream-elevated rounded-xl p-6 border border-stream-border/10 shadow-lg">
          <PlaylistForm 
            onSubmit={handleCreateSubmit} 
            onCancel={() => setIsCreating(false)} 
            submitLabel="Create"
          />
        </div>
      </div>
    );
  }

  if (editingPlaylist) {
    return (
      <div className="pb-24 pt-6 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Edit Playlist: {editingPlaylist.title}</h1>
        <div className="bg-stream-elevated rounded-xl p-6 border border-stream-border/10 shadow-lg">
          <PlaylistForm 
            initialData={editingPlaylist} 
            onSubmit={handleEditSubmit} 
            onCancel={() => setEditingPlaylist(null)} 
            submitLabel="Update"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Playlists</h1>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Create Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <EmptyState icon={ListMusic} title="No Playlists Found" description="You haven't created any playlists yet." />
      ) : (
        <div className="bg-stream-elevated rounded-xl overflow-hidden border border-stream-border/10 shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stream-border/10 bg-stream-card text-stream-text-secondary text-sm">
                <th className="p-5 font-medium uppercase tracking-wider">Title</th>
                <th className="p-5 font-medium uppercase tracking-wider">Tracks</th>
                <th className="p-5 font-medium text-right uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map((playlist) => (
                <tr key={playlist._id} className="border-b border-stream-border/5 hover:bg-stream-highlight/10 transition-colors">
                  <td className="p-5 font-medium">
                    <span 
                      onClick={() => navigate(`/album/${playlist._id}`)}
                      className="hover:underline hover:text-green-400 cursor-pointer text-lg"
                    >
                      {playlist.title}
                    </span>
                  </td>
                  <td className="p-5 text-gray-400 font-medium">{playlist.musics?.length || 0} songs</td>
                  <td className="p-5 text-right space-x-3">
                    <button 
                      onClick={() => navigate(`/album/${playlist._id}`)}
                      className="p-2 bg-stream-card rounded-full text-gray-300 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                      title="Play / View"
                    >
                      <Play size={18} />
                    </button>
                    <button 
                      onClick={() => setEditingPlaylist(playlist)}
                      className="p-2 bg-stream-card rounded-full text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(playlist._id)}
                      className="p-2 bg-stream-card rounded-full text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;
