import React from 'react';
import { createPortal } from 'react-dom';

interface OrderBarProps {
  cartCount: number;
  cartTotal: number;
  onOpen: () => void;
}

const OrderBar: React.FC<OrderBarProps> = ({ cartCount, cartTotal, onOpen }) => {
  if (cartCount <= 0) return null;

  const css = `
    @keyframes runway {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 56px 0, -56px 0; }
    }
    @keyframes shine {
      from { transform: translateX(-120%); }
      to   { transform: translateX(160%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-runway, .animate-shine { animation: none !important; transform: none !important; }
    }
  `;

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}
      role="region"
      aria-label="주문 요약과 주문 버튼"
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        className="relative overflow-hidden rounded-t-2xl border-x-4 border-t-4 border-sky-900 shadow-2xl"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(10,26,58,0.96) 0%, rgba(9,22,48,0.96) 100%), radial-gradient(1200px 400px at 50% -200px, rgba(44,127,255,0.18) 0%, rgba(0,0,0,0) 70%)'
        }}
      >
        {/* 상단 얇은 라인 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-900 via-sky-400 to-sky-900">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200 to-transparent opacity-60" />
        </div>

        {/* 바탕 패턴(전광판 느낌) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px'
          }}
        />

        <div className="relative z-10 flex items-center justify-between p-4 text-sky-50">
          {/* 좌측: 라우트/수량/금액 */}
          <div className="flex flex-col min-w-0">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-lg" aria-hidden>✈️</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-800/70 border border-sky-600/50">
                ICN → ORDERS
              </span>
              <span className="text-sm font-medium text-sky-200" aria-live="polite">
                총 {cartCount}개
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-[11px] text-sky-300/90">Fare</span>
              <span className="tabular-nums text-xl font-extrabold tracking-wide text-amber-300 drop-shadow">
                ₩{cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 우측: ‘Boarding’ 스타일 CTA */}
          <button
            onClick={onOpen}
            className="group relative inline-flex items-center justify-center rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-300 to-amber-200 px-5 py-3 font-extrabold tracking-wide text-[#0a1220] transition-transform hover:from-amber-200 hover:to-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:translate-y-[1px]"
            aria-label="주문하기"
          >
            <span className="drop-shadow">•주문하기</span>
            <span className="ml-2 rounded-sm border border-amber-400/60 bg-amber-300/60 px-2 py-0.5 text-xs">
              {cartCount}
            </span>
            {/* Shine */}
            <span
              aria-hidden
              className="animate-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-white/0 via-white/35 to-white/0"
              style={{ animation: 'shine 1.4s ease-in-out infinite' }}
            />
          </button>
        </div>

        {/* 하단 활주로 러닝 라이트 */}
        <div
          aria-hidden
          className="animate-runway absolute left-0 right-0 bottom-0 h-1"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.28) 25%, transparent 25% 50%, rgba(255,255,255,0.28) 50% 75%, transparent 75%), linear-gradient(90deg, rgba(255,255,255,0.14) 25%, transparent 25% 50%, rgba(255,255,255,0.14) 50% 75%, transparent 75%)',
            backgroundSize: '56px 2px, 56px 2px',
            animation: 'runway 4s linear infinite'
          }}
        />
      </div>
    </div>,
    document.body
  );
};

export default OrderBar;
