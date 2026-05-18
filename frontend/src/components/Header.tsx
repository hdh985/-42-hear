import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  toggleOrder: () => void;
}

const Header: React.FC<Props> = ({ cartCount, cartTotal, toggleOrder }) => (
  <header
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E8EB',
      padding: '0 20px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      transform: 'translateZ(0)',
      willChange: 'transform',
    }}
  >
    {/* 좌: 브랜드 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
      <img
        src="/yunsul.jpg"
        alt="윤슬"
        style={{
          width: '36px', height: '36px',
          borderRadius: '10px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '11px',
          color: '#B0B8C1',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}>
          제28대 한국어학과 학생회
        </p>
        <h1 style={{
          margin: 0,
          fontSize: '17px',
          fontWeight: 800,
          color: '#191F28',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}>
          윤슬
        </h1>
      </div>
    </div>

    {/* 우: 장바구니 */}
    <button
      onPointerUp={toggleOrder}
      onClick={e => e.preventDefault()}
      aria-label="장바구니"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: cartCount > 0 ? '9px 16px' : '9px 14px',
        borderRadius: '100px',
        border: 'none',
        background: cartCount > 0 ? '#3182F6' : '#F2F4F6',
        color: cartCount > 0 ? '#FFFFFF' : '#6B7684',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        flexShrink: 0,
        letterSpacing: '-0.02em',
        transition: 'all 0.18s ease',
      }}
    >
      <ShoppingBag size={15} strokeWidth={2} />
      <span>
        {cartCount > 0 ? `${cartTotal.toLocaleString()}원` : '장바구니'}
      </span>

      {cartCount > 0 && (
        <span
          className="animate-badge-pop"
          style={{
            position: 'absolute',
            top: '-5px', right: '-5px',
            minWidth: '18px', height: '18px',
            borderRadius: '100px',
            background: '#F04452',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid #FFFFFF',
          }}
        >
          {cartCount}
        </span>
      )}
    </button>
  </header>
);

export default Header;
