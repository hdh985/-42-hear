import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Timer, CheckCircle2, Undo2, Users, Music, Receipt, UserCheck, Image as ImageIcon } from 'lucide-react';

interface OrderItem {
  name: string;
  served_by?: string;
}

interface Order {
  id: number;
  table: string;
  name: string;
  items: OrderItem[] | string; // 문자열일 수도 있음
  total: number;
  song: string;
  image_path: string;
  timestamp: string;
  processed: boolean;
  table_size: number;
}

interface Props {
  order: Order;
  elapsed: number;
  adminName: string;
  onRefresh: () => void;
}

export default function AdminOrderItem({ order, elapsed, adminName, onRefresh }: Props) {
  // ========= Helpers =========
  const getZone = (table: number) => {
    if (table >= 1 && table <= 50) return '돌다방';
    if (table >= 51 && table <= 100) return '흡연부스';
    return '기타';
  };

  const zoneMeta = useMemo(() => {
    const zone = getZone(Number(order.table));
    const color = zone === '돌다방' ? 'blue' : zone === '흡연부스' ? 'amber' : 'slate';
    const ring = color === 'blue' ? 'ring-blue-200' : color === 'amber' ? 'ring-amber-200' : 'ring-slate-200';
    const pill = color === 'blue' ? 'bg-blue-100 text-blue-700' : color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700';
    const faint = color === 'blue' ? 'bg-blue-50' : color === 'amber' ? 'bg-amber-50' : 'bg-slate-50';
    return { zone, ring, pill, faint };
  }, [order.table]);

  const renderTimer = (elapsedSec: number) => {
    const minutes = Math.floor(elapsedSec / 60);
    const seconds = elapsedSec % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    let color = 'text-green-700 border-green-200';
    if (elapsedSec >= 900) color = 'text-red-700 border-red-200 font-bold';
    else if (elapsedSec >= 600) color = 'text-amber-700 border-amber-200 font-semibold';
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${color} bg-white`}
        aria-label={`경과 시간 ${timeStr}`}
      >
        <Timer className="w-3.5 h-3.5" /> {timeStr}
      </span>
    );
  };

  // 문자열일 경우 JSON.parse() 처리 (내결함성 강화)
  let parsedItems: OrderItem[] = [];
  try {
    parsedItems = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : order.items;
    if (!Array.isArray(parsedItems)) parsedItems = [];
  } catch {
    parsedItems = [];
  }

  const allItemsServed = parsedItems.length > 0 && parsedItems.every((item) => item.served_by);

  // ========= Local UI state =========
  const [loadingItemIndex, setLoadingItemIndex] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [showProof, setShowProof] = useState(false);

  // ========= Actions =========
  const handleItemToggle = async (itemIndex: number, currentServedBy?: string) => {
    try {
      setLoadingItemIndex(itemIndex);
      const formData = new FormData();
      formData.append('item_index', String(itemIndex));
      formData.append('admin', currentServedBy ? '' : adminName);
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/${order.id}/serve-item`,
        formData
      );
      onRefresh();
    } catch (e) {
      console.error('항목 처리 실패', e);
    } finally {
      setLoadingItemIndex(null);
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${order.id}/complete`);
      onRefresh();
    } catch (e) {
      console.error('전체 처리 실패', e);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsTogglingStatus(true);
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${order.id}/toggle`);
      onRefresh();
    } catch (e) {
      console.error('상태 전환 실패', e);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // ========= Render =========
  return (
    <div
      className={`p-5 mb-6 border rounded-2xl shadow-sm ring-1 ${zoneMeta.ring} ${
        order.processed ? 'bg-gray-50 opacity-90' : 'bg-white hover:shadow-md'
      } transition-shadow`}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[11px] rounded-full ${zoneMeta.pill}`}>{zoneMeta.zone}</span>
            <span className="text-[11px] text-gray-400">#{order.id}</span>
          </div>
          <h4 className="mt-1 text-base sm:text-lg font-semibold text-blue-700 flex items-center gap-2">
            테이블 {order.table}
            <span className="text-gray-300">•</span>
            {order.name}
            <span className="ml-1 inline-flex items-center text-xs text-gray-500">
              <Users className="w-3.5 h-3.5 mr-1" /> {order.table_size}명
            </span>
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!order.processed && renderTimer(elapsed)}
          <span
            className={`px-2 py-1 rounded-full text-[11px] ${
              order.processed ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {order.processed ? '처리됨' : '대기'}
          </span>
          <button
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
            className="text-xs px-2.5 py-1.5 rounded-md bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-60"
          >
            {order.processed ? '↩ 처리 대기로' : '✅ 처리 완료로'}
          </button>
        </div>
      </div>

      {/* Items */}
      <ul className="mb-4 border rounded-xl divide-y divide-gray-100">
        {parsedItems.length === 0 && (
          <li className="p-3 text-sm text-gray-500">메뉴 항목이 없습니다.</li>
        )}
        {parsedItems.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center p-2.5">
            <div className="min-w-0">
              <span className="text-sm">• {item.name}</span>
              {item.served_by && (
                <span className="ml-2 inline-flex items-center text-xs text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5 mr-1" /> {item.served_by} 처리
                </span>
              )}
            </div>
            {!order.processed && (
              <button
                onClick={() => handleItemToggle(idx, item.served_by)}
                disabled={loadingItemIndex === idx}
                className={`text-xs px-2.5 py-1.5 rounded-md text-white transition disabled:opacity-60 ${
                  item.served_by ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                aria-label={item.served_by ? '되돌리기' : '처리'}
              >
                <span className="inline-flex items-center gap-1">
                  {item.served_by ? (
                    <>
                      <Undo2 className="w-3.5 h-3.5" /> 되돌리기
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 처리
                    </>
                  )}
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-2">
        <div className={`flex items-center gap-2 rounded-lg p-2 ${zoneMeta.faint}`}>
          <Receipt className="w-4 h-4" />
          총 금액: <span className="font-semibold">{order.total.toLocaleString('ko-KR')}원</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg p-2 bg-gray-50 min-w-0">
          <Music className="w-4 h-4" />
          <span className="truncate" title={order.song || ''}>요청곡: {order.song || '-'}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg p-2 bg-gray-50">
          <Timer className="w-4 h-4" />
          주문 시각: {new Date(order.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Proof (image) */}
      {order.image_path && (
        <div className="mt-2">
          <button
            onClick={() => setShowProof((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <ImageIcon className="w-3.5 h-3.5" /> {showProof ? '증빙 숨기기' : '증빙 보기'}
          </button>
          {showProof && (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${order.image_path.replace(/^uploads\//, '')}?v=2`}
              crossOrigin="anonymous"
              alt="증빙"
              className="mt-3 w-full max-h-64 object-contain rounded-lg border"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
        </div>
      )}

      {/* CTA */}
      {!order.processed && allItemsServed && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-lg transition disabled:opacity-60"
          >
            {isCompleting ? '처리 중…' : '전체 처리'}
          </button>
        </div>
      )}
    </div>
  );
}
