// Header.tsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  toggleOrder: () => void;
}

/**
 * World Travel Themed Header
 * - 배경: 심해 블루 → 하늘 블루 그라데이션 + 구름 드리프트 + 항로(도트 라인) 애니메이션
 * - 로고: 여권 도장(패스포트 스탬프) 스타일 원형 배지
 * - 하단 티커: 공항 플립보드(전광판) 느낌의 월드 데스티네이션 마퀴
 * - 접근성: reduced-motion 대응, 배지/버튼 aria-label 지정
 */
const Header: React.FC<Props> = ({ cartCount, cartTotal, toggleOrder }) => {
  const css = `
    /* ===== Motion ===== */
    @keyframes cloud-drift {
      0%   { transform: translateX(-10%); }
      100% { transform: translateX(110%); }
    }
    @keyframes route-pulse {
      0%   { opacity: .15; }
      50%  { opacity: .35; }
      100% { opacity: .15; }
    }
    @keyframes plane-bob {
      0%,100% { transform: translateY(0) rotate(-6deg); }
      50%     { transform: translateY(-2px) rotate(-6deg); }
    }
    @keyframes ticker-left {
      0%   { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    @keyframes ticker-left-2 {
      0%   { transform: translateX(50%); }
      100% { transform: translateX(0%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .cloud, .route, .plane, .ticker-1, .ticker-2 { animation: none !important; transform: none !important; }
    }

    /* ===== Flipboard (전광판) 숫자·문자 형태 흉내 (CSS-only) ===== */
    .flip-cell {
      position: relative;
      padding: 2px 8px;
      border-radius: 6px;
      background: linear-gradient(180deg, rgba(13,18,28,.9) 0%, rgba(10,14,22,.9) 100%);
      box-shadow: inset 0 -1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,.2);
      color: #C6D3F7;
      letter-spacing: .04em;
      text-transform: uppercase;
      font-variant-numeric: tabular-nums;
    }
    .flip-cell::after {
      content: "";
      position: absolute;
      left: 0; right: 0; top: 50%;
      height: 1px;
      background: rgba(255,255,255,0.06);
      transform: translateY(-50%);
    }
  `;

  return (
    <header className="w-full flex justify-center bg-[#0a1220]">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className="w-full max-w-md relative text-sky-50 rounded-t-2xl overflow-hidden shadow-[0_22px_60px_-18px_rgba(0,0,0,0.6)] border-x-4 border-t-4 border-sky-700"
        style={{
          // 레이어: 하늘 → 수평 그라데이션 + 별/그리드 은은한 패턴
          backgroundImage: `
            radial-gradient(1200px 600px at 50% -200px, rgba(35,117,219,.22) 0%, rgba(10,18,32,0) 70%),
            linear-gradient(180deg, #0a1a3a 0%, #0b2049 40%, #0c284f 100%)
          `
        }}
      >
        {/* ===== Animated clouds ===== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* cloud 1 */}
          <div
            className="cloud absolute top-6 -left-1/3 h-14 w-[140%] opacity-[0.12] blur-xl"
            style={{
              background:
                'radial-gradient(40% 60% at 20% 50%, #fff 0%, rgba(255,255,255,0) 70%), radial-gradient(35% 55% at 60% 40%, #fff 0%, rgba(255,255,255,0) 70%)',
              animation: 'cloud-drift 36s linear infinite',
            }}
          />
          {/* cloud 2 */}
          <div
            className="cloud absolute top-16 -left-1/2 h-12 w-[160%] opacity-[0.10] blur-2xl"
            style={{
              background:
                'radial-gradient(35% 55% at 30% 50%, #fff 0%, rgba(255,255,255,0) 70%), radial-gradient(35% 55% at 70% 50%, #fff 0%, rgba(255,255,255,0) 70%)',
              animation: 'cloud-drift 48s linear infinite',
              animationDelay: '6s',
            }}
          />
        </div>

        {/* ===== Flight routes (dotted) ===== */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-60 route" style={{ animation: 'route-pulse 5s ease-in-out infinite' }} viewBox="0 0 400 200" fill="none">
            <defs>
              <marker id="planeDot" markerWidth="4" markerHeight="4" refX="2" refY="2">
                <circle cx="2" cy="2" r="2" fill="rgba(135,206,250,0.9)" />
              </marker>
            </defs>
            {/* dotted arcs */}
            <path d="M 20 150 C 120 60, 280 60, 380 150" stroke="rgba(135,206,250,0.35)" strokeDasharray="2 6" />
            <path d="M 40 120 C 140 40, 260 40, 360 120" stroke="rgba(135,206,250,0.25)" strokeDasharray="2 7" />
            <path d="M 30 90  C 160 10, 240 10, 370 90"  stroke="rgba(135,206,250,0.16)" strokeDasharray="1 8" />
          </svg>
        </div>

        {/* 상단 얇은 라인 (하늘 빛) */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-800 via-sky-400 to-sky-800">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200 to-transparent opacity-60" />
        </div>

        {/* 모서리 금속 브래킷 → 공항 표지판 느낌 */}
        <div className="absolute top-0 left-0 w-7 h-7 border-l-2 border-t-2 border-sky-300/80 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-7 h-7 border-r-2 border-t-2 border-sky-300/80 rounded-tr-2xl" />

        {/* content */}
        <div className="px-5 py-4 space-y-4 relative">
          <div className="flex items-center justify-between">
            {/* Passport stamp badge */}
            <div className="flex items-center min-w-0">
              <div className="relative mr-3 grid place-items-center w-14 h-14 rounded-full bg-gradient-to-b from-sky-700 to-sky-900 border-2 border-sky-300/60 shadow-inner">
                {/* 외곽 도트 링 */}
                <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-sky-300/50 rotate-[-6deg]" />
                {/* 중앙 마크(지구본 이모지 대체 가능) */}
                <div className="text-sky-100 text-xl select-none" aria-hidden>🌍</div>
                {/* 비행기 아이콘 궤적 */}
                <div className="plane absolute -top-1 -right-1 text-sm rotate-[-6deg]" style={{ animation: 'plane-bob 2.6s ease-in-out infinite' }}>
                  ✈️
                </div>
              </div>
              <div className="truncate">
                <h2 className="text-lg font-extrabold tracking-widest drop-shadow text-sky-200">
                  부스이름 
                </h2>
                <p className="text-[11px] text-sky-200/80 font-semibold truncate">
                  제42대 외국어대학 학생회 hear — Night Booth
                </p>
              </div>
            </div>

            {/* Cart (Boarding 버튼 스타일) */}
            <button
              onPointerUp={toggleOrder}
              onClick={(e) => e.preventDefault()}
              aria-label="주문 장바구니 열기"
              className="group relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-[#0a1220] border-2 border-amber-300 bg-gradient-to-b from-amber-200 to-amber-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <ShoppingCart size={16} className="opacity-90" />
              <span className="font-serif tabular-nums" aria-live="polite">
                ₩{cartTotal.toLocaleString()}
              </span>
              {/* shine */}
              <span
                className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    'radial-gradient(80% 60% at 50% -20%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)'
                }}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-extrabold grid place-items-center border-2 border-rose-400 shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ===== Destination Ticker (전광판 스타일) ===== */}
        <div className="bg-gradient-to-r from-[#0c1e3b] via-[#0b1a33] to-[#0c1e3b] border-t-2 border-sky-800/80 overflow-hidden py-2">
          <div className="relative flex">
            {/* 1열 */}
            <div
              className="inline-flex shrink-0 min-w-full whitespace-nowrap text-[13px] leading-5 font-medium gap-4 px-3 ticker-1"
              style={{ animation: 'ticker-left 24s linear infinite', willChange: 'transform' }}
            >
              {[
                'ICN → HND · Tokyo', 'ICN → PVG · Shanghai', 'ICN → LAX · Los Angeles',
                'ICN → CDG · Paris', 'ICN → BCN · Barcelona', 'ICN → SVO · Moscow',
                'ICN → JFK · New York', 'ICN → FCO · Rome', 'ICN → FRA · Frankfurt'
              ].map((label, i) => (
                <span key={`t1-${i}`} className="flip-cell">{label}</span>
              ))}
            </div>
            {/* 2열 (끊김 없는 루프) */}
            <div
              className="inline-flex shrink-0 min-w-full whitespace-nowrap text-[13px] leading-5 font-medium gap-4 px-3 ticker-2"
              aria-hidden="true"
              style={{ animation: 'ticker-left-2 24s linear infinite', willChange: 'transform' }}
            >
              {[
                'ICN → HND · Tokyo', 'ICN → PVG · Shanghai', 'ICN → LAX · Los Angeles',
                'ICN → CDG · Paris', 'ICN → BCN · Barcelona', 'ICN → SVO · Moscow',
                'ICN → JFK · New York', 'ICN → FCO · Rome', 'ICN → FRA · Frankfurt'
              ].map((label, i) => (
                <span key={`t2-${i}`} className="flip-cell">{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 라인 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-800 via-sky-400 to-sky-800" />
      </div>
    </header>
  );
};

export default Header;
