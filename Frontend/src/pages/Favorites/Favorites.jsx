import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { PlayerContext } from '../../context/PlayerContext';
import { authService } from '../../services/authService';
import { musicService } from '../../services/musicService';
import SongCard from '../../components/music/SongCard';

const Favorites = () => {
  const { favorites } = useContext(AuthContext);
  const { playSong } = useContext(PlayerContext);
  const [fetchedSongs, setFetchedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await authService.getFavorites();
        setFetchedSongs(data.favourites || []);
      } catch (err) {
        console.error("Failed to load favorites", err);
        setError("Could not load your liked songs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []); // Only fetch once on mount

  // Filter against context to instantly remove unliked songs without refetching
  const displayedSongs = fetchedSongs.filter(song => favorites.includes(song._id));

  const handlePlaySong = async (song, queueToPlay) => {
    try {
      if (typeof playSong === 'function') {
        playSong(song, queueToPlay);
      } else {
        await musicService.playMusic(song._id);
        console.log("Playing:", song.title);
      }
    } catch (err) {
      console.error("Error tracking playback:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center rounded-xl shadow-2xl flex-shrink-0">
          <span className="text-6xl text-white">♥</span>
        </div>
        <div>
          <h4 className="uppercase text-sm font-bold tracking-widest mb-1 text-gray-300">Playlist</h4>
          <h1 className="text-5xl font-extrabold text-white mb-4">Liked Songs</h1>
          <p className="text-gray-400 text-sm font-semibold">
            {displayedSongs.length} {displayedSongs.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
      </div>

      {displayedSongs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {displayedSongs.map((song) => (
            <SongCard 
              key={song._id} 
              song={song} 
              onPlay={(s) => handlePlaySong(s, displayedSongs)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-stream-elevated rounded-xl border border-stream-highlight border-opacity-50">
          <span className="text-4xl mb-4 opacity-50">🎵</span>
          <h2 className="text-xl font-bold text-white mb-2">Songs you like will appear here</h2>
          <p className="text-gray-400">Save songs by tapping the heart icon.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;