import React from 'react';

export type CategoryId = 'snack' | 'beverage';

interface Category {
  id: CategoryId;
  name: string;
  imgSrc: string;
}

interface MenuTabProps {
  activeCategory: CategoryId;
  setActiveCategory: React.Dispatch<React.SetStateAction<CategoryId>>;
}

const MenuTab: React.FC<MenuTabProps> = ({ activeCategory, setActiveCategory }) => {
  const categories: Category[] = [
    { id: 'snack',    name: '메인 메뉴',   imgSrc: '/main.png' },
    { id: 'beverage', name: '사이드 메뉴', imgSrc: '/side.png' },
  ];

  const activeIdx = categories.findIndex((c) => c.id === activeCategory);

  // 한 칸 너비 = 100/n %
  const segmentW = `${100 / categories.length}%`;

  // ✅ translateX는 '자기 너비' 기준이므로, 한 칸 이동 = 100%
  //    k칸 이동 = k * 100%
  const translateX = `${activeIdx * 100}%`;

  return (
    <div className="mb-6">
      <div
        className="relative overflow-hidden rounded-xl border-4 border-yellow-700 shadow-xl text-amber-50"
        style={{
          backgroundImage:
            'linear-gradient(180deg, #8b4513 0%, #5a1a16 55%, #3d110f 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 8px, rgba(0,0,0,0) 8px 16px)'
        }}
      >
        {/* Title bar */}
        <div className="relative z-10 border-b-4 border-yellow-800 bg-gradient-to-r from-amber-700 to-amber-600 py-2">
          <h2
            className="flex items-center justify-center space-x-2 text-center text-base font-extrabold tracking-widest text-amber-100"
            style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.7)' }}
          >
            <span>⭐</span>
            <span>WANTED BOARD</span>
            <span>⭐</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="relative z-10">
          {/* Sliding indicator (gold underline) */}
          <div className="relative h-0.5">
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 transition-transform duration-300 ease-out will-change-transform"
              style={{ width: segmentW, transform: `translateX(${translateX})` }}
            />
          </div>

          <div className="relative flex divide-x-4 divide-yellow-700/80">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative flex-1 py-5 font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 ${
                    isActive
                      ? 'bg-amber-500 text-amber-50 shadow-inner'
                      : 'bg-amber-50 text-[#3d110f] hover:bg-amber-100'
                  }`}
                >
                  {/* soft vignette for active */}
                  {isActive && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-10"
                      style={{
                        background:
                          'radial-gradient(70% 50% at 50% 0%, #000 0%, transparent 60%)'
                      }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center space-y-2">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-md transition-transform ${
                        isActive
                          ? 'scale-105 border-yellow-400 bg-[#3d110f]'
                          : 'border-yellow-600 bg-amber-200 group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={category.imgSrc}
                        alt={category.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-extrabold tracking-wider uppercase">
                        {category.name}
                      </h3>
                      <p className={`mt-1 text-xs ${isActive ? 'font-bold text-amber-100' : 'text-amber-700'}`}>
                        {category.id === 'snack' ? '4개' : '8개'}
                      </p>
                    </div>
                  </div>

                  {/* Golden side pins */}
                  <span className="pointer-events-none absolute left-2 top-2 h-2 w-2 rounded-full bg-yellow-500/80 shadow" />
                  <span className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-500/80 shadow" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTab;
