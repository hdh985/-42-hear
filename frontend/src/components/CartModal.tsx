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
  const sheetRef   = useRef<HTMLDivElement>(null);
  const dragStart  = useRef(0);
  const dragging   = useRef(false);

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

  /* Swipe-down-to-dismiss — only on the grabber/header area */
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
      sheetRef.current.style.transition = 'transform 0.32s cubic-bezier(.32,.72,0,1)';
      sheetRef.current.style.transform  = 'translateY(0)';
      const el = sheetRef.current;
      setTimeout(() => { el.style.transition = ''; }, 340);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={toggleOrder}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'fade-in 0.2s ease both',
        }}
      />

      {/* Sheet */}
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
          borderRadius: '24px 24px 0 0',
          background: 'var(--surface)',
          boxShadow: '0 -8px 48px rgba(0,0,0,0.16)',
          animation: 'slide-up-sheet 0.36s cubic-bezier(.32,.72,0,1) both',
          overflow: 'hidden',
          willChange: 'transform',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle — swipe target */}
        <div
          onTouchStart={onGrabStart}
          onTouchMove={onGrabMove}
          onTouchEnd={onGrabEnd}
          style={{ flexShrink: 0, cursor: 'grab', userSelect: 'none' }}
        >
          {/* Grabber pill */}
          <div style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '36px', height: '4px',
              borderRadius: '100px',
              background: 'var(--border)',
            }} />
          </div>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 20px 14px',
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
                주문하기
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                {cartCount}개 항목 · {cartTotal.toLocaleString()}원
              </p>
            </div>
            <button
              onPointerUp={toggleOrder}
              onClick={e => e.preventDefault()}
              aria-label="닫기"
              style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--surface3)',
                color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', flexShrink: 0 }} />

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
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
