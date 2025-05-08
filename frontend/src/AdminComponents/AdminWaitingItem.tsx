// src/AdminComponents/AdminWaitingItem.tsx
import React from 'react';

interface WaitingEntry {
  id: number;
  name: string;
  phone: string; // ✅ 전화번호 추가
  tableSize: number;
  timestamp: string;
}

interface Props {
  entry: WaitingEntry;
  isProcessed: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function AdminWaitingItem({ entry, isProcessed, onDelete, onToggle }: Props) {
  return (
    <div className={`p-4 mb-2 border rounded ${isProcessed ? 'bg-gray-100 opacity-60' : 'bg-white'} flex justify-between items-center`}>
      <div>
        <div className="font-semibold">{entry.name} ({entry.tableSize}인)</div>
        <div className="text-sm text-gray-600">☎ {entry.phone}</div> {/* ✅ 전화번호 표시 */}
        <div className="text-xs text-gray-500">등록 시각: {new Date(entry.timestamp).toLocaleTimeString()}</div>
      </div>
      <div className="flex space-x-2 items-center">
        <button
          className={`text-sm px-2 py-1 rounded ${isProcessed ? 'bg-gray-400' : 'bg-green-500 text-white'}`}
          onClick={() => onToggle(entry.id)}
        >
          {isProcessed ? '처리 완료' : '처리 대기'}
        </button>
        <button
          className="text-sm text-red-500 font-bold"
          onClick={() => onDelete(entry.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
