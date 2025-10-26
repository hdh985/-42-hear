import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import AdminOrderItem from './AdminOrderItem';
import { Search, RefreshCw, Loader2, Bell, X, Clock, CheckCircle2, Coffee, Cigarette } from 'lucide-react';

interface OrderItem {
  name: string;
  served_by?: string;
}

interface Order {
  id: number;
  table: string;
  name: string;
  items: OrderItem[] | string; // 문자열 가능성 고려
  total: number;
  song: string;
  image_path: string;
  timestamp: string;
  processed: boolean;
  table_size: number;
}

interface Props {
  onRevenueUpdate?: (total: number) => void;
  onOrderData?: (orders: Order[]) => void;
  adminName: string;
}

type Zone = '돌다방' | '흡연부스' | '기타';

function getZone(tableStr: string): Zone {
  const t = Number(tableStr);
  if (!Number.isFinite(t)) return '기타';
  if (t >= 1 && t <= 50) return '돌다방';
  if (t >= 51 && t <= 100) return '흡연부스';
  return '기타';
}

export default function OrderManager({ onRevenueUpdate, onOrderData, adminName }: Props) {
  // ===== State =====
  const [orders, setOrders] = useState<Order[]>([]);
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: number]: number }>({});
  const [query, setQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<Exclude<Zone, '기타'>>('돌다방');

  // ===== Refs =====
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasMountedRef = useRef(false);
  const prevPendingIdsRef = useRef<number[]>([]);
  const onRevenueUpdateRef = useRef(onRevenueUpdate);
  const onOrderDataRef = useRef(onOrderData);

  useEffect(() => {
    onRevenueUpdateRef.current = onRevenueUpdate;
    onOrderDataRef.current = onOrderData;
  }, [onRevenueUpdate, onOrderData]);

  // ===== Fetch Orders =====
  const fetchOrders = useCallback(async () => {
    try {
      setIsFetching(true);
      const { data } = await axios.get<Order[]>(`${process.env.REACT_APP_API_BASE_URL}/api/orders`);
      const sorted = [...data].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Compute revenue + publish raw
      onRevenueUpdateRef.current?.(sorted.reduce((sum, o) => sum + o.total, 0));
      onOrderDataRef.current?.(sorted);

      // Sound for new pending orders (after first load)
      const currentPending = sorted.filter(o => !o.processed).map(o => o.id);
      if (hasMountedRef.current) {
        const prevSet = new Set(prevPendingIdsRef.current);
        const hasNew = currentPending.some(id => !prevSet.has(id));
        if (hasNew && audioRef.current) {
          try { await audioRef.current.play(); } catch {}
        }
      }
      prevPendingIdsRef.current = currentPending;

      setOrders(sorted);
      setLastUpdated(new Date());
      hasMountedRef.current = true;
    } catch (err) {
      console.error('주문 조회 실패', err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // ===== Mount: audio + initial fetch + polling =====
  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3');
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // ===== Tick elapsed timers =====
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTimes(current => {
        const updated: { [key: number]: number } = {};
        orders.forEach(order => {
          if (!order.processed) {
            // UTC 파싱 (Z 보정)
            const iso = order.timestamp.endsWith('Z') ? order.timestamp : `${order.timestamp}Z`;
            const orderTime = new Date(iso).getTime();
            updated[order.id] = Math.max(0, Math.floor((Date.now() - orderTime) / 1000));
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [orders]);

  // ===== Filter (검색: 테이블/이름/메뉴 문자열 매칭) =====
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (!normalizedQuery) return true;

      const inTable = o.table.toLowerCase().includes(normalizedQuery);
      const inName = (o.name || '').toLowerCase().includes(normalizedQuery);
      let inItems = false;
      try {
        const items: OrderItem[] = typeof o.items === 'string' ? JSON.parse(o.items || '[]') : o.items || [];
        inItems = items.some(it => it.name.toLowerCase().includes(normalizedQuery));
      } catch {
        inItems = false;
      }
      return inTable || inName || inItems;
    });
  }, [orders, normalizedQuery]);

  // ===== Zone split =====
  const { dolAll, smokeAll, hasEtc } = useMemo(() => {
    const dolAll = filtered.filter((o) => getZone(o.table) === '돌다방');
    const smokeAll = filtered.filter((o) => getZone(o.table) === '흡연부스');
    const hasEtc = filtered.some((o) => getZone(o.table) === '기타');
    return { dolAll, smokeAll, hasEtc };
  }, [filtered]);

  const splitByProcessed = (arr: Order[]) => ({
    pending: arr.filter(o => !o.processed),
    done: arr.filter(o => o.processed),
  });

  const dol = useMemo(() => splitByProcessed(dolAll), [dolAll]);
  const smoke = useMemo(() => splitByProcessed(smokeAll), [smokeAll]);

  const active = activeTab === '돌다방' ? dol : smoke;

  // ===== UI Helpers =====
  const StatBadge = ({ icon: Icon, label, value, tone = 'slate' }: { icon: any; label: string; value: string | number; tone?: 'slate' | 'blue' | 'emerald' }) => {
    const toneMap = {
      slate: 'bg-slate-50 text-slate-700 ring-slate-200',
      blue: 'bg-blue-50 text-blue-700 ring-blue-200',
      emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    } as const;
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ring-1 ${toneMap[tone]} min-w-[8rem] justify-center`}>
        <Icon className="w-4 h-4" />
        <div className="text-sm"><span className="font-semibold mr-1">{value}</span>{label}</div>
      </div>
    );
  };

  // ===== Render =====
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">📋 주문 관리자</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {/* 활성 탭 기준 통계 */}
            <StatBadge icon={Clock} label="대기" value={active.pending.length} tone="blue" />
            <StatBadge icon={CheckCircle2} label="완료" value={active.done.length} tone="emerald" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
            aria-label="새로고침"
          >
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 새로고침
          </button>
          <div className="text-xs text-gray-500">
            {lastUpdated ? `업데이트: ${lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : '업데이트 대기'}
          </div>
        </div>
      </div>

      {/* Controls + Tabs (sticky) */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-y">
        <div className="py-3 px-0">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch px-0">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="테이블/이름/메뉴 검색"
                className="w-full pl-9 pr-9 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {query && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  onClick={() => setQuery('')}
                  aria-label="검색어 지우기"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sound indicator (readonly visual) */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <Bell className="w-4 h-4" /> 알림음: 신규 대기 주문
            </div>

            {/* Toggle Completed */}
            <label className="inline-flex items-center gap-2 text-sm select-none px-1">
              <input
                type="checkbox"
                className="accent-blue-600 w-4 h-4"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              완료 주문 표시
            </label>
          </div>

          {/* Tabs */}
          <div className="mt-3 px-0 flex items-center gap-2">
            <button
              role="tab"
              aria-selected={activeTab === '돌다방'}
              onClick={() => setActiveTab('돌다방')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition
                ${activeTab === '돌다방'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
            >
              <Coffee className="w-4 h-4" />
              돌다방
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full
                ${activeTab === '돌다방' ? 'bg-white/20' : 'bg-blue-100 text-blue-700'}`}>
                대기 {dol.pending.length}/{dolAll.length}
              </span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === '흡연부스'}
              onClick={() => setActiveTab('흡연부스')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition
                ${activeTab === '흡연부스'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'}`}
            >
              <Cigarette className="w-4 h-4" />
              흡연부스
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full
                ${activeTab === '흡연부스' ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>
                대기 {smoke.pending.length}/{smokeAll.length}
              </span>
            </button>

            {/* 기타 주문 안내 배지 */}
            {hasEtc && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-500">
                범위를 벗어난 테이블(기타) 주문이 있습니다.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pending (active tab) */}
      <section className="mb-10 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-700">⏳ 처리 대기 · {activeTab}</h3>
          <div className="text-xs text-gray-500">{active.pending.length}건</div>
        </div>
        {active.pending.length === 0 ? (
          <div className="p-6 border rounded-xl text-center text-gray-500 bg-slate-50">대기 중인 주문 없음</div>
        ) : (
          active.pending.map(order => (
            <AdminOrderItem
              key={order.id}
              order={order}
              elapsed={elapsedTimes[order.id] || 0}
              adminName={adminName}
              onRefresh={fetchOrders}
            />
          ))
        )}
      </section>

      {/* Done (active tab) */}
      {showCompleted && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700">✅ 처리 완료 · {activeTab}</h3>
            <div className="text-xs text-gray-400">{active.done.length}건</div>
          </div>
          {active.done.length === 0 ? (
            <div className="p-6 border rounded-xl text-center text-gray-400 bg-white">완료된 주문 없음</div>
          ) : (
            active.done.map(order => (
              <AdminOrderItem
                key={order.id}
                order={order}
                elapsed={elapsedTimes[order.id] || 0}
                adminName={adminName}
                onRefresh={fetchOrders}
              />
            ))
          )}
        </section>
      )}
    </div>
  );
}
