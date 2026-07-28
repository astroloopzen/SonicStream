const EmptyState = ({ message = "No data found." }) => (
  <div className="flex flex-col items-center justify-center text-gray-400 py-12">
    <p>{message}</p>
  </div>
);
export default EmptyState;