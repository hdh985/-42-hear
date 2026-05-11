import React from 'react';
import { ShoppingCart } from 'lucide-react';

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
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      transform: 'translateZ(0)',    /* GPU layer — prevents sticky jitter on iOS */
      willChange: 'transform',
    }}
  >
    {/* Left: logo + name */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
      <img
        src="/yunsul.jpg"
        alt="윤슬"
        style={{
          width: '36px', height: '36px',
          borderRadius: '10px',
          objectFit: 'cover',
          flexShrink: 0,
          background: '#EEF0F8',
        }}
      />
      <div style={{ minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '11px',
          color: 'var(--text-dim)',
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}>
          제28대 한국어학과 학생회
        </p>
        <h1 style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          윤슬
        </h1>
      </div>
    </div>

    {/* Right: cart button */}
    <button
      onPointerUp={toggleOrder}
      onClick={e => e.preventDefault()}
      aria-label="장바구니"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: cartCount > 0 ? '8px 16px' : '8px 14px',
        borderRadius: '100px',
        border: 'none',
        background: cartCount > 0 ? 'var(--primary)' : 'var(--surface3)',
        color: cartCount > 0 ? '#fff' : 'var(--text-muted)',
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(.34,1.56,.64,1)',
        flexShrink: 0,
        letterSpacing: '-0.02em',
      }}
    >
      <ShoppingCart size={15} strokeWidth={2.2} />
      <span>{cartCount > 0 ? `₩${cartTotal.toLocaleString()}` : '장바구니'}</span>

      {cartCount > 0 && (
        <span
          className="animate-badge-pop"
          style={{
            position: 'absolute',
            top: '-5px', right: '-5px',
            minWidth: '18px', height: '18px',
            borderRadius: '100px',
            background: '#FF3B30',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid #fff',
          }}
        >
          {cartCount}
        </span>
      )}
    </button>
  </header>
);

export default Header;
