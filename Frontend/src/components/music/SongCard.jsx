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
      className="bg-stream-elevated p-4 rounded-xl hover:bg-stream-highlight transition-colors cursor-pointer group relative"
      onClick={() => onPlay && onPlay(song)}
    >
      <div className="w-full aspect-square bg-stream-highlight rounded-md mb-4 shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 text-green-500 text-4xl shadow-sm z-10">
          ▶
        </div>
        {/* Placeholder for song image since uri might be audio. Can use generic image or cover if provided */}
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-5xl">
          🎵
        </div>
      </div>
      
      <div className="flex justify-between items-start">
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