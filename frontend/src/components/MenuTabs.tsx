import React from 'react';
import { Utensils, CupSoda } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface MenuTabProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const MenuTab: React.FC<MenuTabProps> = ({ activeCategory, setActiveCategory }) => {
  // 카테고리 정의
  const categories: Category[] = [
    { id: 'snack', name: '안주', icon: <Utensils size={20} /> },
    { id: 'beverage', name: '음료', icon: <CupSoda size={20} /> }
  ];

  return (
    <div className="bg-white shadow-md rounded-xl mb-6 overflow-hidden">
      <div className="flex">
        {categories.map(category => (
          <button
            key={category.id}
            className={`flex-1 flex flex-col items-center py-3 ${
              activeCategory === category.name
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => setActiveCategory(category.name)}
          >
            <div className={`p-2 rounded-full mb-1 ${
              activeCategory === category.name 
                ? 'bg-blue-500 bg-opacity-30 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {category.icon}
            </div>
            <span className="text-sm font-medium">{category.name} 종목</span>
            <span className="text-xs mt-0.5 opacity-75">
              {category.name === '안주' ? '5종' : '4종'}
            </span>
          </button>
        ))}
      </div>
      
      {/* 메뉴 정보 */}
      <div className="flex border-t border-gray-100">
        <div className="flex-1 border-r border-gray-100 p-3 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{activeCategory} 지수</h3>
            <p className="text-sm text-gray-500">
              현재 거래가 가장 활발한 메뉴
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">
              {activeCategory === '안주' ? '모듬 소세지' : '레몬에이드'}
            </p>
            <p className="text-sm text-green-600">
              {activeCategory === '안주' ? '+4.2%' : '+2.5%'}
            </p>
          </div>
        </div>
        <div className="flex-1 p-3 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">추천 매수 종목</h3>
            <p className="text-sm text-gray-500">
              상승 추세가 강한 메뉴
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">
              {activeCategory === '안주' ? '감자튀김' : '아이스티'}
            </p>
            <p className="text-sm text-green-600">
              {activeCategory === '안주' ? '+3.7%' : '+1.2%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTab;