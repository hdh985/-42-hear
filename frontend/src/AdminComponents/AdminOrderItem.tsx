import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Timer, CheckCircle2, Undo2, Users, Music, Receipt, UserCheck, Image as ImageIcon } from 'lucide-react';

interface OrderItem { name: string; served_by?: string; }
interface Order {
  id: number; table: string; name: string;
  items: OrderItem[] | string; total: number; song: string;
  image_path: string; timestamp: string; processed: boolean; table_size: number;
}
// elapsed prop 제거 — 컴포넌트 내부에서 직접 계산
interface Props { order: Order; adminName: string; onRefresh: () => void; }

const getZone = (table: number) => {
  if (table >= 1  && table <= 50)  return '돌다방'  as const;
  if (table >= 51 && table <= 100) return '흡연부스' as const;
  return '기타' as const;
};

export default function AdminOrderItem({ order, adminName, onRefresh }: Props) {
  const zone = useMemo(() => getZone(Number(order.table)), [order.table]);
  const zoneBg    = zone === '돌다방' ? '#EBF3FE' : zone === '흡연부스' ? '#FFF8ED' : '#F2F4F6';
  const zoneColor = zone === '돌다방' ? '#3182F6' : zone === '흡연부스' ? '#FF9500' : '#6B7684';

  // 각 카드가 독립적으로 타이머 관리 → OrderManager 전체 리렌더 없음
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (order.processed) { setSeconds(0); return; }
    const iso = order.timestamp.endsWith('Z') ? order.timestamp : `${order.timestamp}Z`;
    const start = new Date(iso).getTime();
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [order.processed, order.timestamp]);

  const renderTimer = (sec: number) => {
    const m = Math.floor(sec / 60), s = sec % 60;
    const str = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const color = sec >= 900 ? '#F04452' : sec >= 600 ? '#FF9500' : '#00C073';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '12px', fontWeight: 700, color,
        background: `${color}14`,
        borderRadius: '100px', padding: '4px 10px',
        fontVariantNumeric: 'tabular-nums',
      }}>
        <Timer size={12} /> {str}
      </span>
    );
  };

  let parsedItems: OrderItem[] = [];
  try {
    parsedItems = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : order.items;
    if (!Array.isArray(parsedItems)) parsedItems = [];
  } catch { parsedItems = []; }

  const allServed = parsedItems.length > 0 && parsedItems.every(i => !!i.served_by);

  const [loadingIdx, setLoadingIdx]     = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isToggling, setIsToggling]     = useState(false);
  const [showProof, setShowProof]       = useState(false);

  const handleItemToggle = async (idx: number, currentServedBy?: string) => {
    try {
      setLoadingIdx(idx);
      const fd = new FormData();
      fd.append('item_index', String(idx));
      fd.append('admin', currentServedBy ? '' : adminName);
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${order.id}/serve-item`, fd);
      onRefresh();
    } catch (e) { console.error(e); } finally { setLoadingIdx(null); }
  };

  const handleComplete = async () => {
    try { setIsCompleting(true); await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${order.id}/complete`); onRefresh(); }
    catch (e) { console.error(e); } finally { setIsCompleting(false); }
  };

  const handleToggle = async () => {
    try { setIsToggling(true); await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${order.id}/toggle`); onRefresh(); }
    catch (e) { console.error(e); } finally { setIsToggling(false); }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      marginBottom: '12px',
      boxShadow: order.processed ? '0 1px 4px rgba(0,0,0,0.05)' : '0 2px 12px rgba(0,0,0,0.08)',
      opacity: order.processed ? 0.75 : 1,
      overflow: 'hidden',
      transition: 'box-shadow 0.15s ease',
      border: '1px solid var(--border, #E5E8EB)',
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '10px', padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border, #E5E8EB)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: zoneColor, background: zoneBg, borderRadius: '100px', padding: '3px 10px' }}>
              {zone}
            </span>
            <span style={{ fontSize: '11px', color: '#B0B8C1' }}>#{order.id}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#191F28', letterSpacing: '-0.04em' }}>
              테이블 {order.table}
            </span>
            <span style={{ color: '#E5E8EB' }}>·</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>{order.name}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#6B7684' }}>
              <Users size={12} /> {order.table_size}명
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          {!order.processed && renderTimer(seconds)}
          <span style={{
            fontSize: '12px', fontWeight: 700, borderRadius: '100px', padding: '4px 12px',
            background: order.processed ? '#F2F4F6' : '#E8FBF3',
            color: order.processed ? '#6B7684' : '#00C073',
          }}>
            {order.processed ? '처리됨' : '대기'}
          </span>
          <button
            onClick={handleToggle}
            disabled={isToggling}
            style={{
              fontSize: '12px', fontWeight: 700, padding: '7px 14px', borderRadius: '100px', border: 'none',
              background: '#F2F4F6', color: '#6B7684', cursor: 'pointer',
              opacity: isToggling ? 0.5 : 1, transition: 'all 0.15s ease',
            }}
          >
            {order.processed ? '↩ 대기로' : '✅ 완료 처리'}
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '8px 16px' }}>
        {parsedItems.length === 0 && (
          <p style={{ fontSize: '13px', color: '#B0B8C1', padding: '6px 0' }}>메뉴 항목이 없습니다.</p>
        )}
        {parsedItems.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '9px 0',
            borderBottom: idx < parsedItems.length - 1 ? '1px solid var(--border, #E5E8EB)' : 'none',
          }}>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#191F28', letterSpacing: '-0.01em' }}>
                {item.name}
              </span>
              {item.served_by && (
                <span style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#00C073', fontWeight: 600 }}>
                  <UserCheck size={11} /> {item.served_by}
                </span>
              )}
            </div>
            {!order.processed && (
              <button
                onClick={() => handleItemToggle(idx, item.served_by)}
                disabled={loadingIdx === idx}
                style={{
                  fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', border: 'none',
                  background: item.served_by ? '#FFF2F1' : '#EBF3FE',
                  color: item.served_by ? '#F04452' : '#3182F6',
                  cursor: 'pointer', opacity: loadingIdx === idx ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  whiteSpace: 'nowrap', transition: 'all 0.15s ease',
                }}
              >
                {item.served_by
                  ? <><Undo2 size={11} /> 되돌리기</>
                  : <><CheckCircle2 size={11} /> 처리</>}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', padding: '10px 16px', borderTop: '1px solid var(--border, #E5E8EB)', background: 'var(--surface3, #F2F4F6)' }}>
        {[
          { icon: <Receipt size={12} />,  label: '금액',    value: `${order.total.toLocaleString('ko-KR')}원` },
          { icon: <Music size={12} />,    label: '요청곡',  value: order.song || '-' },
          { icon: <Timer size={12} />,    label: '주문시각', value: new Date(order.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6B7684', overflow: 'hidden' }}>
            <span style={{ flexShrink: 0 }}>{icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <strong>{label}</strong> {value}
            </span>
          </div>
        ))}
      </div>

      {/* Proof image */}
      {order.image_path && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border, #E5E8EB)' }}>
          <button onClick={() => setShowProof(v => !v)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', border: 'none',
            background: 'var(--primary-light, #EBF3FE)', color: 'var(--primary, #3182F6)', cursor: 'pointer',
          }}>
            <ImageIcon size={12} /> {showProof ? '증빙 숨기기' : '증빙 보기'}
          </button>
          {showProof && (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${order.image_path.replace(/^uploads\//, '')}?v=2`}
              crossOrigin="anonymous" alt="증빙"
              style={{ display: 'block', marginTop: '10px', width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--border, #E5E8EB)' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      )}

      {/* Complete CTA */}
      {!order.processed && allServed && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border, #E5E8EB)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            style={{
              padding: '10px 24px', borderRadius: '100px', border: 'none',
              background: '#3182F6', color: '#fff', fontSize: '14px', fontWeight: 800,
              cursor: 'pointer', opacity: isCompleting ? 0.6 : 1,
              boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
              letterSpacing: '-0.02em',
            }}
          >
            {isCompleting ? '처리 중…' : '✅ 전체 처리 완료'}
          </button>
        </div>
      )}
    </div>
  );
}
