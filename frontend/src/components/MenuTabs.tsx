import React from 'react';

interface Category {
  id: string;
  name: string;
  imgSrc: string;
}

interface MenuTabProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const MenuTab: React.FC<MenuTabProps> = ({ activeCategory, setActiveCategory }) => {
  const categories: Category[] = [
    { id: 'snack', name: '메인 메뉴', imgSrc: '/main.png' },
    { id: 'beverage', name: '사이드 메뉴', imgSrc: '/side.png' }
  ];

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-b from-[#8b4513] via-[#5a1a16] to-[#3d110f] border-4 border-yellow-700 rounded-xl overflow-hidden shadow-xl relative">
        
        {/* 타이틀 */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 py-2 border-b-4 border-yellow-800 relative z-10">
          <h2
            className="text-center text-base font-extrabold text-amber-100 tracking-widest flex items-center justify-center space-x-2"
            style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.7)' }}
          >
            <span>⭐</span>
            <span>WANTED BOARD</span>
            <span>⭐</span>
          </h2>
        </div>

        {/* 탭 버튼 */}
        <div className="flex relative z-10 divide-x-4 divide-yellow-700">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                className={`flex-1 py-5 transition-all duration-300 font-bold
                  ${isActive
                    ? 'bg-amber-500 text-amber-50 shadow-inner'
                    : 'bg-amber-50 text-[#3d110f] hover:bg-amber-100'
                  }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="flex flex-col items-center space-y-2">
                  {/* 아이콘 이미지 */}
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full border-4 shadow-md transition-all
                      ${isActive
                        ? 'bg-[#3d110f] border-yellow-400 scale-105'
                        : 'bg-amber-200 border-yellow-600 hover:scale-105'
                      }`}
                  >
                    <img
                      src={category.imgSrc}
                      alt={category.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">
                      {category.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        isActive
                          ? 'text-amber-100 font-bold'
                          : 'text-amber-700'
                      }`}
                    >
                      {category.id === 'snack' ? '4개' : '8개'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuTab;
