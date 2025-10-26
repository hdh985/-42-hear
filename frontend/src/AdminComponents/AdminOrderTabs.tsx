// AdminOrderTabs.tsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import AdminOrderItem from './AdminOrderItem';
import { Coffee, Cigarette, Users } from 'lucide-react';

// === AdminOrderItem에서 쓰는 타입과 동일하게 맞춰줍니다 ===
interface OrderItem {
  name: string;
  served_by?: string;
}

interface Order {
  id: number;
  table: string;
  name: string;
  items: OrderItem[] | string;
  total: number;
  song: string;
  image_path: string;
  timestamp: string;       // ISO 혹은 ISO 유사 문자열
  processed: boolean;
  table_size: number;
}

interface AdminOrderTabsProps {
  orders: Order[];
  adminName: string;
  onRefresh: () => void | Promise<void>;  // Promise도 허용
  /** 기본 탭 (기본값: '돌다방') */
  defaultTab?: '돌다방' | '흡연부스';
}

function getZone(tableStr: string): '돌다방' | '흡연부스' | '기타' {
  const t = Number(tableStr);
  if (!Number.isFinite(t)) return '기타';
  if (t >= 1 && t <= 50) return '돌다방';
  if (t >= 51 && t <= 100) return '흡연부스';
  return '기타';
}

function safeParseTime(ts: string): number {
  // 'Z'나 타임존이 없으면 UTC로 가정해 'Z'를 붙여 파싱
  const iso = ts.endsWith('Z') || ts.includes('+') ? ts : `${ts}Z`;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : Date.now();
}

function byPriorityAndTime(a: Order, b: Order) {
  // 미처리 먼저, 그 다음 오래된 주문이 위로
  if (a.processed !== b.processed) return a.processed ? 1 : -1;
  return safeParseTime(a.timestamp) - safeParseTime(b.timestamp);
}

export default function AdminOrderTabs({
  orders,
  adminName,
  onRefresh,
  defaultTab = '돌다방',
}: AdminOrderTabsProps) {
  const [active, setActive] = useState<'돌다방' | '흡연부스'>(defaultTab);

  // 1초마다 now 갱신 → 경과시간 실시간 업데이트
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // AdminOrderItem에 넘길 onRefresh: 반환값 무시하여 () => void 시그니처 보장
  const onRefreshVoid = useCallback(() => { void onRefresh(); }, [onRefresh]);

  const { dol, smoke, hasEtc } = useMemo(() => {
    const dol = orders.filter((o) => getZone(o.table) === '돌다방').sort(byPriorityAndTime);
    const smoke = orders.filter((o) => getZone(o.table) === '흡연부스').sort(byPriorityAndTime);
    const hasEtc = orders.some((o) => getZone(o.table) === '기타');
    return { dol, smoke, hasEtc };
  }, [orders]);

  const counts = useMemo(() => {
    const pending = (arr: Order[]) => arr.filter((o) => !o.processed).length;
    return {
      dol: { total: dol.length, pending: pending(dol) },
      smoke: { total: smoke.length, pending: pending(smoke) },
    };
  }, [dol, smoke]);

  const list = active === '돌다방' ? dol : smoke;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2">
          <button
            role="tab"
            aria-selected={active === '돌다방'}
            onClick={() => setActive('돌다방')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition
              ${active === '돌다방'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
          >
            <Coffee className="w-4 h-4" />
            돌다방
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full
              ${active === '돌다방' ? 'bg-white/20' : 'bg-blue-100 text-blue-700'}`}>
              대기 {counts.dol.pending}/{counts.dol.total}
            </span>
          </button>

          <button
            role="tab"
            aria-selected={active === '흡연부스'}
            onClick={() => setActive('흡연부스')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition
              ${active === '흡연부스'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'}`}
          >
            <Cigarette className="w-4 h-4" />
            흡연부스
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full
              ${active === '흡연부스' ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>
              대기 {counts.smoke.pending}/{counts.smoke.total}
            </span>
          </button>

          {/* 기타 주문 안내 (탭 분리 X, 안내만) */}
          {hasEtc && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5" />
              범위를 벗어난 테이블(기타) 주문이 있어요.
            </span>
          )}
        </div>
      </div>

      {/* Tab panel */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
        {list.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500 border rounded-2xl bg-slate-50">
            현재 {active}에 표시할 주문이 없습니다.
          </div>
        ) : (
          list.map((o) => {
            const elapsed = Math.max(0, Math.floor((now - safeParseTime(o.timestamp)) / 1000));
            return (
              <AdminOrderItem
                key={o.id}
                order={o}
                elapsed={elapsed}
                adminName={adminName}
                onRefresh={onRefreshVoid}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
