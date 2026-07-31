import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();
  if (!artist) return null;
  return (
    <div 
      className="flex flex-col items-center p-6 hover:bg-stream-highlight transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-stream-accent/10 rounded-xl cursor-pointer group border border-transparent hover:border-stream-border/10"
      onClick={() => navigate(`/artist/${artist._id}`)}
    >
      <div className="w-32 h-32 bg-stream-highlight/50 rounded-full mb-4 shadow-md overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 text-white text-5xl shadow-sm rounded-full z-10 hover:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-stream-accent drop-shadow-lg"><path d="M8 5v14l11-7z" /></svg>
        </div>
        {artist.profilePicture ? (
          <img src={artist.profilePicture} alt={artist.username} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 text-4xl">
            👤
          </div>
        )}
      </div>
      <h4 className="font-semibold text-white">{artist.username || 'Artist Name'}</h4>
    </div>
  );
};
export default ArtistCard;