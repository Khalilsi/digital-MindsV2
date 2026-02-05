import React from 'react';
import logo from '../assets/logoHackathon.png';

const Navbar = () => {
  return (
    <nav className="w-full h-auto bg-[#163a82] border-b-2 border-black shadow-lg fixed top-0 z-50">
      {/* Texture Overlay (Makes the grey look like stone) */}

      {/* Content Container (Full width with padding) */}
      <div className="w-full flex justify-between items-center px-4 relative z-10">
        
        {/* LEFT SIDE: Big Logo */}
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Hackathon Logo" 
            className="max-h-24 w-auto transform drop-shadow-xl hover:scale-105 transition-transform cursor-pointer" 
          />
        </div>

        {/* RIGHT SIDE: Login Button */}
        <div className="flex items-center">
          <button className="bg-cr-blue border-b-4 border-cr-blue-dark px-8 py-1.5 rounded-xl text-white font-luckiest text-lg shadow-md active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wider">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;