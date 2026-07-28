const SearchBar = () => (
  <div className="relative w-full max-w-md">
    <input 
      type="text" 
      placeholder="What do you want to listen to?" 
      className="w-full bg-stream-elevated text-white px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-stream-accent border border-transparent transition-all"
    />
  </div>
);
export default SearchBar;