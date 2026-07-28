const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "px-6 py-2 rounded-full font-semibold transition-transform hover:scale-105";
  const variants = {
    primary: "bg-stream-accent text-white",
    secondary: "bg-stream-elevated text-white hover:bg-stream-highlight",
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
export default Button;