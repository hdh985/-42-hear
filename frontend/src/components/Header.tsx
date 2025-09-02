import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  toggleOrder: () => void;
}

const Header: React.FC<Props> = ({ cartCount, cartTotal, toggleOrder }) => (
  <header className="w-full flex justify-center bg-amber-100">
    <div className="w-full max-w-md bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 text-amber-100 rounded-t-2xl overflow-hidden shadow-2xl border-4 border-amber-600 relative">
      {/* Western decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-yellow-400 rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-yellow-400 rounded-tr-2xl"></div>
      
      {/* Saloon doors effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-amber-900 opacity-30"></div>
      
      <div className="px-6 py-4 space-y-4 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-amber-900 border-2 border-yellow-600 p-2 rounded-lg mr-3 shadow-inner">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-amber-900 font-bold text-lg">★</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-300 font-serif tracking-wide drop-shadow-lg">
                히어스턴스
              </h1>
              <h2 className="text-lg font-bold text-yellow-400 font-serif tracking-wider drop-shadow-md">
                Heart Shot
              </h2>
              <p className="text-xs text-amber-200 font-serif italic">
                Est. 1875 • Fine Spirits & Community
              </p>
            </div>
          </div>
          
          <button 
            onClick={toggleOrder} 
            className="relative bg-gradient-to-b from-yellow-600 to-yellow-700 border-2 border-yellow-500 px-4 py-2 rounded-lg text-sm font-bold text-amber-900 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ShoppingCart size={16} className="inline mr-1" /> 
            <span className="font-serif">₩{cartTotal.toLocaleString()}</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 border-2 border-red-400 rounded-full text-white w-6 h-6 text-xs flex items-center justify-center font-bold shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Decorative western elements */}
        <div className="flex justify-center space-x-2 text-yellow-500">
          <span className="text-lg">🤠</span>
          <span className="text-lg">🥃</span>
          <span className="text-lg">⭐</span>
          <span className="text-lg">🥃</span>
          <span className="text-lg">🤠</span>
        </div>
      </div>

      {/* Saloon-style scrolling banner */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 border-t-2 border-yellow-600 overflow-hidden py-2">
        <div className="inline-flex animate-marquee whitespace-nowrap text-sm font-serif space-x-8 px-4">
          <span className="text-yellow-300 font-bold">🍻 WELCOME TO THE WILDEST SALOON IN TOWN</span>
          <span className="text-yellow-300 font-bold">🤠 FINEST DRINKS & GRUB SERVED DAILY</span>
          <span className="text-yellow-300 font-bold">⭐ WHERE LEGENDS ARE BORN</span>
          <span className="text-yellow-300 font-bold">🥃 COLD BEER & HOT DEALS</span>
          <span className="text-yellow-300 font-bold">🎰 FORTUNE FAVORS THE BOLD</span>
        </div>
      </div>

      {/* Western border pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
    </div>
  </header>
);

export default Header;