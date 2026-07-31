import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { musicService } from '../../services/musicService';
import { PlayerContext } from '../../context/PlayerContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import SongCard from '../../components/music/SongCard';
import AlbumCard from '../../components/music/AlbumCard';

const Artist = () => {
  const { artistId } = useParams();
  const { playSong } = useContext(PlayerContext);
  
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await musicService.getArtistById(artistId);
        setArtist(data.artist);
        setAlbums(data.albums || []);
        setSongs(data.songs || []);
      } catch (err) {
        console.error("Error fetching artist:", err);
        setError("Artist not found.");
      } finally {
        setLoading(false);
      }
    };
    
    if (artistId) {
      fetchArtist();
    }
  }, [artistId]);

  const handlePlaySong = async (song) => {
    try {
      if (typeof playSong === 'function') {
        playSong(song, songs);
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

  if (error || !artist) {
    return <div className="pt-20"><EmptyState message={error || "Artist not found."} /></div>;
  }

  return (
    <div className="pb-32 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Artist Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-16 pb-8 border-b border-stream-border/10 items-center md:items-end">
        <div className="w-48 h-48 sm:w-56 sm:h-56 bg-stream-elevated/50 rounded-full shadow-2xl flex-shrink-0 flex items-center justify-center text-7xl text-gray-500 overflow-hidden border-4 border-stream-accent/20 shadow-stream-accent/10 relative">
          {artist.profilePicture ? (
            <img src={artist.profilePicture} alt={artist.username} className="w-full h-full object-cover" />
          ) : (
            <span>👤</span>
          )}
        </div>
        <div className="flex flex-col gap-3 text-center md:text-left flex-1">
          <p className="text-sm font-bold uppercase tracking-widest text-stream-accent">Artist</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter">{artist.username}</h1>
          <div className="flex items-center justify-center md:justify-start gap-4 text-gray-300 font-medium bg-stream-elevated/30 w-fit md:mx-0 mx-auto py-2 px-4 rounded-full border border-stream-border/5">
            <span>{albums.length} Albums</span>
            <span className="text-stream-accent">•</span>
            <span>{songs.length} Songs</span>
          </div>
        </div>
      </div>

      {/* Albums Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Albums</h2>
        {albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {albums.map(album => (
              <AlbumCard key={album._id} playlist={album} />
            ))}
          </div>
        ) : (
          <EmptyState message="No albums found for this artist." />
        )}
      </div>

      {/* Songs Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Top Songs</h2>
        {songs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {songs.map(song => (
              <SongCard key={song._id} song={song} onPlay={(s) => handlePlaySong(s)} />
            ))}
          </div>
        ) : (
          <EmptyState message="No songs found for this artist." />
        )}
      </div>
    </div>
  );
};

export default Artist;
