import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { musicService } from '../../services/musicService';

const PlaylistForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save' }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [selectedMusics, setSelectedMusics] = useState(
    initialData?.musics?.map(m => typeof m === 'string' ? m : m._id) || []
  );
  
  const [allMusics, setAllMusics] = useState([]);
  const [loadingMusics, setLoadingMusics] = useState(true);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const res = await musicService.getAllMusic();
        setAllMusics(res.musics || []);
      } catch (err) {
        console.error("Failed to fetch musics", err);
      } finally {
        setLoadingMusics(false);
      }
    };
    fetchMusics();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, musics: selectedMusics });
  };

  const handleToggleMusic = (musicId) => {
    setSelectedMusics(prev => 
      prev.includes(musicId) 
        ? prev.filter(id => id !== musicId)
        : [...prev, musicId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stream-text-secondary mb-2">
          Playlist Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-stream-elevated border border-stream-border/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-stream-highlight transition-colors"
          placeholder="Enter playlist title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stream-text-secondary mb-2">
          Select Songs
        </label>
        {loadingMusics ? (
          <p className="text-stream-text-secondary text-sm">Loading songs...</p>
        ) : (
          <div className="bg-stream-elevated border border-stream-border/10 rounded-md max-h-64 overflow-y-auto p-2">
            {allMusics.map((music) => (
              <label 
                key={music._id} 
                className="flex items-center gap-3 p-2 hover:bg-stream-card rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedMusics.includes(music._id)}
                  onChange={() => handleToggleMusic(music._id)}
                  className="w-4 h-4 rounded bg-stream-base border-stream-border text-stream-highlight focus:ring-stream-highlight focus:ring-offset-stream-base"
                />
                <div className="flex-1 truncate">
                  <span className="text-white block truncate">{music.title}</span>
                  <span className="text-xs text-stream-text-secondary block truncate">
                    {music.artist?.username || 'Unknown Artist'}
                  </span>
                </div>
              </label>
            ))}
            {allMusics.length === 0 && (
              <p className="text-stream-text-secondary text-sm p-4 text-center">No songs available</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default PlaylistForm;
