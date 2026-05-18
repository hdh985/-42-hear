import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Timer, CheckCircle2, Undo2, Users, Music, Receipt, UserCheck, Image as ImageIcon } from 'lucide-react';

interface OrderItem { name: string; served_by?: string; }
interface Order {
  id: number; table: string; name: string;
  items: OrderItem[] | string; total: number; song: string;
  image_path: string; timestamp: string; processed: boolean; table_size: number;
}
interface Props { order: Order; adminName: string; onRefresh: () => void; }

const API = process.env.REACT_APP_API_BASE_URL;

function getZone(table: string) {
  const n = Number(table);
  if (n >= 1   && n <= 70)  return '돌다방'  as const;
  if (n >= 101 && n <= 170) return '흡연부스' as const;
  return '기타' as const;
}

// 흡연부스(101-170)는 화면에 1-70으로 표시
function displayNum(table: string) {
  const n = Number(table);
  if (n >= 101 && n <= 170) return String(n - 100);
  return table;
}

export default function AdminOrderItem({ order, adminName, onRefresh }: Props) {
  // 낙관적 UI: 서버 응답 전에 즉시 반영
  const [local, setLocal] = useState(order);
  useEffect(() => { setLocal(order); }, [order]);

  const zone     = useMemo(() => getZone(local.table), [local.table]);
  const zoneBg    = zone === '돌다방' ? '#EBF3FE' : zone === '흡연부스' ? '#FFF8ED' : '#F2F4F6';
  const zoneColor = zone === '돌다방' ? '#3182F6' : zone === '흡연부스' ? '#FF9500' : '#6B7684';

  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (local.processed) { setSeconds(0); return; }
    const iso   = local.timestamp.endsWith('Z') ? local.timestamp : `${local.timestamp}Z`;
    const start = new Date(iso).getTime();
    const tick  = () => setSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [local.processed, local.timestamp]);

  const renderTimer = (sec: number) => {
    const m = Math.floor(sec / 60), s = sec % 60;
    const str   = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const color = sec >= 900 ? '#F04452' : sec >= 600 ? '#FF9500' : '#00C073';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color, background: `${color}14`, borderRadius: '100px', padding: '4px 10px', fontVariantNumeric: 'tabular-nums' }}>
        <Timer size={12} /> {str}
      </span>
    );
  };

  let parsedItems: OrderItem[] = [];
  try {
    parsedItems = typeof local.items === 'string' ? JSON.parse(local.items || '[]') : (local.items as OrderItem[]);
    if (!Array.isArray(parsedItems)) parsedItems = [];
  } catch { parsedItems = []; }

  const allServed = parsedItems.length > 0 && parsedItems.every(i => !!i.served_by);

  const [loadingIdx, setLoadingIdx]     = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isToggling, setIsToggling]     = useState(false);
  const [showProof, setShowProof]       = useState(false);

  const handleItemToggle = async (idx: number, currentServedBy?: string) => {
    const wasProcessed = local.processed;
    const isUndo = !!currentServedBy;

    // 낙관적 업데이트: 즉시 UI 반영
    const newItems = parsedItems.map((item, i) =>
      i === idx ? { ...item, served_by: isUndo ? undefined : adminName } : item
    );
    setLocal(prev => ({
      ...prev,
      items: JSON.stringify(newItems),
      // 완료된 주문에서 되돌리기 → 대기 상태로 복귀
      processed: isUndo && wasProcessed ? false : prev.processed,
    }));

    try {
      setLoadingIdx(idx);
      const fd = new FormData();
      fd.append('item_index', String(idx));
      fd.append('admin', isUndo ? '' : adminName);
      await axios.patch(`${API}/api/orders/${order.id}/serve-item`, fd);
      // 완료 주문에서 되돌렸으면 order도 대기로 복원
      if (isUndo && wasProcessed) {
        await axios.patch(`${API}/api/orders/${order.id}/toggle`);
      }
      onRefresh();
    } catch (e) {
      setLocal(order); // 실패 시 원래 상태로 되돌림
      console.error(e);
    } finally {
      setLoadingIdx(null);
    }
  };

  const handleComplete = async () => {
    setLocal(prev => ({ ...prev, processed: true })); // 낙관적
    try {
      setIsCompleting(true);
      await axios.patch(`${API}/api/orders/${order.id}/complete`);
      onRefresh();
    } catch (e) {
      setLocal(order);
      console.error(e);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleToggle = async () => {
    setLocal(prev => ({ ...prev, processed: !prev.processed })); // 낙관적
    try {
      setIsToggling(true);
      await axios.patch(`${API}/api/orders/${order.id}/toggle`);
      onRefresh();
    } catch (e) {
      setLocal(order);
      console.error(e);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', marginBottom: '12px',
      boxShadow: local.processed ? '0 1px 4px rgba(0,0,0,0.05)' : '0 2px 12px rgba(0,0,0,0.08)',
      opacity: local.processed ? 0.75 : 1,
      overflow: 'hidden', transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
      border: '1px solid var(--border, #E5E8EB)',
    }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', padding: '14px 16px 12px', borderBottom: '1px solid var(--border, #E5E8EB)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: zoneColor, background: zoneBg, borderRadius: '100px', padding: '3px 10px' }}>
              {zone}
            </span>
            <span style={{ fontSize: '11px', color: '#B0B8C1' }}>#{order.id}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#191F28', letterSpacing: '-0.04em' }}>
              테이블 {displayNum(local.table)}
            </span>
            <span style={{ color: '#E5E8EB' }}>·</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>{local.name}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#6B7684' }}>
              <Users size={12} /> {local.table_size}명
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          {!local.processed && renderTimer(seconds)}
          <span style={{
            fontSize: '12px', fontWeight: 700, borderRadius: '100px', padding: '4px 12px',
            background: local.processed ? '#F2F4F6' : '#E8FBF3',
            color: local.processed ? '#6B7684' : '#00C073',
          }}>
            {local.processed ? '처리됨' : '대기'}
          </span>
          <button
            onClick={handleToggle}
            disabled={isToggling}
            style={{
              fontSize: '12px', fontWeight: 700, padding: '7px 14px', borderRadius: '100px', border: 'none',
              background: '#F2F4F6', color: '#6B7684', cursor: 'pointer',
              opacity: isToggling ? 0.5 : 1, transition: 'opacity 0.15s ease',
            }}
          >
            {local.processed ? '↩ 대기로' : '✅ 완료 처리'}
          </button>
        </div>
      </div>

      {/* 메뉴 항목 */}
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

            {/* 서빙됨 → 항상 되돌리기 가능 / 미서빙 → 대기 중일 때만 처리 가능 */}
            {item.served_by ? (
              <button
                onClick={() => handleItemToggle(idx, item.served_by)}
                disabled={loadingIdx === idx}
                style={{
                  fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', border: 'none',
                  background: '#FFF2F1', color: '#F04452',
                  cursor: loadingIdx === idx ? 'not-allowed' : 'pointer',
                  opacity: loadingIdx === idx ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  whiteSpace: 'nowrap', transition: 'opacity 0.15s ease',
                }}
              >
                <Undo2 size={11} /> 되돌리기
              </button>
            ) : !local.processed ? (
              <button
                onClick={() => handleItemToggle(idx, undefined)}
                disabled={loadingIdx === idx}
                style={{
                  fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', border: 'none',
                  background: '#EBF3FE', color: '#3182F6',
                  cursor: loadingIdx === idx ? 'not-allowed' : 'pointer',
                  opacity: loadingIdx === idx ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  whiteSpace: 'nowrap', transition: 'opacity 0.15s ease',
                }}
              >
                <CheckCircle2 size={11} /> 처리
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* 요약 바 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', padding: '10px 16px', borderTop: '1px solid var(--border, #E5E8EB)', background: 'var(--surface3, #F2F4F6)' }}>
        {[
          { icon: <Receipt size={12} />, label: '금액',    value: `${local.total.toLocaleString('ko-KR')}원` },
          { icon: <Music size={12} />,   label: '요청곡',  value: local.song || '-' },
          { icon: <Timer size={12} />,   label: '주문시각', value: new Date(local.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6B7684', overflow: 'hidden' }}>
            <span style={{ flexShrink: 0 }}>{icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <strong>{label}</strong> {value}
            </span>
          </div>
        ))}
      </div>

      {/* 증빙 이미지 */}
      {order.image_path && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border, #E5E8EB)' }}>
          <button onClick={() => setShowProof(v => !v)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', border: 'none',
            background: '#EBF3FE', color: '#3182F6', cursor: 'pointer',
          }}>
            <ImageIcon size={12} /> {showProof ? '증빙 숨기기' : '증빙 보기'}
          </button>
          {showProof && (
            <img
              src={`${API}/uploads/${order.image_path.replace(/^uploads\//, '')}?v=2`}
              crossOrigin="anonymous" alt="증빙"
              style={{ display: 'block', marginTop: '10px', width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--border, #E5E8EB)' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      )}

      {/* 전체 처리 완료 버튼 */}
      {!local.processed && allServed && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border, #E5E8EB)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            style={{
              padding: '10px 24px', borderRadius: '100px', border: 'none',
              background: '#3182F6', color: '#fff', fontSize: '14px', fontWeight: 800,
              cursor: isCompleting ? 'not-allowed' : 'pointer',
              opacity: isCompleting ? 0.6 : 1,
              boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
              letterSpacing: '-0.02em', transition: 'opacity 0.15s ease',
            }}
          >
            {isCompleting ? '처리 중…' : '✅ 전체 처리 완료'}
          </button>
        </div>
      )}
    </div>
  );
}
