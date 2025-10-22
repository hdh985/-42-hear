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
  // k칸 이동 = k * 100%
  const translateX = `${activeIdx * 100}%`;

  // 탭 하단 ‘활주로 라이트’ & 작은 비행기 애니메이션
  const css = `
    @keyframes runway {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 48px 0, -48px 0; }
    }
    @keyframes planeBob {
      0%,100% { transform: translateY(0) rotate(-6deg); }
      50%     { transform: translateY(-2px) rotate(-6deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-runway, .animate-plane { animation: none !important; transform: none !important; }
    }
  `;

  // IATA 라우트 라벨 (카테고리별)
  const routeCode = (id: CategoryId) => (id === 'snack' ? 'ICN → MAIN' : 'ICN → SIDE');

  return (
    <div className="mb-6">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className="relative overflow-hidden rounded-2xl border-4 border-sky-800 shadow-xl text-sky-50"
        style={{
          // 하늘/야간 공항 무드
          backgroundImage:
            'linear-gradient(180deg, rgba(10,26,58,0.96) 0%, rgba(9,22,48,0.96) 55%, rgba(8,18,40,0.96) 100%), radial-gradient(1200px 400px at 50% -200px, rgba(44,127,255,0.18) 0%, rgba(0,0,0,0) 70%)'
        }}
      >
        {/* Title bar: 출발 전광판 느낌 */}
        <div className="relative z-10 border-b-4 border-sky-900 bg-gradient-to-r from-sky-800 to-sky-600 py-2">
          <h2
            className="flex items-center justify-center gap-2 text-center text-base font-extrabold tracking-[0.2em] text-sky-100"
            style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.4)' }}
          >
            <span>🛫</span>
            <span>DEPARTURES</span>
            <span>🛬</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="relative z-10">
          {/* Sliding indicator (활주로 골드 라인) */}
          <div className="relative h-0.5">
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 transition-transform duration-300 ease-out will-change-transform"
              style={{ width: segmentW, transform: `translateX(${translateX})` }}
            />
          </div>

          <div className="relative flex divide-x-4 divide-sky-900/80">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative flex-1 py-5 font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                    isActive
                      ? 'bg-sky-800/80 text-sky-50 shadow-inner'
                      : 'bg-sky-900/40 text-sky-200 hover:bg-sky-900/60'
                  }`}
                >
                  {/* 상단 작은 비행기 아이콘(활주) */}
                  <span
                    aria-hidden
                    className="absolute right-3 top-2 text-sm opacity-90 animate-plane"
                    style={{ animation: 'planeBob 2.4s ease-in-out infinite' }}
                  >
                    ✈️
                  </span>

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-md transition-transform ${
                        isActive
                          ? 'scale-105 border-amber-300 bg-[#0b1f3e]'
                          : 'border-sky-600 bg-sky-700/40 group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={category.imgSrc}
                        alt={category.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>

                    {/* 라우트 + 카테고리명 */}
                    <div className="text-center">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-800/70 border border-sky-600/50 text-[11px] font-semibold text-sky-100">
                          {routeCode(category.id)}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold tracking-wider uppercase">
                        {category.name}
                      </h3>
                      <p className={`mt-1 text-xs ${isActive ? 'font-bold text-sky-100' : 'text-sky-300'}`}>
                        {category.id === 'snack' ? '메인 라인업' : '사이드 라인업'}
                      </p>
                    </div>
                  </div>

                  {/* 하단 활주로 러닝 라이트 */}
                  <div
                    aria-hidden
                    className="animate-runway absolute inset-x-0 bottom-0 h-1"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, rgba(255,255,255,0.28) 25%, transparent 25% 50%, rgba(255,255,255,0.28) 50% 75%, transparent 75%), linear-gradient(90deg, rgba(255,255,255,0.14) 25%, transparent 25% 50%, rgba(255,255,255,0.14) 50% 75%, transparent 75%)',
                      backgroundSize: '48px 2px, 48px 2px',
                      animation: 'runway 4s linear infinite'
                    }}
                  />
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
