import React, { useEffect } from 'react';
import OrderForm, { CartItem } from './OrderForm';
import { createPortal } from 'react-dom';

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

  // 모달 열릴 때 하단 카트바 숨기기 / 닫히면 복구
  useEffect(() => {
    const sticky =
      (document.querySelector('[data-sticky-cart]') as HTMLElement | null) ||
      (document.querySelector('#sticky-cart-bar') as HTMLElement | null) ||
      (document.querySelector('.sticky-cart-bar') as HTMLElement | null);
    if (!sticky) return;
    if (isOpen) {
      sticky.setAttribute('aria-hidden', 'true');
      sticky.classList.add('hidden');
    } else {
      sticky.removeAttribute('aria-hidden');
      sticky.classList.remove('hidden');
    }
    return () => {
      sticky.removeAttribute('aria-hidden');
      sticky.classList.remove('hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const css = `
    @keyframes sheet-up {
      0% { transform: translateY(8%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes overlay-fade {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes runway {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 56px 0, -56px 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-sheet-up, .animate-overlay, .animate-runway { animation: none !important; transform: none !important; opacity: 1 !important; }
    }
  `;

  const content = (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Overlay */}
      <div
        role="presentation"
        aria-hidden
        className="fixed inset-0 z-[100] animate-overlay"
        style={{
          animation: 'overlay-fade .18s ease-out',
          background:
            'radial-gradient(1200px 400px at 50% -200px, rgba(44,127,255,0.22) 0%, rgba(0,0,0,0) 65%), rgba(0,0,0,.55)',
          backdropFilter: 'blur(2px)'
        }}
        onClick={toggleOrder}
      />

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[110]" aria-live="polite">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="주문서 모달"
          className="mx-auto w-full max-w-md overflow-hidden rounded-t-2xl border-x-4 border-t-4 border-sky-900 shadow-2xl animate-sheet-up"
          style={{
            animation: 'sheet-up .22s cubic-bezier(.2,.8,.2,1)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))',
            backgroundImage:
              'linear-gradient(180deg, rgba(10,26,58,0.96) 0%, rgba(9,22,48,0.96) 100%), radial-gradient(1200px 400px at 50% -200px, rgba(44,127,255,0.18) 0%, rgba(0,0,0,0) 70%)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Grabber + 상단 바 */}
          <div className="sticky top-0 z-10 bg-sky-900/40 backdrop-blur">
            <div className="flex items-center justify-center pt-2">
              <span className="mb-2 h-1.5 w-12 rounded-full bg-sky-300/60" />
            </div>
            {/* 활주로 러닝 라이트 */}
            <div
              aria-hidden
              className="animate-runway h-1"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.28) 25%, transparent 25% 50%, rgba(255,255,255,0.28) 50% 75%, transparent 75%), linear-gradient(90deg, rgba(255,255,255,0.14) 25%, transparent 25% 50%, rgba(255,255,255,0.14) 50% 75%, transparent 75%)',
                backgroundSize: '56px 2px, 56px 2px',
                animation: 'runway 4s linear infinite'
              }}
            />
          </div>

          {/* Content */}
          <div className="max-h-[88vh] overflow-y-auto overscroll-contain">
            <OrderForm
              cartItems={cartItems}
              cartTotal={cartTotal}
              cartCount={cartCount}
              toggleOrder={toggleOrder}
              updateCartItem={updateCartItem}
              // scrollToBottomOnMount
            />
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
  // 포털 미사용 시: return content;
};

export default CartModal;
