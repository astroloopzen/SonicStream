import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicService } from '../../services/musicService';
import { PlayerContext } from '../../context/PlayerContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import SongCard from '../../components/music/SongCard';
import Button from '../../components/common/Button';

const Album = () => {
  const { albumId } = useParams();
  const { playSong } = useContext(PlayerContext);
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await musicService.getAlbumById(albumId);
        setAlbum(data.playlist);
      } catch (err) {
        console.error("Error fetching album:", err);
        setError("Album not found.");
      } finally {
        setLoading(false);
      }
    };
    
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const handlePlayAlbum = () => {
    if (album && album.musics && album.musics.length > 0) {
      // Play the first song and pass the entire array as queue
      if (typeof playSong === 'function') {
        playSong(album.musics[0], album.musics);
      } else {
        musicService.playMusic(album.musics[0]._id);
      }
    }
  };

  const handlePlaySong = async (song) => {
    try {
      if (typeof playSong === 'function') {
        playSong(song, album.musics);
      } else {
        await musicService.playMusic(song._id);
        console.log("Playing:", song.title);
      }
    } catch (err) {
      console.error("Error tracking playback:", err);
    }
  };

  if (loading) {
    return <div className="pt-20"><Loader /></div>;
  }

  if (error || !album) {
    return <div className="pt-20"><EmptyState message={error || "Album not found."} /></div>;
  }

  return (
    <div className="pb-32 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-16 pb-8 border-b border-stream-border/10 items-center md:items-end">
        <div className="w-48 h-48 sm:w-56 sm:h-56 bg-stream-elevated/50 rounded-2xl shadow-2xl flex-shrink-0 flex items-center justify-center text-7xl text-gray-500 overflow-hidden border border-stream-border/10 relative">
          💿
        </div>
        
        <div className="flex flex-col gap-3 text-center md:text-left flex-1">
          <p className="text-sm font-bold uppercase tracking-widest text-stream-accent">Album/Playlist</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter">{album.title}</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 text-gray-300 font-medium bg-stream-elevated/30 w-fit md:mx-0 mx-auto py-2 px-4 rounded-full border border-stream-border/5">
            <Link to={`/artist/${album.user?._id}`} className="font-semibold hover:underline hover:text-stream-accent transition-colors flex items-center gap-2">
              <span className="text-xl">👤</span>
              {album.user?.username || 'Unknown Artist'}
            </Link>
            <span className="text-stream-accent">•</span>
            <span>{album.musics ? album.musics.length : 0} songs</span>
          </div>
          <div className="mt-6">
            <Button onClick={handlePlayAlbum} disabled={!album.musics || album.musics.length === 0} className="w-full md:w-auto px-8 py-3">
              <span className="text-xl">▶</span> Play Album
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Songs</h2>
        {album.musics && album.musics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {album.musics.map(song => (
              <SongCard key={song._id} song={song} onPlay={(s) => handlePlaySong(s)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No songs found in this album." />
        )}
      </div>
    </div>
  );
};

export default Album;
