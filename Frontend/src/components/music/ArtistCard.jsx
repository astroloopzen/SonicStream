const ArtistCard = ({ artist }) => {
  if (!artist) return null;
  return (
    <div className="flex flex-col items-center p-4 hover:bg-stream-highlight rounded-xl transition-colors cursor-pointer group">
      <div className="w-32 h-32 bg-stream-elevated rounded-full mb-4 shadow-lg overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 text-green-500 text-3xl shadow-sm rounded-full">
          ▶
        </div>
        <div className="text-gray-500 text-4xl">
          👤
        </div>
      </div>
      <h4 className="font-semibold text-white">{artist.username || 'Artist Name'}</h4>
    </div>
  );
};
export default ArtistCard;