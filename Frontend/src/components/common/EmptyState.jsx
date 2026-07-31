const EmptyState = ({ icon: Icon, title, description, message }) => (
  <div className="flex flex-col items-center justify-center text-gray-400 py-20 px-4 bg-stream-elevated/50 rounded-2xl border border-stream-border/10 text-center w-full my-8">
    {Icon && <Icon className="w-16 h-16 mb-4 text-gray-500 opacity-50" />}
    <h3 className="text-xl font-semibold text-white mb-2">{title || message || "No data found"}</h3>
    {description && <p className="text-gray-400 max-w-md">{description}</p>}
  </div>
);
export default EmptyState;