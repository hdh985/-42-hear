import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface MenuItemType {
  id: string;
  category: 'snack' | 'beverage';
  title: string;
  description: string;
  price: number;
  change: string;
  trend: 'up' | 'down';
  marketCap: string;
  volume: string;
  volatility: string;
  investment: string;
  isSoldOut?: boolean;
}

interface MenuItemProps {
  item: MenuItemType;
  addToCart: (item: MenuItemType) => void;
  cartQuantity: number;
  updateCartItem: (id: string, quantity: number) => void;
}

const THUMB: Record<string, { bg: string; emoji: string }> = {
  '🇰🇷': { bg: 'linear-gradient(135deg, #C62828, #E53935)', emoji: '🇰🇷' },
  '🇨🇳': { bg: 'linear-gradient(135deg, #E53935, #FB8C00)', emoji: '🇨🇳' },
  '🇯🇵': { bg: 'linear-gradient(135deg, #AD1457, #E91E63)', emoji: '🇯🇵' },
  '🇺🇸': { bg: 'linear-gradient(135deg, #1565C0, #1E88E5)', emoji: '🇺🇸' },
  '🇪🇸': { bg: 'linear-gradient(135deg, #B71C1C, #EF6C00)', emoji: '🇪🇸' },
  '🇷🇺': { bg: 'linear-gradient(135deg, #283593, #5C6BC0)', emoji: '🇷🇺' },
  '🇫🇷': { bg: 'linear-gradient(135deg, #1A237E, #B71C1C)', emoji: '🇫🇷' },
};
const DEFAULT_THUMB = { bg: 'linear-gradient(135deg, #1B5E20, #43A047)', emoji: '🥤' };

function getThumb(title: string) {
  const key = Object.keys(THUMB).find(f => title.includes(f));
  return key ? THUMB[key] : DEFAULT_THUMB;
}

const BADGE: Record<string, { label: string; color: string; bg: string }> = {
  '즉시 체포': { label: '🔥 인기', color: '#FF3B30', bg: '#FFF2F1' },
  '체포 권장': { label: '👍 추천', color: '#00C073', bg: '#F0FBF6' },
  '감시 중':   { label: '✨ 추천', color: 'var(--primary)', bg: 'var(--primary-light)' },
  '수배 중':   { label: '🆕 NEW',  color: '#FF9500', bg: '#FFF8ED' },
};

const MenuItem: React.FC<MenuItemProps> = ({ item, addToCart, cartQuantity, updateCartItem }) => {
  const [justAdded, setJustAdded] = useState(false);
  const { bg, emoji } = getThumb(item.title);
  const badge = BADGE[item.investment];

  const handleAdd = () => {
    if (item.isSoldOut) return;
    setJustAdded(true);
    addToCart(item);
    setTimeout(() => setJustAdded(false), 800);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px',
        marginBottom: '8px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        opacity: item.isSoldOut ? 0.45 : 1,
        transition: 'transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease',
        cursor: item.isSoldOut ? 'default' : 'pointer',
      }}
      onMouseEnter={e => {
        if (!item.isSoldOut && window.matchMedia('(hover: hover)').matches) {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '72px', height: '72px',
        borderRadius: '14px',
        background: bg,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {emoji}
        {item.isSoldOut && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '14px',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 800, color: '#fff',
            letterSpacing: '0.06em',
          }}>
            SOLD<br />OUT
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '3px' }}>
          <h3 style={{
            margin: 0, flex: 1, minWidth: 0,
            fontSize: '14px', fontWeight: 700, color: 'var(--text)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            letterSpacing: '-0.02em',
          }}>
            {item.title}
          </h3>
          {badge && !item.isSoldOut && (
            <span style={{
              flexShrink: 0,
              fontSize: '11px', fontWeight: 700,
              color: badge.color, background: badge.bg,
              borderRadius: '6px', padding: '2px 7px',
              marginTop: '1px',
              whiteSpace: 'nowrap',
            }}>
              {badge.label}
            </span>
          )}
        </div>

        {item.description ? (
          <p style={{
            margin: '0 0 10px', fontSize: '12px',
            color: 'var(--text-muted)', lineHeight: 1.4,
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {item.description}
          </p>
        ) : (
          <div style={{ height: '10px' }} />
        )}

        {/* Price + action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '17px', fontWeight: 800, color: 'var(--text)',
            letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
          }}>
            {item.price.toLocaleString()}원
          </span>

          {item.isSoldOut ? (
            <span style={{
              fontSize: '12px', fontWeight: 600,
              color: 'var(--text-dim)',
              background: 'var(--surface3)',
              borderRadius: '100px', padding: '5px 12px',
            }}>품절</span>

          ) : cartQuantity > 0 ? (
            /* Stepper */
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'var(--primary-light)',
              borderRadius: '100px',
              overflow: 'hidden',
              gap: '2px',
              padding: '2px',
            }}>
              <button
                onClick={() => updateCartItem(item.id, cartQuantity - 1)}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '100px',
                  border: 'none',
                  background: cartQuantity === 1 ? '#FFE9E9' : 'var(--surface)',
                  color: cartQuantity === 1 ? 'var(--danger)' : 'var(--text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                {cartQuantity === 1 ? <Trash2 size={13} strokeWidth={2.5} /> : <Minus size={13} strokeWidth={2.5} />}
              </button>
              <span style={{
                minWidth: '28px', textAlign: 'center',
                fontSize: '14px', fontWeight: 800,
                color: 'var(--primary)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}>
                {cartQuantity}
              </span>
              <button
                onClick={handleAdd}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '100px',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>

          ) : (
            /* Add button */
            <button
              onClick={handleAdd}
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '8px 16px',
                borderRadius: '100px',
                border: 'none',
                background: justAdded ? 'var(--success)' : 'var(--primary)',
                color: '#fff',
                fontSize: '13px', fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(.34,1.56,.64,1)',
                transform: justAdded ? 'scale(0.96)' : 'scale(1)',
                letterSpacing: '-0.01em',
              }}
            >
              {!justAdded && (
                <span className="shimmer-overlay" style={{ animation: 'shimmer 2.4s ease-in-out infinite' }} />
              )}
              <Plus size={13} strokeWidth={2.5} />
              {justAdded ? '추가됨' : '담기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
