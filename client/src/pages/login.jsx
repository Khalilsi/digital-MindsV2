import React from 'react';
import CrButton from '../components/CrButton';
import bgImage from '../assets/login.png';

const Login = () => {
  return (
    // Main Container
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* 1. THE IMAGE (Bottom Layer) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }} // Replace with your image path
      ></div>

      {/* 2. THE BLACK SHADOW/OVERLAY (Middle Layer) */}
      <div className="fixed inset-0 z-10 bg-black/50"></div>

      {/* 3. THE FORM (Top Layer) */}
      <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl border-8  shadow-2xl overflow-hidden animate-fadeIn">

        {/* Input Area */}
        <div className="p-8 space-y-4">
          
          {/* Username Field */}
          <div className="space-y-1">
            <label className="text-sm font-luckiest text-[#C21A1A] uppercase ml-2">Username</label>
            <input 
              type="text" 
              placeholder="NAME..." 
              className=" text-black w-full p-3 bg-gray-100 border-4 border-gray-300 rounded-2xl text-center font-luckiest text-lg focus:border-cr-blue focus:outline-none transition-all placeholder:opacity-30"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-luckiest text-[#C21A1A] uppercase ml-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className=" text-black w-full p-3 bg-gray-100 border-4 border-gray-300 rounded-2xl text-center font-luckiest text-lg focus:border-cr-blue focus:outline-none transition-all placeholder:opacity-30"
            />
          </div>

          <div className="flex justify-center pt-2">
            <CrButton color="blue">
              Login
            </CrButton>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t-2 border-gray-200">
          <p className="text-[10px] text-gray-400 font-sans uppercase">
            Need help? Contact your Clan Leader (Host)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;