import { useNavigate } from 'react-router-dom';

const AlbumCard = ({ playlist }) => {
  const navigate = useNavigate();
  if (!playlist) return null;
  return (
    <div 
      className="bg-stream-elevated p-4 rounded-xl hover:bg-stream-highlight transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-stream-accent/10 cursor-pointer group flex flex-col h-full border border-transparent hover:border-stream-border/10"
      onClick={() => navigate(`/album/${playlist._id}`)}
    >
      <div className="w-full aspect-square bg-stream-highlight/50 rounded-md mb-4 shadow-md overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 text-white text-5xl shadow-sm z-10 hover:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-stream-accent drop-shadow-lg"><path d="M8 5v14l11-7z" /></svg>
        </div>
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-5xl">
          💿
        </div>
      </div>
      <div className="mt-auto pt-2">
        <h4 className="font-semibold truncate text-white">{playlist.title}</h4>
        <p className="text-sm text-gray-400 truncate mt-1">By {playlist.user?.username || 'Unknown'}</p>
      </div>
    </div>
  );
};
export default AlbumCard;