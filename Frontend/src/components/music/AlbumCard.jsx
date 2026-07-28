const AlbumCard = () => (
  <div className="bg-stream-elevated p-4 rounded-xl hover:bg-stream-highlight transition-colors cursor-pointer">
    <div className="w-full aspect-square bg-stream-highlight rounded-md mb-4 shadow-lg"></div>
    <h4 className="font-semibold truncate">Album Title</h4>
  </div>
);
export default AlbumCard;