const SongCard = ({ song, onPlay }) => {
  if (!song) return null;
  return (
    <div 
      className="bg-stream-elevated p-4 rounded-xl hover:bg-stream-highlight transition-colors cursor-pointer group"
      onClick={() => onPlay && onPlay(song)}
    >
      <div className="w-full aspect-square bg-stream-highlight rounded-md mb-4 shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 text-green-500 text-4xl shadow-sm">
          ▶
        </div>
        {/* Placeholder for song image since uri might be audio. Can use generic image or cover if provided */}
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-5xl">
          🎵
        </div>
      </div>
      <h4 className="font-semibold truncate text-white">{song.title}</h4>
      <p className="text-sm text-gray-400 truncate">{song.artist?.username || 'Unknown Artist'}</p>
    </div>
  );
};
export default SongCard;