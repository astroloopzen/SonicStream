const ArtistCard = () => (
  <div className="flex flex-col items-center p-4 hover:bg-stream-highlight rounded-xl transition-colors cursor-pointer">
    <div className="w-32 h-32 bg-stream-elevated rounded-full mb-4 shadow-lg"></div>
    <h4 className="font-semibold">Artist Name</h4>
  </div>
);
export default ArtistCard;