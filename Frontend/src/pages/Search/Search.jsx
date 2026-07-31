import { useState, useEffect, useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import SearchBar from '../../components/music/SearchBar';
import { searchService } from '../../services/searchService';
import { musicService } from '../../services/musicService';
import SongCard from '../../components/music/SongCard';
import AlbumCard from '../../components/music/AlbumCard';
import ArtistCard from '../../components/music/ArtistCard';

const Search = () => {
  const { playSong } = useContext(PlayerContext);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setError(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchService.search(debouncedQuery);
        setResults(data.results);
      } catch (err) {
        console.error("Search error:", err);
        setError("An error occurred while searching. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

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

  const hasResults = results && (
    (results.songs && results.songs.length > 0) ||
    (results.playlists && results.playlists.length > 0) ||
    (results.artists && results.artists.length > 0)
  );

  return (
    <div className="pb-32 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <SearchBar 
          value={query} 
          onChange={setQuery} 
          onClear={() => setQuery('')} 
        />
      </div>

      {!debouncedQuery.trim() && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
          <span className="text-6xl mb-6">🔍</span>
          <p className="text-2xl font-bold text-white mb-2">Start typing to search</p>
          <p className="text-gray-400">Find your favorite songs, artists, and playlists.</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center font-medium max-w-2xl mx-auto mt-12">
          {error}
        </div>
      )}

      {!loading && !error && debouncedQuery.trim() && !hasResults && results && (
        <div className="flex flex-col items-center justify-center h-[40vh] text-gray-400 bg-stream-elevated/30 rounded-3xl border border-stream-border/5 mt-8">
          <span className="text-6xl mb-6 opacity-50">🤷‍♂️</span>
          <p className="text-2xl font-bold text-white mb-2">No results found for "{debouncedQuery}"</p>
          <p className="text-gray-400 max-w-md text-center">Please make sure your words are spelled correctly or use less or different keywords.</p>
        </div>
      )}

      {!loading && hasResults && (
        <div className="space-y-16">
          {/* Songs Section */}
          {results.songs && results.songs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-white">Songs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.songs.map(song => (
                  <SongCard key={song._id} song={song} onPlay={(s) => handlePlaySong(s, results.songs)} />
                ))}
              </div>
            </section>
          )}

          {/* Albums/Playlists Section */}
          {results.playlists && results.playlists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-white">Albums & Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.playlists.map(playlist => (
                  <AlbumCard key={playlist._id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}

          {/* Artists Section */}
          {results.artists && results.artists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-white">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.artists.map(artist => (
                  <ArtistCard key={artist._id} artist={artist} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;