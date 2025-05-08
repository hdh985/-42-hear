// src/AdminComponents/AdminOrderItem.tsx
import React from 'react';

interface Order {
  id: number; // ✅ 주문 ID 추가
  table: string;
  name: string;
  items: string[];
  total: number;
  song: string;
  image_path: string;
  timestamp: string;
}

interface Props {
  order: Order;
  isProcessed: boolean;
  elapsed: number;
  onToggle: (id: number) => void;
  onPreview: (url: string) => void;
}

export default function AdminOrderItem({ order, isProcessed, elapsed, onToggle, onPreview }: Props) {
  const renderTimer = (elapsed: number) => {
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    let color = 'text-green-600';
    if (elapsed >= 900) color = 'text-red-600 font-bold';
    else if (elapsed >= 600) color = 'text-yellow-500 font-semibold';
    return <span className={`text-lg px-2 py-1 rounded border ${color}`}>⏱ {timeStr}</span>;
  };

  return (
    <div className={`p-4 mb-4 border rounded ${isProcessed ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-2">
        <strong>테이블 {order.table} - {order.name}</strong>
        <div className="flex space-x-2 items-center">
          {!isProcessed && renderTimer(elapsed)}
          <button
            className={`px-2 py-1 rounded text-sm ${isProcessed ? 'bg-gray-400' : 'bg-green-500 text-white'}`}
            onClick={() => onToggle(order.id)} // ✅ ID 기반 토글
          >
            {isProcessed ? '처리 완료' : '처리 대기'}
          </button>
        </div>
      </div>
      <ul className="list-disc list-inside text-sm mb-2">
        {order.items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
      <div className="text-sm mb-1">총 금액: {order.total.toLocaleString()}원</div>
      <div className="text-sm mb-1">신청곡: {order.song || '-'}</div>
      <div className="text-xs text-gray-500">주문 시각: {new Date(order.timestamp).toLocaleTimeString()}</div>
      {order.image_path && (
        <img
          src={`http://localhost:8000/${order.image_path}`}
          alt="증빙"
          className="w-full max-h-48 object-contain border rounded cursor-pointer mt-2"
          onClick={() => onPreview(`http://localhost:8000/${order.image_path}`)}
        />
      )}
    </div>
  );
}
