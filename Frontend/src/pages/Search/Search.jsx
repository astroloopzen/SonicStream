import { useState, useEffect } from 'react';
import SearchBar from '../../components/music/SearchBar';
import { searchService } from '../../services/searchService';
import { musicService } from '../../services/musicService';
import SongCard from '../../components/music/SongCard';
import AlbumCard from '../../components/music/AlbumCard';
import ArtistCard from '../../components/music/ArtistCard';

const Search = () => {
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

  const handlePlaySong = async (song) => {
    try {
      await musicService.playMusic(song._id);
      console.log("Playing:", song.title);
      // NOTE: Context update logic for player state goes here when player is ready
    } catch (err) {
      console.error("Error playing song:", err);
    }
  };

  const hasResults = results && (
    (results.songs && results.songs.length > 0) ||
    (results.playlists && results.playlists.length > 0) ||
    (results.artists && results.artists.length > 0)
  );

  return (
    <div className="pb-24 pt-6">
      <div className="mb-8">
        <SearchBar 
          value={query} 
          onChange={setQuery} 
          onClear={() => setQuery('')} 
        />
      </div>

      {!debouncedQuery.trim() && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <span className="text-4xl mb-4">🔍</span>
          <p className="text-xl font-semibold text-white">Start typing to search</p>
          <p className="mt-2">Find your favorite songs, artists, and playlists.</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900 bg-opacity-20 border border-red-500 text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && debouncedQuery.trim() && !hasResults && results && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <span className="text-4xl mb-4">🤷‍♂️</span>
          <p className="text-xl font-semibold text-white">No results found for "{debouncedQuery}"</p>
          <p className="mt-2">Please make sure your words are spelled correctly or use less or different keywords.</p>
        </div>
      )}

      {!loading && hasResults && (
        <div className="space-y-12">
          {/* Songs Section */}
          {results.songs && results.songs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Songs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.songs.map(song => (
                  <SongCard key={song._id} song={song} onPlay={handlePlaySong} />
                ))}
              </div>
            </section>
          )}

          {/* Albums/Playlists Section */}
          {results.playlists && results.playlists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Albums & Playlists</h2>
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
              <h2 className="text-2xl font-bold mb-6">Artists</h2>
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