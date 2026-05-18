import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface MenuItemType {
  id: string;
  category: 'main' | 'side' | 'set' | 'drink';
  title: string;
  description: string;
  price: number;
  emoji?: string;
  thumbBg?: string;
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
  '🇰🇷': { bg: '#FEF0F2', emoji: '🇰🇷' },
  '🇨🇳': { bg: '#FEF0F2', emoji: '🇨🇳' },
  '🇯🇵': { bg: '#EBF3FE', emoji: '🇯🇵' },
  '🇺🇸': { bg: '#EBF3FE', emoji: '🇺🇸' },
  '🇪🇸': { bg: '#FFF8ED', emoji: '🇪🇸' },
  '🇷🇺': { bg: '#E5FBF2', emoji: '🇷🇺' },
  '🇫🇷': { bg: '#F0F0FE', emoji: '🇫🇷' },
};
const DEFAULT_THUMB = { bg: '#F2F4F6', emoji: '🥤' };

function getThumb(item: { title: string; emoji?: string; thumbBg?: string }) {
  if (item.emoji) return { bg: item.thumbBg ?? DEFAULT_THUMB.bg, emoji: item.emoji };
  const key = Object.keys(THUMB).find(f => item.title.includes(f));
  return key ? THUMB[key] : DEFAULT_THUMB;
}

const BADGE: Record<string, { label: string; color: string; bg: string }> = {
  '즉시 체포': { label: '인기',  color: '#F04452', bg: '#FEF0F2' },
  '체포 권장': { label: '추천',  color: '#3182F6', bg: '#EBF3FE' },
  '감시 중':   { label: '추천',  color: '#3182F6', bg: '#EBF3FE' },
  '수배 중':   { label: 'NEW',   color: '#FF9500', bg: '#FFF8ED' },
};

const MenuItem: React.FC<MenuItemProps> = ({ item, addToCart, cartQuantity, updateCartItem }) => {
  const [justAdded, setJustAdded] = useState(false);
  const { bg, emoji } = getThumb(item);
  const badge = BADGE[item.investment];

  const handleAdd = () => {
    if (item.isSoldOut) return;
    setJustAdded(true);
    addToCart(item);
    setTimeout(() => setJustAdded(false), 600);
  };

  return (
    <article
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '18px 18px 16px',
        marginBottom: '10px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        opacity: item.isSoldOut ? 0.5 : 1,
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
      }}
    >
      {/* 우: 이미지 (Toss는 이미지를 오른쪽에) */}
      <div style={{ flexShrink: 0, position: 'relative' }}>
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '12px',
          background: item.isSoldOut ? '#F2F4F6' : bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '30px',
          position: 'relative', overflow: 'hidden',
        }}>
          {emoji}
          {item.isSoldOut && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '12px',
              background: 'rgba(242,244,246,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700, color: '#B0B8C1',
              letterSpacing: '0.04em',
            }}>
              품절
            </div>
          )}
        </div>
      </div>

      {/* 좌: 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 배지 */}
        {badge && !item.isSoldOut && (
          <span style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: 700,
            color: badge.color,
            background: badge.bg,
            borderRadius: '4px',
            padding: '2px 6px',
            marginBottom: '5px',
            letterSpacing: '-0.01em',
          }}>
            {badge.label}
          </span>
        )}

        {/* 제목 */}
        <h3 style={{
          margin: '0 0 4px',
          fontSize: '15px', fontWeight: 700,
          color: '#191F28',
          lineHeight: 1.4,
          letterSpacing: '-0.02em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.title}
        </h3>

        {/* 설명 */}
        {item.description && (
          <p style={{
            margin: '0 0 10px',
            fontSize: '13px',
            color: '#B0B8C1',
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {item.description}
          </p>
        )}

        {/* 가격 + 버튼 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: item.description ? 0 : '10px',
        }}>
          <span style={{
            fontSize: '17px', fontWeight: 800,
            color: '#191F28',
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {item.price.toLocaleString()}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7684', marginLeft: '1px' }}>원</span>
          </span>

          {/* 버튼 영역 */}
          {item.isSoldOut ? (
            <span style={{
              fontSize: '13px', fontWeight: 600,
              color: '#B0B8C1',
              background: '#F2F4F6',
              borderRadius: '100px', padding: '7px 14px',
            }}>품절</span>

          ) : cartQuantity > 0 ? (
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#F2F4F6',
              borderRadius: '100px',
              padding: '4px',
              gap: '2px',
            }}>
              <button
                onClick={() => updateCartItem(item.id, cartQuantity - 1)}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '100px', border: 'none',
                  background: cartQuantity === 1 ? '#FEF0F2' : '#FFFFFF',
                  color: cartQuantity === 1 ? '#F04452' : '#6B7684',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  transition: 'all 0.12s ease',
                }}
              >
                {cartQuantity === 1
                  ? <Trash2 size={13} strokeWidth={2} />
                  : <Minus size={13} strokeWidth={2} />}
              </button>
              <span style={{
                minWidth: '28px', textAlign: 'center',
                fontSize: '15px', fontWeight: 800,
                color: '#191F28',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {cartQuantity}
              </span>
              <button
                onClick={handleAdd}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '100px', border: 'none',
                  background: '#3182F6',
                  color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                <Plus size={13} strokeWidth={2} />
              </button>
            </div>

          ) : (
            <button
              onClick={handleAdd}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '8px 16px',
                background: justAdded ? '#00C073' : '#3182F6',
                color: '#FFFFFF',
                borderRadius: '100px',
                border: 'none',
                fontSize: '13px', fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease',
                transform: justAdded ? 'scale(0.96)' : 'scale(1)',
              }}
            >
              {justAdded ? (
                '✓ 담김'
              ) : (
                <>
                  <Plus size={12} strokeWidth={2.5} />
                  담기
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default MenuItem;
