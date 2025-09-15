import React from 'react';
import { createPortal } from 'react-dom';

interface OrderBarProps {
  cartCount: number;
  cartTotal: number;
  onOpen: () => void;
}

const OrderBar: React.FC<OrderBarProps> = ({ cartCount, cartTotal, onOpen }) => {
  if (cartCount <= 0) return null;

  // 포털로 body에 붙여 상위 레이아웃/transform 영향 제거
  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}
      role="region"
      aria-label="주문 요약과 주문 버튼"
    >
      <div
        className="relative overflow-hidden border-x-4 border-t-4 border-amber-950 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-2xl"
        style={{ clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 100%, 0 100%)' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.09) 6px 12px)' }}
        />

        <div className="relative z-10 flex items-center justify-between p-4">
          <div className="flex flex-col">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-lg text-yellow-300" aria-hidden>
                🛒
              </span>
              <span className="text-sm font-medium text-amber-200" aria-live="polite">
                총 {cartCount}개 담음
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-green-300" aria-hidden>
                
              </span>
              <span className="tabular-nums text-xl font-extrabold tracking-wide text-green-200 drop-shadow">
                ₩{cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="group relative inline-flex items-center justify-center border-4 border-amber-900 bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 font-bold uppercase tracking-wide text-amber-50 transition-transform hover:from-amber-500 hover:to-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:translate-y-[1px]"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
            aria-label="주문하기"
          >
            <span className="drop-shadow">주문하기</span>
            <span className="ml-2 rounded-sm border border-amber-900/40 bg-amber-900/30 px-2 py-0.5 text-xs text-amber-100/90">
              {cartCount}
            </span>
          </button>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-amber-950 via-yellow-600 to-amber-950">
          <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderBar;
