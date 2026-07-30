import { useState, useEffect, useContext } from 'react';
import { musicService } from '../../services/musicService';
import { PlayerContext } from '../../context/PlayerContext';
import { AuthContext } from '../../context/AuthContext';
import SongCard from '../../components/music/SongCard';
import AlbumCard from '../../components/music/AlbumCard';
import ArtistCard from '../../components/music/ArtistCard';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { currentSong, playSong } = useContext(PlayerContext);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [trendingData, recentData, playlistsData] = await Promise.all([
          musicService.getTrending(),
          musicService.getAllMusic(),
          musicService.getPlaylists()
        ]);
        
        setTrending(trendingData.musics || []);
        setRecent(recentData.musics || []);
        setPlaylists(playlistsData.playlists || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Failed to load music feed. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handlePlaySong = async (song, queueToPlay) => {
    try {
      // playSong handles calling the backend API now inside the context
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-green-500 text-black rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* 1. Hero Section */}
      <section className="mb-10 pt-6">
        <h1 className="text-4xl font-bold mb-2">
          {getGreeting()}, {user?.username || 'Guest'}
        </h1>
        <p className="text-gray-400">Welcome to SonicStream. Discover your next favorite track.</p>
      </section>

      {/* 2. Trending Songs */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Trending Now</h2>
          <span className="text-sm font-semibold text-gray-400 hover:text-white cursor-pointer uppercase tracking-wider">Show all</span>
        </div>
        
        {trending.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trending.map((song) => (
              <SongCard key={song._id} song={song} onPlay={(s) => handlePlaySong(s, trending)} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 py-8 bg-stream-elevated rounded-xl text-center">
            No trending songs available at the moment.
          </div>
        )}
      </section>

      {/* 3. Recently Added Songs */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Recently Added</h2>
          <span 
            onClick={() => setShowAllRecent(!showAllRecent)}
            className="text-sm font-semibold text-gray-400 hover:text-white cursor-pointer uppercase tracking-wider"
          >
            {showAllRecent ? 'Show less' : 'Show all'}
          </span>
        </div>
        
        {recent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {(showAllRecent ? recent : recent.slice(0, 6)).map((song) => (
              <SongCard key={song._id} song={song} onPlay={(s) => handlePlaySong(s, recent)} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 py-8 bg-stream-elevated rounded-xl text-center">
            No recently added songs found.
          </div>
        )}
      </section>

      {/* 4. Albums / Playlists */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Popular Playlists & Albums</h2>
        </div>
        
        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {playlists.map((playlist) => (
              <AlbumCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 py-8 bg-stream-elevated rounded-xl text-center">
            No albums or playlists available. Create one to see it here!
          </div>
        )}
      </section>

      {/* 5. Popular Artists (Backend limitation placeholder) */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Popular Artists</h2>
        </div>
        
        <div className="text-gray-400 p-6 bg-stream-elevated rounded-xl text-center border border-gray-700">
          <h3 className="font-semibold text-white mb-2">Artist discovery coming soon!</h3>
          <p className="text-sm">
            Currently, our backend API does not support fetching standalone artist profiles or a popular artists list. 
            This section will be populated once the <code className="bg-gray-800 px-1 rounded">/api/artists/popular</code> endpoint is implemented.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;