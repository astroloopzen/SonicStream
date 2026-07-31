import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SongCard = ({ song, onPlay }) => {
  const { favorites, toggleFavorite, isAuthenticated } = useContext(AuthContext);
  
  if (!song) return null;
  
  const isFavorite = favorites && favorites.includes(song._id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent playing the song when clicking the heart
    if (isAuthenticated) {
      toggleFavorite(song._id);
    }
  };

  return (
    <div 
      className="bg-stream-elevated p-4 rounded-xl hover:bg-stream-highlight transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-stream-accent/10 cursor-pointer group relative flex flex-col h-full border border-transparent hover:border-stream-border/10"
      onClick={() => onPlay && onPlay(song)}
    >
      <div className="w-full aspect-square bg-stream-highlight/50 rounded-md mb-4 shadow-md overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 text-white text-5xl shadow-sm z-10 hover:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-stream-accent drop-shadow-lg"><path d="M8 5v14l11-7z" /></svg>
        </div>
        {/* Placeholder for song image since uri might be audio. Can use generic image or cover if provided */}
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-5xl">
          🎵
        </div>
      </div>
      
      <div className="flex justify-between items-start mt-auto pt-2">
        <div className="overflow-hidden flex-1 pr-2">
          <h4 className="font-semibold truncate text-white">{song.title}</h4>
          <p className="text-sm text-gray-400 truncate">{song.artist?.username || 'Unknown Artist'}</p>
        </div>
        
        {isAuthenticated && (
          <button 
            onClick={handleFavoriteClick}
            className={`text-xl hover:scale-110 transition-transform ${isFavorite ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        )}
      </div>
    </div>
  );
};
export default SongCard;