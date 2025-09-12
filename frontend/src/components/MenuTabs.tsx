import React from 'react';
import { Target, Star } from 'lucide-react';

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
    { id: 'snack', name: '메인 메뉴', icon: <Target size={18} /> },
    { id: 'beverage', name: '사이드 메뉴', icon: <Star size={18} /> }
  ];

  return (
    <div className="mb-4">
      {/* 컴팩트한 서부 스타일 탭 */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-50 border-3 border-amber-800 rounded-lg overflow-hidden">
        
        {/* 상단 헤더 - 축소 */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 py-2 px-3 border-b-2 border-amber-800">
          <h2 className="text-center text-sm font-bold font text-yellow-200 tracking-wide"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
            WANTED BOARD
          </h2>
        </div>

        {/* 탭 버튼들 - 간소화 */}
        <div className="flex">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`
                flex-1 py-3 px-2 transition-all duration-300 font border-r border-amber-300 last:border-r-0
                ${activeCategory === category.id
                  ? 'bg-amber-600 text-amber-100 shadow-inner'
                  : 'text-amber-900 hover:bg-amber-200'
                }
              `}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="flex flex-col items-center space-y-1">
                <div className={`
                  p-1.5 rounded-full border transition-all
                  ${activeCategory === category.id 
                    ? 'bg-amber-500 text-amber-100 border-amber-400' 
                    : 'bg-amber-200 text-amber-800 border-amber-500'
                  }
                `}>
                  {category.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <p className="text-xs text-amber-700">
                    {category.id === 'snack' ? '4명' : '8명'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 현상범 정보 패널 - 모바일 최적화 */}
        <div className="bg-amber-700 p-3">
          <div className="grid grid-cols-1 gap-2 text-xs">
            
            {/* 최고 현상범 - 한 줄로 축소 */}
            <div className="bg-amber-950 bg-opacity-40 p-2 rounded border border-amber-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">👑</span>
                  <span className="font-bold text-yellow-300 font">최고 위험</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-yellow-200 font">
                    {activeCategory === 'snack' ? '빌리 더 키드' : '독 홀리데이'}
                  </span>
                  <span className="text-red-400 font-semibold">🔥</span>
                </div>
              </div>
            </div>
            
            {/* 보안관 추천 - 한 줄로 축소 */}
            <div className="bg-amber-950 bg-opacity-40 p-2 rounded border border-amber-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">⭐</span>
                  <span className="font-bold text-yellow-300 font">추천 대상</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-yellow-200 font">
                    {activeCategory === 'snack' ? '부치 캐시디' : '블랙 바트'}
                  </span>
                  <span className="text-blue-400 font-semibold">⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTab;