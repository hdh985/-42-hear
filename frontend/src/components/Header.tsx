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
              <p className="text-xs text-blue-200">제42대 외국어대학 학생회 hear</p>
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

        
      </div>

      <div className="overflow-hidden">
        <div className="inline-flex animate-marquee whitespace-nowrap text-xs space-x-4 px-4">
          <span className="text-green-400">세계로 나아가는 히어컴퍼니 </span>
          <span className="text-green-400">Moving Toward the World </span>
          <span className="text-green-400">迈向世界 </span>
          <span className="text-green-400">世界へ向かって進む </span>
          <span className="text-green-400">Двигаясь навстречу мир </span>
          <span className="text-green-400">En marche vers le monde  </span>
          <span className="text-green-400">Avanzando hacia el mundo  </span>
            
        </div>
      </div>
    </div>
  </header>
);

export default Header;
