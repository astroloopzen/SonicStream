import { useState, useEffect } from 'react';
import { musicService } from '../../services/musicService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Music, Edit2, Trash2 } from 'lucide-react';
import MusicForm from '../../components/dashboard/MusicForm';
import { useAuth } from '../../hooks/useAuth';

const DashboardSongs = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSong, setEditingSong] = useState(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await musicService.getAllMusic();
      // Filter to only show songs owned by the logged-in artist
      const artistSongs = (res.musics || []).filter(song => song.artist?._id === (user?.id || user?._id));
      setSongs(artistSongs);
      setError(null);
    } catch (err) {
      setError('Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchSongs();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        await musicService.deleteMusic(id);
        fetchSongs(); // refresh
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete song. Make sure you have permission.");
      }
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await musicService.updateMusic(editingSong._id, {
        title: data.title
      });
      setEditingSong(null);
      fetchSongs();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update song. Make sure you have permission.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <EmptyState icon={Music} title="Error" description={error} />;

  if (editingSong) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Edit Song: {editingSong.title}</h1>
        <MusicForm 
          initialData={editingSong} 
          onSubmit={handleEditSubmit} 
          onCancel={() => setEditingSong(null)} 
          submitLabel="Update Song"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Uploaded Songs</h1>
      </div>

      {songs.length === 0 ? (
        <EmptyState icon={Music} title="No Songs Found" description="You haven't uploaded any songs yet." />
      ) : (
        <div className="bg-stream-card rounded-lg overflow-hidden border border-stream-border/5 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stream-border/10 bg-stream-elevated text-stream-text-secondary text-sm">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song._id} className="border-b border-stream-border/5 hover:bg-stream-elevated/50 transition-colors">
                  <td className="p-4 font-medium">{song.title}</td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => setEditingSong(song)}
                      className="p-2 text-stream-text-secondary hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(song._id)}
                      className="p-2 text-stream-text-secondary hover:text-red-500 transition-colors"
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

export default DashboardSongs;
