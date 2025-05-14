import React from 'react';
import { BarChart2, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  toggleOrder: () => void;
}

const Header: React.FC<Props> = ({ cartCount, cartTotal, toggleOrder }) => (
  <header className="w-full flex justify-center bg-gray-100">
    <div className="w-full max-w-md bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-t-2xl overflow-hidden shadow-md">
      <div className="px-4 py-3 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-2">
              <BarChart2 size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">히어컴퍼니</h1>
              <p className="text-xs text-blue-200">제42대 외국어대학 학생회 HEAR</p>
            </div>
          </div>
          <button onClick={toggleOrder} className="relative bg-blue-500 px-3 py-1 rounded-full text-sm shadow">
            <ShoppingCart size={16} className="inline mr-1" /> ₩{cartTotal.toLocaleString()}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex space-x-2">
          <div className="flex items-center bg-blue-800 bg-opacity-60 px-2 py-1 rounded-lg flex-1 justify-center">
            <TrendingUp size={14} className="mr-1 text-green-400" />
            <span>KHUSDAQ +2.35%</span>
          </div>
          <div className="flex items-center bg-blue-800 bg-opacity-60 px-2 py-1 rounded-lg flex-1 justify-center">
            <DollarSign size={14} className="mr-1 text-blue-300" />
            <span>거래량: 15,824</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="inline-flex animate-marquee whitespace-nowrap text-xs space-x-4 px-4">
          <span className="text-green-400">수육 +4.2%</span>
          <span className="text-green-400">에그인헬 +3.7%</span>
          <span className="text-red-400">닭강정 -2.4%</span>
          <span className="text-green-400">묵사발 +2.5%</span>
          <span className="text-green-400">라면땅 +1.2%</span>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
