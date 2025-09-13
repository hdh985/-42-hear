import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  toggleOrder: () => void;
}

const Header: React.FC<Props> = ({ cartCount, cartTotal, toggleOrder }) => (
  <header className="w-full flex justify-center bg-[#76231c]">
    <div className="w-full max-w-md bg-gradient-to-b from-[#76231c] via-[#5a1a16] to-[#3d110f] text-amber-100 rounded-t-2xl overflow-hidden shadow-2xl border-4 border-yellow-600 relative">
      {/* Western decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-yellow-500 rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-yellow-500 rounded-tr-2xl"></div>

      {/* Saloon split effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-black opacity-20"></div>

      <div className="px-6 py-4 space-y-4 relative">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <div className="flex items-center">
            <div className="border-2 border-yellow-600 mr-2 shadow-md rounded-lg bg-[#5a1a16] p-1">
              <img src="/hear.jpg" alt="히어컴퍼니 로고" className="w-12 h-12 rounded-md" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-yellow-400 tracking-widest drop-shadow-md">
                HEART SHOT
              </h2>
              <p className="text-xs text-amber-200 font-semibold">
                제42대 외국어대학 학생회 hear
              </p>
            </div>
          </div>

          {/* 장바구니 버튼 */}
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
      </div>

      {/* 서부식 스크롤 배너 */}
      <div className="bg-gradient-to-r from-[#5a1a16] via-[#76231c] to-[#5a1a16] border-t-2 border-yellow-600 overflow-hidden py-2">
        <div className="inline-flex animate-marquee whitespace-nowrap text-sm font space-x-8 px-4">
          {/* Korean */}
          <span className="text-yellow-300 font-bold">🇰🇷 HEART SHOT 부스에 오신 것을 환영합니다!</span>
          {/* Chinese (Simplified) */}
          <span className="text-yellow-300 font-bold">🇨🇳 欢迎来到 HEART SHOT 展位！</span>
          {/* Japanese */}
          <span className="text-yellow-300 font-bold">🇯🇵 HEART SHOTへようこそ！</span>
          {/* English */}
          <span className="text-yellow-300 font-bold">🇺🇸 WELCOME TO THE HEART SHOT!</span>
          {/* French */}
          <span className="text-yellow-300 font-bold">🇫🇷 Bienvenue au HEART SHOT !</span>
          {/* Spanish */}
          <span className="text-yellow-300 font-bold">🇪🇸 ¡Bienvenidos a HEART SHOT!</span>
          {/* Russian */}
          <span className="text-yellow-300 font-bold">🇷🇺 Добро пожаловать в HEART SHOT!</span>
        </div>
      </div>


      {/* 하단 금색 보더 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
    </div>
  </header>
);

export default Header;
