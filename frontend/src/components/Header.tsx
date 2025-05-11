import React from 'react';
import { BarChart2, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  toggleOrder: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, cartTotal, toggleOrder }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-2 rounded-lg mr-2 hidden sm:flex">
                <BarChart2 size={28} className="text-white" />
              </div>
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-1.5 rounded-lg mr-2 sm:hidden">
                <BarChart2 size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">히어컴퍼니</h1>
                <p className="text-xs text-blue-200 mt-0.5 hidden sm:block">제42대 외국어대학 학생회 HEAR</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-6">
              {/* 데스크톱 시장 정보 */}
              <div className="hidden md:flex space-x-6">
                <div className="flex items-center bg-blue-800 bg-opacity-60 p-2 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div>
                    <p className="text-xs text-blue-200">KHUSDAQ</p>
                    <p className="text-sm font-bold">+2.35%</p>
                  </div>
                </div>
                <div className="flex items-center bg-blue-800 bg-opacity-60 p-2 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div>
                    <p className="text-xs text-blue-200">거래량</p>
                    <p className="text-sm font-bold">15,824</p>
                  </div>
                </div>
              </div>
              
              {/* 장바구니 버튼 */}
              <div className="relative">
                <button 
                  onClick={toggleOrder}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 py-1.5 px-3 sm:py-2 sm:px-4 rounded-full transition-colors shadow-md"
                >
                  <ShoppingCart size={18} className="mr-1" />
                  <span className="hidden sm:inline font-medium mr-1">장바구니</span>
                  <span className="font-medium">₩{cartTotal.toLocaleString()}</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* 모바일 시장 정보 */}
          <div className="flex justify-center mt-2 md:hidden">
            <div className="flex space-x-4">
              <div className="flex items-center bg-blue-800 bg-opacity-60 px-2 py-1 rounded-lg">
                <TrendingUp size={14} className="mr-1 text-green-400" />
                <span className="text-blue-100 text-sm">KHUSDAQ +2.35%</span>
              </div>
              <div className="flex items-center bg-blue-800 bg-opacity-60 px-2 py-1 rounded-lg">
                <DollarSign size={14} className="mr-1 text-blue-300" />
                <span className="text-blue-100 text-sm">거래량: 15,824</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 시장 정보 티커 */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 py-2 overflow-hidden shadow-inner">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="mx-4 text-green-400 font-medium">모듬 소세지 +4.2%</span>
          <span className="mx-4 text-green-400 font-medium">감자튀김 +3.7%</span>
          <span className="mx-4 text-red-400 font-medium">닭강정 -2.4%</span>
          <span className="mx-4 text-green-400 font-medium">레몬에이드 +2.5%</span>
          <span className="mx-4 text-green-400 font-medium">아이스티 +1.2%</span>
          <span className="mx-4 text-red-400 font-medium">치킨 버거 -8.5%</span>
          <span className="mx-4 text-green-400 font-medium">콜라 +0.1%</span>
          <span className="mx-4 text-green-400 font-medium">사이다 +0.3%</span>
        </div>
      </div>
    </header>
  );
};

export default Header;