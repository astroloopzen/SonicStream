const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = "button" }) => {
  const baseStyle = "px-6 py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:scale-100 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stream-base";
  const variants = {
    primary: "bg-stream-accent text-white hover:bg-stream-accent/90 shadow-lg shadow-stream-accent/20 focus-visible:ring-stream-accent",
    secondary: "bg-stream-elevated text-white hover:bg-stream-highlight border border-stream-border/10 focus-visible:ring-white/30",
  };
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;