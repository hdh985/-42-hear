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
  const categories: Category[] = [
    { id: 'snack', name: '메인', icon: <Utensils size={16} /> },
    { id: 'beverage', name: '사이드', icon: <CupSoda size={16} /> }
  ];

  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <div className="flex">
        {categories.map(category => (
          <button
            key={category.id}
            className={`flex-1 flex flex-col items-center py-2 ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600'
            } transition-colors`}
            onClick={() => setActiveCategory(category.id)}
          >
            <div className={`p-1.5 rounded-full mb-1 ${
              activeCategory === category.id 
                ? 'bg-blue-500 bg-opacity-30 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {category.icon}
            </div>
            <span className="text-sm font-medium">{category.name} 종목</span>
            <span className="text-xs mt-0.5 opacity-75">
              {category.id === 'snack' ? '5종' : '5종'}
            </span>
          </button>
        ))}
      </div>

      <div className="flex border-t border-gray-100 text-xs">
        <div className="flex-1 border-r border-gray-100 p-2 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{categories.find(c => c.id === activeCategory)?.name} 지수</h3>
            <p className="text-gray-500">거래 활발한 메뉴</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">
              {activeCategory === 'snack' ? '수육' : '묵사발'}
            </p>
            <p className="text-green-600">
              {activeCategory === 'snack' ? '+2.0%' : '+1.0%'}
            </p>
          </div>
        </div>
        <div className="flex-1 p-2 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">추천 매수 종목</h3>
            <p className="text-gray-500">상승세 메뉴</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">
              {activeCategory === 'snack' ? '닭강정' : '후르츠 황도'}
            </p>
            <p className="text-green-600">
              {activeCategory === 'snack' ? '+2.0%' : '+0.5%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTab;
