// Header.tsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  toggleOrder: () => void;
}

const Header: React.FC<Props> = ({ cartCount, cartTotal, toggleOrder }) => {
  // 🔁 마퀴 애니메이션 (Tailwind 설정 없이 동작)
  const marqueeCss = `
    @keyframes header-marquee {
      0%   { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    @keyframes header-marquee2 {
      0%   { transform: translateX(50%); }
      100% { transform: translateX(0%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .header-marquee, .header-marquee2 { animation: none !important; transform: none !important; }
    }
  `;

  return (
    <header className="w-full flex justify-center bg-[#76231c]">
      {/* 키프레임 주입 */}
      <style dangerouslySetInnerHTML={{ __html: marqueeCss }} />

      <div
        className="w-full max-w-md relative text-amber-100 rounded-t-2xl overflow-hidden shadow-[0_22px_60px_-18px_rgba(0,0,0,0.6)] border-x-4 border-t-4 border-yellow-700"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(118,35,28,0.96) 0%, rgba(90,26,22,0.96) 45%, rgba(61,17,15,0.96) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 8px, transparent 8px 16px)'
        }}
      >
        {/* Top gold rope trim */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-800 via-yellow-500 to-yellow-800">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60" />
        </div>

        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-7 h-7 border-l-2 border-t-2 border-yellow-500/90 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-7 h-7 border-r-2 border-t-2 border-yellow-500/90 rounded-tr-2xl" />

        {/* Soft saloon split */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-black/15" />

        {/* Content */}
        <div className="px-5 py-4 space-y-4 relative">
          <div className="flex items-center justify-between">
            {/* Logo & titles */}
            <div className="flex items-center min-w-0">
              <div className="mr-3 rounded-lg p-1.5 bg-[#5a1a16]/70 border border-yellow-600/70 shadow-inner">
                <img src="/hear.jpg" alt="히어컴퍼니 로고" className="w-12 h-12 rounded-md object-cover" />
              </div>
              <div className="truncate">
                <h2 className="text-lg font-extrabold text-yellow-300 tracking-widest drop-shadow">
                  HEART SHOT
                </h2>
                <p className="text-[11px] text-amber-200/90 font-semibold truncate">
                  제42대 외국어대학 학생회 hear
                </p>
              </div>
            </div>

            {/* Cart button */}
            <button
              onPointerUp={toggleOrder}                 // 포인터 업으로 열기
              onClick={(e) => e.preventDefault()}       // click은 예방적으로 무시
              aria-label="장바구니 열기"
              className="group relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-amber-900 border-2 border-yellow-500 bg-gradient-to-b from-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              <ShoppingCart size={16} className="opacity-90" />
              <span className="font-serif tabular-nums" aria-live="polite">
                ₩{cartTotal.toLocaleString()}
              </span>

              {/* Shine */}
              <span
                className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    'radial-gradient(80% 60% at 50% -20%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)'
                }}
              />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-extrabold grid place-items-center border-2 border-red-400 shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Marquee banner */}
        <div className="bg-gradient-to-r from-[#5a1a16] via-[#76231c] to-[#5a1a16] border-t-2 border-yellow-700/90 overflow-hidden py-2">
          <div className="relative flex">
            {/* 1번째 줄 */}
            <div
              className="inline-flex shrink-0 min-w-full whitespace-nowrap text-[13px] leading-5 font-medium gap-8 px-4 header-marquee"
              style={{ animation: 'header-marquee 22s linear infinite', willChange: 'transform' }}
            >
              <span className="text-yellow-300 font-bold">🇰🇷 HEART SHOT 부스에 오신 것을 환영합니다!</span>
              <span className="text-yellow-300 font-bold">🇨🇳 欢迎来到 HEART SHOT 展位！</span>
              <span className="text-yellow-300 font-bold">🇯🇵 HEART SHOTへようこそ！</span>
              <span className="text-yellow-300 font-bold">🇺🇸 WELCOME TO THE HEART SHOT!</span>
              <span className="text-yellow-300 font-bold">🇫🇷 Bienvenue au HEART SHOT !</span>
              <span className="text-yellow-300 font-bold">🇪🇸 ¡Bienvenidos a HEART SHOT!</span>
              <span className="text-yellow-300 font-bold">🇷🇺 Добро пожаловать в HEART SHOT!</span>
            </div>
            {/* 2번째 줄 (복제, 끊김 없는 루프용) */}
            <div
              className="inline-flex shrink-0 min-w-full whitespace-nowrap text-[13px] leading-5 font-medium gap-8 px-4 header-marquee2"
              aria-hidden="true"
              style={{ animation: 'header-marquee2 22s linear infinite', willChange: 'transform' }}
            >
              <span className="text-yellow-300 font-bold">🇰🇷 HEART SHOT 부스에 오신 것을 환영합니다!</span>
              <span className="text-yellow-300 font-bold">🇨🇳 欢迎来到 HEART SHOT 展位！</span>
              <span className="text-yellow-300 font-bold">🇯🇵 HEART SHOTへようこそ！</span>
              <span className="text-yellow-300 font-bold">🇺🇸 WELCOME TO THE HEART SHOT!</span>
              <span className="text-yellow-300 font-bold">🇫🇷 Bienvenue au HEART SHOT !</span>
              <span className="text-yellow-300 font-bold">🇪🇸 ¡Bienvenidos a HEART SHOT!</span>
              <span className="text-yellow-300 font-bold">🇷🇺 Добро пожаловать в HEART SHOT!</span>
            </div>
          </div>
        </div>

        {/* Bottom gold trim */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
      </div>
    </header>
  );
};

export default Header;
