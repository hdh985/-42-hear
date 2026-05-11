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
        animation: 'slide-up 0.32s cubic-bezier(.34,1.56,.64,1) both',
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
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '15px 20px',
          borderRadius: '18px',
          border: 'none',
          background: 'var(--primary)',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(49,130,246,0.4), 0 2px 8px rgba(0,0,0,0.12)',
          gap: '12px',
        }}
      >
        {/* Shimmer */}
        <span className="shimmer-overlay" style={{ animation: 'shimmer 3s ease-in-out infinite' }} />

        {/* Count badge */}
        <span style={{
          flexShrink: 0,
          width: '26px', height: '26px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 900,
          letterSpacing: '-0.02em',
        }}>
          {cartCount}
        </span>

        {/* Label */}
        <span style={{
          flex: 1, fontSize: '16px', fontWeight: 700,
          textAlign: 'left', letterSpacing: '-0.03em',
        }}>
          지금 주문하기
        </span>

        {/* Total */}
        <span style={{
          fontSize: '16px', fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
        }}>
          {cartTotal.toLocaleString()}원
        </span>

        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.8 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>,
    document.body
  );
};

export default OrderBar;
