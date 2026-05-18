import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { X, LogOut } from 'lucide-react';

const API = process.env.REACT_APP_API_BASE_URL;

interface OrderItem { name: string; served_by?: string; }
interface Order {
  id: number; table: string; name: string;
  items: OrderItem[] | string; total: number;
  timestamp: string; processed: boolean; checked_out?: boolean; table_size: number;
  image_path?: string;
}

// 돌다방 table 1-70, 흡연부스 table 101-170 (화면엔 둘 다 1-70 표시)
function getZone(t: string) {
  const n = Number(t);
  if (n >= 1   && n <= 70)  return '돌다방';
  if (n >= 101 && n <= 170) return '흡연부스';
  return null;
}

function displayNum(tableNo: number) {
  return tableNo > 100 ? tableNo - 100 : tableNo;
}

function parseItems(raw: OrderItem[] | string): OrderItem[] {
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return raw ?? [];
}

function fmt(ts: string) {
  return new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

type SeatStatus = 'empty' | 'pending' | 'done';

interface SeatInfo {
  status: SeatStatus;
  total: number;
  orders: Order[];
}

export default function SeatMap() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [zone, setZone]         = useState<'돌다방' | '흡연부스'>('돌다방');
  const [selected, setSelected] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get<Order[]>(`${API}/api/orders`);
      setOrders(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchOrders();
    const t = setInterval(fetchOrders, 5000);
    return () => clearInterval(t);
  }, [fetchOrders]);

  const seatMap = (() => {
    const map: Record<number, SeatInfo> = {};
    for (const o of orders) {
      if (o.checked_out) continue;
      const n = Number(o.table);
      if (!Number.isFinite(n) || (n < 1 || (n > 70 && n < 101) || n > 170)) continue;
      if (!map[n]) map[n] = { status: 'empty', total: 0, orders: [] };
      map[n].orders.push(o);
      map[n].total += o.total;
    }
    for (const [k, v] of Object.entries(map)) {
      const seat = Number(k);
      const hasPending = v.orders.some(o => !o.processed);
      map[seat].status = hasPending ? 'pending' : 'done';
    }
    return map;
  })();

  // 돌다방 70석(table 1-70), 흡연부스 70석(table 101-170)
  const offset = zone === '돌다방' ? 0 : 100;
  const seats  = Array.from({ length: 70 }, (_, i) => i + 1 + offset);

  const selectedSeat  = selected !== null ? seatMap[selected] : null;
  const pendingOrders = selectedSeat?.orders.filter(o => !o.processed) ?? [];
  const doneOrders    = selectedSeat?.orders.filter(o =>  o.processed) ?? [];

  const checkout = async () => {
    if (selected === null) return;
    setChecking(true);
    try {
      const fd = new FormData();
      fd.append('table', String(selected));
      await axios.post(`${API}/api/menu/checkout-seat`, fd);
      await fetchOrders();
      setSelected(null);
    } catch {
      alert('퇴석 처리 실패');
    }
    setChecking(false);
  };

  const cellStyle = (seatNo: number): React.CSSProperties => {
    const info = seatMap[seatNo];
    const sel  = selected === seatNo;
    if (!info || info.status === 'empty') return {
      background: sel ? '#E5E8EB' : '#F2F4F6',
      color: '#B0B8C1',
      border: sel ? '2px solid #6B7684' : '2px solid transparent',
    };
    if (info.status === 'pending') return {
      background: sel ? '#1B64DA' : '#3182F6',
      color: '#FFFFFF',
      border: '2px solid transparent',
      boxShadow: '0 2px 8px rgba(49,130,246,0.35)',
    };
    return {
      background: sel ? '#00A85A' : '#E8FBF3',
      color: sel ? '#FFFFFF' : '#00C073',
      border: `2px solid ${sel ? 'transparent' : '#B7F0D8'}`,
    };
  };

  return (
    <div style={{ padding: '12px 16px' }}>

      {/* 구역 탭 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', background: '#F2F4F6', borderRadius: '12px', padding: '4px' }}>
        {(['돌다방', '흡연부스'] as const).map(z => (
          <button key={z} onClick={() => { setZone(z); setSelected(null); }} style={{
            flex: 1, padding: '9px 0', borderRadius: '9px', border: 'none',
            background: zone === z ? '#fff' : 'transparent',
            color: zone === z ? '#3182F6' : '#6B7684',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            boxShadow: zone === z ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s ease',
          }}>
            {z === '돌다방' ? '☕ 돌다방 70석' : '🚬 흡연부스 70석'}
          </button>
        ))}
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {[
          { bg: '#F2F4F6', color: '#B0B8C1', border: 'transparent', label: '빈 자리' },
          { bg: '#3182F6', color: '#fff',    border: 'transparent', label: '주문 대기' },
          { bg: '#E8FBF3', color: '#00C073', border: '#B7F0D8',     label: '서빙 완료' },
        ].map(({ bg, border, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7684' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: bg, border: `1.5px solid ${border}` }} />
            {label}
          </div>
        ))}
      </div>

      {/* 좌석 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {seats.map(seatNo => {
          const info = seatMap[seatNo];
          return (
            <button
              key={seatNo}
              onClick={() => setSelected(selected === seatNo ? null : seatNo)}
              style={{
                ...cellStyle(seatNo),
                borderRadius: '12px',
                padding: '10px 4px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '2px', minHeight: '60px',
                transition: 'all 0.12s ease',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                {displayNum(seatNo)}
              </span>
              {info?.status === 'pending' && (
                <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.9, fontVariantNumeric: 'tabular-nums' }}>
                  {info.total.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 바텀시트 */}
      {selected !== null && (
        <>
          {/* 배경 딤 */}
          <div
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.45)',
            }}
          />

          {/* 시트 */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
            background: '#fff',
            borderRadius: '20px 20px 0 0',
            boxShadow: '0 -4px 32px rgba(0,0,0,0.15)',
            maxHeight: '75vh',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* 드래그 핸들 */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#E5E8EB' }} />
            </div>

            {/* 헤더 */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #F2F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#191F28', letterSpacing: '-0.03em' }}>
                  {displayNum(selected)}번 좌석
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#B0B8C1' }}>
                  {getZone(String(selected))}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{
                width: '32px', height: '32px', borderRadius: '100px', border: 'none',
                background: '#F2F4F6', color: '#6B7684',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <X size={14} />
              </button>
            </div>

            {/* 스크롤 콘텐츠 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              {!selectedSeat || selectedSeat.orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#B0B8C1', fontSize: '14px', padding: '24px 0' }}>
                  주문 없음
                </p>
              ) : (
                <>
                  {pendingOrders.map(o => (
                    <div key={o.id} style={{ marginBottom: '12px', padding: '12px', background: '#F8FAFF', borderRadius: '12px', border: '1px solid #EBF3FE' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#191F28' }}>{o.name}</span>
                        <span style={{ fontSize: '11px', color: '#B0B8C1' }}>{fmt(o.timestamp)}</span>
                      </div>
                      {parseItems(o.items).map((item, i) => (
                        <p key={i} style={{ margin: '2px 0', fontSize: '12px', color: '#6B7684' }}>· {item.name}</p>
                      ))}
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #EBF3FE', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7684' }}>소계</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#3182F6', fontVariantNumeric: 'tabular-nums' }}>
                          {o.total.toLocaleString()}원
                        </span>
                      </div>
                      {o.image_path && (
                        <img src={`${API}/${o.image_path}`} alt="송금증빙" style={{ width: '100%', borderRadius: '8px', marginTop: '8px', objectFit: 'cover', maxHeight: '120px' }} />
                      )}
                    </div>
                  ))}

                  {doneOrders.length > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#B0B8C1', marginBottom: '6px' }}>서빙 완료</p>
                      {doneOrders.map(o => (
                        <div key={o.id} style={{ marginBottom: '8px', padding: '10px 12px', background: '#F2F4F6', borderRadius: '10px', opacity: 0.75 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', color: '#6B7684' }}>{o.name}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#00C073', fontVariantNumeric: 'tabular-nums' }}>
                              {o.total.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ padding: '12px 0', borderTop: '1px solid #F2F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#191F28' }}>합계</span>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#3182F6', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                      {selectedSeat.total.toLocaleString()}원
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 퇴석 버튼 */}
            {selectedSeat && selectedSeat.orders.length > 0 && (
              <div style={{
                padding: '10px 16px',
                paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
                borderTop: '1px solid #F2F4F6',
              }}>
                <button
                  onClick={checkout}
                  disabled={checking}
                  style={{
                    width: '100%', padding: '15px',
                    borderRadius: '12px', border: 'none',
                    background: checking ? '#E5E8EB' : '#F04452',
                    color: checking ? '#B0B8C1' : '#FFFFFF',
                    fontSize: '15px', fontWeight: 800,
                    cursor: checking ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  <LogOut size={16} />
                  {checking ? '처리 중…' : '퇴석 처리'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
