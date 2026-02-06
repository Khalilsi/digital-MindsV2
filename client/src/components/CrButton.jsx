const CrButton = ({ children, color = 'blue', onClick }) => {
  const styles = {
    blue: "bg-cr-blue border-cr-blue-dark text-white",
    gold: "bg-cr-gold border-cr-gold-dark text-black",
    red: "bg-cr-red border-red-900 text-white"
  };

  return (
    <button 
      onClick={onClick}
      className={`${styles[color]} text-white  font-luckiest [text-shadow:0_1.5px_2px_rgba(0,0,0,0.6)]  px-7 py-3 rounded-xl border-b-4 tracking-widest shadow-lg active:border-b-0 active:translate-y-1 transition-all transform`}
    >
      {children}
    </button>
  );
};

export default CrButton;