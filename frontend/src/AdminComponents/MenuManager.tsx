import { useEffect, useState } from 'react';
import axios from 'axios';
import { MENU_ITEMS } from '../data/menuItems';

const API = process.env.REACT_APP_API_BASE_URL;

const CATEGORY_LABEL: Record<string, string> = {
  main: '메인', side: '사이드', set: '세트', drink: '음료',
};

export default function MenuManager() {
  const [soldout, setSoldout] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const fetchSoldout = () =>
    axios.get<string[]>(`${API}/api/menu/soldout`)
      .then(r => setSoldout(new Set(r.data)))
      .catch(() => {});

  useEffect(() => { fetchSoldout(); }, []);

  const toggle = async (itemId: string) => {
    setLoading(itemId);
    try {
      await axios.post(`${API}/api/menu/soldout/${itemId}`);
      await fetchSoldout();
    } catch {}
    setLoading(null);
  };

  const grouped = MENU_ITEMS.reduce<Record<string, typeof MENU_ITEMS>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '16px' }}>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 10px 4px', fontSize: '13px', fontWeight: 700,
            color: '#6B7684', letterSpacing: '-0.01em',
          }}>
            {CATEGORY_LABEL[cat] ?? cat}
          </h3>
          <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {items.map((item, idx) => {
              const isSoldOut = soldout.has(item.id);
              const isLoading = loading === item.id;
              return (
                <div key={item.id}>
                  {idx > 0 && <div style={{ height: '1px', background: '#F2F4F6', margin: '0 16px' }} />}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px',
                    opacity: isSoldOut ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}>
                    {/* 썸네일 */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                      background: item.thumbBg ?? '#F2F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px',
                      filter: isSoldOut ? 'grayscale(1)' : 'none',
                    }}>
                      {item.emoji ?? '🍽️'}
                    </div>

                    {/* 정보 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0, fontSize: '14px', fontWeight: 700, color: '#191F28',
                        letterSpacing: '-0.02em',
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>
                        {item.description || item.title}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7684', fontVariantNumeric: 'tabular-nums' }}>
                        {item.price.toLocaleString()}원
                        {isSoldOut && (
                          <span style={{
                            marginLeft: '8px', fontSize: '11px', fontWeight: 700,
                            color: '#F04452', background: '#FEF0F2',
                            borderRadius: '4px', padding: '1px 6px',
                          }}>품절</span>
                        )}
                      </p>
                    </div>

                    {/* 토글 */}
                    <button
                      onClick={() => toggle(item.id)}
                      disabled={isLoading}
                      style={{
                        padding: '8px 16px', borderRadius: '100px', border: 'none',
                        background: isSoldOut ? '#FEF0F2' : '#F2F4F6',
                        color: isSoldOut ? '#F04452' : '#6B7684',
                        fontSize: '13px', fontWeight: 700,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        flexShrink: 0, transition: 'all 0.15s ease',
                        opacity: isLoading ? 0.5 : 1,
                      }}
                    >
                      {isLoading ? '…' : isSoldOut ? '품절 해제' : '품절 처리'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
