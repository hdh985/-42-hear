import React from 'react';
import { createPortal } from 'react-dom';

interface OrderBarProps {
  cartCount: number;
  cartTotal: number;
  onOpen: () => void;
}

const OrderBar: React.FC<OrderBarProps> = ({ cartCount, cartTotal, onOpen }) => {
  if (cartCount <= 0) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(calc(100% - 32px), 448px)',
        zIndex: 30,
        animation: 'slide-up 0.24s cubic-bezier(.34,1.56,.64,1) both',
        willChange: 'transform',
      }}
      role="region"
      aria-label="주문 요약"
    >
      <button
        onPointerUp={onOpen}
        onClick={e => e.preventDefault()}
        aria-label="주문하기"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: '16px',
          border: 'none',
          background: '#3182F6',
          color: '#FFFFFF',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(49,130,246,0.35)',
          gap: '12px',
        }}
      >
        {/* 수량 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{
            width: '26px', height: '26px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {cartCount}
          </span>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            장바구니 보기
          </span>
        </div>

        {/* 금액 */}
        <span style={{
          fontSize: '15px', fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
        }}>
          {cartTotal.toLocaleString()}원
        </span>
      </button>
    </div>,
    document.body
  );
};

export default OrderBar;
