const CrButton = ({ children, color = 'blue', size = 'md', className = '', onClick, ...rest }) => {
  const styles = {
    blue: "bg-cr-blue border-cr-blue-dark text-white",
    gold: "bg-cr-gold border-cr-gold-dark text-black",
    red: "bg-cr-red border-red-900 text-white"
  };

  const sizeStyles = {
    md: "px-7 py-3 text-base",
    sm: "px-4 py-2 text-sm",
    icon: "p-2 text-sm"
  };

  return (
    <button
      onClick={onClick}
      className={`${styles[color]} ${sizeStyles[size]} ${className} text-white 
      font-luckiest 
      [text-shadow:0_1.5px_2px_rgba(0,0,0,0.6)]  
      rounded-xl 
      border-b-4 
      tracking-widest 
      shadow-lg 
      hover:bg-opacity-90
      active:border-b-0 
      active:translate-y-1 
      transition-all transform`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CrButton;