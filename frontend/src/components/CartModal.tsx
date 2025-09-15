import React, { useEffect } from 'react';
import OrderForm, { CartItem } from './OrderForm';
import { createPortal } from 'react-dom'; // (선택) 포털 안 쓰면 삭제해도 됨

interface CartModalProps {
  isOpen: boolean;
  toggleOrder: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  updateCartItem: (itemId: string, quantity: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  toggleOrder,
  cartItems,
  cartTotal,
  cartCount,
  updateCartItem,
}) => {
  // ESC 닫기 + 바디 스크롤 락
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleOrder();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, toggleOrder]);

  // ✅ 모달 열릴 때 하단 카트바 숨기기 / 닫히면 복구
  useEffect(() => {
    const sticky =
      (document.querySelector('[data-sticky-cart]') as HTMLElement | null) ||
      (document.querySelector('#sticky-cart-bar') as HTMLElement | null) ||
      (document.querySelector('.sticky-cart-bar') as HTMLElement | null);

    if (!sticky) return;

    if (isOpen) {
      // 깔끔하게 가리기 (레이아웃 영향 없음: fixed 요소 가정)
      sticky.setAttribute('aria-hidden', 'true');
      sticky.classList.add('hidden'); // Tailwind 기본 클래스
    } else {
      sticky.removeAttribute('aria-hidden');
      sticky.classList.remove('hidden');
    }

    // 안전 복구
    return () => {
      sticky.removeAttribute('aria-hidden');
      sticky.classList.remove('hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <>
      {/* Overlay (z-index ↑) */}
      <div
        role="presentation"
        aria-hidden
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity" // z-index 상향
        onClick={toggleOrder}
      />

      {/* Bottom sheet (z-index ↑) */}
      <div className="fixed inset-x-0 bottom-0 z-[110]" aria-live="polite">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="주문서 모달"
          className="mx-auto w-full max-w-md overflow-hidden rounded-t-2xl shadow-2xl"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Grabber */}
          <div className="relative bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-center bg-white/90 pt-2 backdrop-blur">
              <span className="mb-2 h-1.5 w-12 rounded-full bg-neutral-300" />
            </div>

            {/* Content */}
            <div className="max-h-[88vh] overflow-y-auto overscroll-contain bg-white">
              <OrderForm
                cartItems={cartItems}
                cartTotal={cartTotal}
                cartCount={cartCount}
                toggleOrder={toggleOrder}
                updateCartItem={updateCartItem}
                // 필요하면 아래 옵션으로 모달 열릴 때 하단부터 보이게:
                // scrollToBottomOnMount
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // (선택) 포털 사용: 스태킹 컨텍스트 이슈 예방
  return createPortal(content, document.body);
  // 포털 원치 않으면: return content;
};

export default CartModal;
