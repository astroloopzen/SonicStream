const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative w-full max-w-md">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span className="text-gray-400 text-lg">🔍</span>
    </div>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="What do you want to listen to?" 
      className="w-full bg-stream-elevated text-white pl-10 pr-10 py-3 rounded-full outline-none focus:ring-2 focus:ring-white border border-transparent transition-all"
    />
    {value && (
      <button 
        onClick={onClear}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
      >
        ✕
      </button>
    )}
  </div>
);
export default SearchBar;