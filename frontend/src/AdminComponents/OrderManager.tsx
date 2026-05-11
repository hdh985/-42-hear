import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import AdminOrderItem from './AdminOrderItem';
import { Search, RefreshCw, Loader2, Bell, X, Clock, CheckCircle2, Coffee, Cigarette } from 'lucide-react';

interface OrderItem { name: string; served_by?: string; }
interface Order {
  id: number; table: string; name: string; items: OrderItem[] | string;
  total: number; song: string; image_path: string;
  timestamp: string; processed: boolean; table_size: number;
}
interface Props { onRevenueUpdate?: (total: number) => void; onOrderData?: (orders: Order[]) => void; adminName: string; }

type Zone = '돌다방' | '흡연부스' | '기타';
function getZone(t: string): Zone {
  const n = Number(t);
  if (!Number.isFinite(n)) return '기타';
  if (n >= 1  && n <= 50)  return '돌다방';
  if (n >= 51 && n <= 100) return '흡연부스';
  return '기타';
}

export default function OrderManager({ onRevenueUpdate, onOrderData, adminName }: Props) {
  const [orders, setOrders]           = useState<Order[]>([]);
  const [query, setQuery]             = useState('');
  const [showDone, setShowDone]       = useState(true);
  const [isFetching, setIsFetching]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab]     = useState<'돌다방' | '흡연부스'>('돌다방');

  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const hasMounted     = useRef(false);
  const prevPending    = useRef<number[]>([]);
  const onRevRef       = useRef(onRevenueUpdate);
  const onDataRef      = useRef(onOrderData);
  const abortRef       = useRef<AbortController | null>(null);
  const lastVersionRef = useRef<string | null>(null);      // X-Data-Version 추적

  useEffect(() => { onRevRef.current = onRevenueUpdate; onDataRef.current = onOrderData; }, [onRevenueUpdate, onOrderData]);

  const fetchOrders = useCallback(async () => {
    // 이전 요청이 아직 진행 중이면 취소 (중복 폴링 방지)
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      setIsFetching(true);
      const { data, headers } = await axios.get<Order[]>(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders`,
        { signal: abortRef.current.signal }
      );

      setLastUpdated(new Date());

      // 버전 동일 → 데이터 변경 없음, setState 생략으로 리렌더 방지
      const v = headers['x-data-version'] as string | undefined;
      if (v !== undefined && v === lastVersionRef.current) return;
      lastVersionRef.current = v ?? null;

      const sorted = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onRevRef.current?.(sorted.reduce((s, o) => s + o.total, 0));
      onDataRef.current?.(sorted);

      const cur = sorted.filter(o => !o.processed).map(o => o.id);
      // 첫 로딩(hasMounted=false)엔 알림음 스킵
      if (hasMounted.current) {
        const prev = new Set(prevPending.current);
        if (cur.some(id => !prev.has(id)) && audioRef.current) {
          try { await audioRef.current.play(); } catch {}
        }
      }
      prevPending.current = cur;
      setOrders(sorted);
      hasMounted.current = true;
    } catch (e: any) {
      if (e?.name === 'CanceledError' || e?.name === 'AbortError' || axios.isCancel(e)) return;
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3');
    fetchOrders();
    const t = setInterval(fetchOrders, 5000);
    return () => {
      clearInterval(t);
      abortRef.current?.abort(); // 언마운트 시 진행 중 요청 취소
    };
  }, [fetchOrders]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => orders.filter(o => {
    if (!q) return true;
    if (o.table.toLowerCase().includes(q) || (o.name || '').toLowerCase().includes(q)) return true;
    try { const its: OrderItem[] = typeof o.items === 'string' ? JSON.parse(o.items || '[]') : o.items || []; return its.some(i => i.name.toLowerCase().includes(q)); } catch { return false; }
  }), [orders, q]);

  const dolAll   = useMemo(() => filtered.filter(o => getZone(o.table) === '돌다방'),   [filtered]);
  const smokeAll = useMemo(() => filtered.filter(o => getZone(o.table) === '흡연부스'), [filtered]);
  const hasEtc   = useMemo(() => filtered.some(o => getZone(o.table) === '기타'),        [filtered]);

  const split = (arr: Order[]) => ({ pending: arr.filter(o => !o.processed), done: arr.filter(o => o.processed) });
  const dol   = useMemo(() => split(dolAll),   [dolAll]);
  const smoke = useMemo(() => split(smokeAll), [smokeAll]);
  const active = activeTab === '돌다방' ? dol : smoke;

  const tabCfg = [
    { key: '돌다방'  as const, icon: <Coffee   size={14} />, pending: dol.pending.length,   total: dolAll.length,   activeColor: '#3182F6', activeBg: '#EBF3FE' },
    { key: '흡연부스' as const, icon: <Cigarette size={14} />, pending: smoke.pending.length, total: smokeAll.length, activeColor: '#FF9500', activeBg: '#FFF8ED' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>

      {/* Stats + refresh */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        {[
          { icon: <Clock size={13} />, label: '대기', value: active.pending.length, color: '#3182F6', bg: '#EBF3FE' },
          { icon: <CheckCircle2 size={13} />, label: '완료', value: active.done.length, color: '#00C073', bg: '#E8FBF3' },
        ].map(({ icon, label, value, color, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '100px', background: bg, fontSize: '13px', fontWeight: 700, color }}>
            {icon} <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span> <span style={{ fontWeight: 500, opacity: 0.8 }}>{label}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lastUpdated && <span style={{ fontSize: '11px', color: '#B0B8C1' }}>{lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>}
          <button onClick={fetchOrders} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '100px', border: 'none', background: '#3182F6', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            {isFetching ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={13} />} 새로고침
          </button>
        </div>
      </div>

      {/* Sticky controls */}
      <div style={{ position: 'sticky', top: '56px', zIndex: 10, background: 'rgba(242,244,246,0.95)', backdropFilter: 'blur(12px)', paddingBottom: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', paddingTop: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#B0B8C1' }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="테이블/이름/메뉴 검색" style={{
              width: '100%', padding: '11px 40px', borderRadius: '12px', border: '1px solid #E5E8EB',
              fontSize: '14px', outline: 'none', background: '#fff', letterSpacing: '-0.01em', boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
              onFocus={e => { e.target.style.borderColor = '#3182F6'; }}
              onBlur={e => { e.target.style.borderColor = '#E5E8EB'; }}
            />
            {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#B0B8C1', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#6B7684', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)} style={{ accentColor: '#3182F6', width: '15px', height: '15px' }} />
            완료 표시
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#B0B8C1', whiteSpace: 'nowrap' }}>
            <Bell size={12} /> 알림음
          </div>
        </div>

        {/* Zone tabs */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#F2F4F6', borderRadius: '12px', padding: '4px' }}>
          {tabCfg.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                padding: '9px 0', borderRadius: '9px', border: 'none',
                background: isActive ? '#fff' : 'transparent',
                color: isActive ? tab.activeColor : '#6B7684',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.18s ease',
                letterSpacing: '-0.02em',
              }}>
                {tab.icon} {tab.key}
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '100px', background: isActive ? tab.activeBg : 'rgba(0,0,0,0.05)', color: isActive ? tab.activeColor : '#6B7684' }}>
                  {tab.pending}/{tab.total}
                </span>
              </button>
            );
          })}
          {hasEtc && <span style={{ fontSize: '11px', color: '#FF9500', marginLeft: '8px', whiteSpace: 'nowrap' }}>⚠ 범위 밖 주문 있음</span>}
        </div>
      </div>

      {/* Pending */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em' }}>
            대기 중 · {activeTab}
          </h3>
          <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: '#EBF3FE', color: '#3182F6' }}>{active.pending.length}건</span>
        </div>
        {active.pending.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', background: '#fff', borderRadius: '16px', color: '#B0B8C1', fontSize: '14px', border: '1px solid #E5E8EB' }}>
            대기 중인 주문 없음
          </div>
        ) : (
          active.pending.map(order => (
            <AdminOrderItem key={order.id} order={order} adminName={adminName} onRefresh={fetchOrders} />
          ))
        )}
      </section>

      {/* Done */}
      {showDone && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#6B7684', letterSpacing: '-0.03em' }}>
              처리 완료 · {activeTab}
            </h3>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: '#E8FBF3', color: '#00C073' }}>{active.done.length}건</span>
          </div>
          {active.done.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', background: '#fff', borderRadius: '16px', color: '#B0B8C1', fontSize: '14px', border: '1px solid #E5E8EB' }}>
              완료된 주문 없음
            </div>
          ) : (
            active.done.map(order => (
              <AdminOrderItem key={order.id} order={order} adminName={adminName} onRefresh={fetchOrders} />
            ))
          )}
        </section>
      )}
    </div>
  );
}
