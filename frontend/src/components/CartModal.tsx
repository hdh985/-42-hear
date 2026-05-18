import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import OrderForm, { CartItem } from './OrderForm';

interface CartModalProps {
  isOpen: boolean;
  toggleOrder: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  updateCartItem: (itemId: string, quantity: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen, toggleOrder, cartItems, cartTotal, cartCount, updateCartItem,
}) => {
  const sheetRef  = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const dragging  = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') toggleOrder(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, toggleOrder]);

  const onGrabStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
    dragging.current  = true;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };
  const onGrabMove = (e: React.TouchEvent) => {
    if (!dragging.current || !sheetRef.current) return;
    const dy = Math.max(0, e.touches[0].clientY - dragStart.current);
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onGrabEnd = (e: React.TouchEvent) => {
    if (!dragging.current || !sheetRef.current) return;
    dragging.current = false;
    const dy = Math.max(0, e.changedTouches[0].clientY - dragStart.current);
    if (dy > 120) {
      toggleOrder();
    } else {
      sheetRef.current.style.transition = 'transform 0.3s cubic-bezier(.32,.72,0,1)';
      sheetRef.current.style.transform  = 'translateY(0)';
      const el = sheetRef.current;
      setTimeout(() => { el.style.transition = ''; }, 320);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* 배경 */}
      <div
        aria-hidden
        onClick={toggleOrder}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fade-in 0.18s ease both',
        }}
      />

      {/* 시트 */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="주문서"
        style={{
          position: 'fixed', insetInline: 0, bottom: 0, zIndex: 110,
          margin: '0 auto',
          maxWidth: '480px',
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px 20px 0 0',
          background: '#F2F4F6',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.15)',
          animation: 'slide-up-sheet 0.3s cubic-bezier(.32,.72,0,1) both',
          overflow: 'hidden',
          willChange: 'transform',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div
          onTouchStart={onGrabStart}
          onTouchMove={onGrabMove}
          onTouchEnd={onGrabEnd}
          style={{
            background: '#FFFFFF',
            flexShrink: 0,
            cursor: 'grab',
            userSelect: 'none',
            borderBottom: '1px solid #E5E8EB',
          }}
        >
          <div style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '36px', height: '4px',
              borderRadius: '100px',
              background: '#E5E8EB',
            }} />
          </div>

          {/* 헤더 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px 16px',
          }}>
            <div>
              <h2 style={{
                margin: 0, fontSize: '18px', fontWeight: 800,
                color: '#191F28', letterSpacing: '-0.03em',
              }}>
                장바구니
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7684', letterSpacing: '-0.01em' }}>
                {cartCount}개 · <strong style={{ color: '#3182F6' }}>{cartTotal.toLocaleString()}원</strong>
              </p>
            </div>
            <button
              onPointerUp={toggleOrder}
              onClick={e => e.preventDefault()}
              aria-label="닫기"
              style={{
                width: '32px', height: '32px',
                borderRadius: '100px',
                border: 'none',
                background: '#F2F4F6',
                color: '#6B7684',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px', fontWeight: 500,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}>
          <OrderForm
            cartItems={cartItems}
            cartTotal={cartTotal}
            cartCount={cartCount}
            toggleOrder={toggleOrder}
            updateCartItem={updateCartItem}
          />
        </div>
      </div>
    </>,
    document.body
  );
};

export default CartModal;
