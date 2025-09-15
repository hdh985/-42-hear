// src/AdminComponents/AdminWaitingItem.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Users, Phone, Copy, PhoneCall, Clock, CheckCircle2, Undo2, Trash2 } from 'lucide-react';

interface WaitingEntry {
  id: number;
  name: string;
  phone: string; // 전화번호
  tableSize: number;
  timestamp: string; // ISO 또는 ISO 유사 문자열
}

interface Props {
  entry: WaitingEntry;
  isProcessed: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

// 한국 전화번호 하이픈 포맷 (간단 버전)
const formatPhone = (raw: string) => {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return raw || '';
  if (digits.startsWith('02')) {
    // 서울 지역번호
    if (digits.length === 9) return digits.replace(/(02)(\d{3})(\d{4})/, '$1-$2-$3');
    return digits.replace(/(02)(\d{4})(\d{4})/, '$1-$2-$3');
  }
  // 010/011/070 등
  if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  return raw; // 그 외는 원문 반환
};

// 상대시간 라벨 생성
const relativeTime = (from: Date, now: number) => {
  const diff = Math.max(0, now - from.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 등록';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  const remain = mins % 60;
  return remain ? `${hours}시간 ${remain}분 전` : `${hours}시간 전`;
};

export default function AdminWaitingItem({ entry, isProcessed, onDelete, onToggle }: Props) {
  // 타임스탬프 파싱 (Z 없으면 보정)
  const createdAt = useMemo(() => {
    const iso = entry.timestamp?.endsWith('Z') ? entry.timestamp : `${entry.timestamp}Z`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? new Date(entry.timestamp) : d;
  }, [entry.timestamp]);

  // 30초마다 상대시간 업데이트 (부담 낮춤)
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const timeLabel = useMemo(() => relativeTime(createdAt, now), [createdAt, now]);

  const handleDelete = () => {
    const ok = window.confirm('이 대기 항목을 삭제할까요? 되돌릴 수 없습니다.');
    if (ok) onDelete(entry.id);
  };

  return (
    <div
      className={`p-4 sm:p-5 mb-3 border rounded-2xl ring-1 transition shadow-sm ${
        isProcessed ? 'bg-gray-50 ring-gray-200 opacity-90' : 'bg-white ring-blue-100 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-base sm:text-lg truncate">{entry.name}</h4>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${
              isProcessed ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isProcessed ? '처리됨' : '대기'}
            </span>
          </div>

          <div className="mt-1 flex items-center text-sm text-gray-700 gap-2">
            <Users className="w-4 h-4" />
            <span>{entry.tableSize}인</span>
          </div>

          {/* Phone row */}
          {entry.phone && (
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4" />
              <span className="font-medium">{formatPhone(entry.phone)}</span>
              <button
                className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1"
                onClick={() => navigator.clipboard.writeText(entry.phone)}
                aria-label="전화번호 복사"
              >
                <Copy className="w-3.5 h-3.5" /> 복사
              </button>
              <a
                className="text-xs px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 inline-flex items-center gap-1"
                href={`tel:${entry.phone}`}
              >
                <PhoneCall className="w-3.5 h-3.5" /> 전화걸기
              </a>
            </div>
          )}

          {/* Time */}
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>등록 시각: {createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-gray-300">•</span>
            <span>{timeLabel}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <button
            onClick={() => onToggle(entry.id)}
            className={`text-sm px-3 py-2 rounded-lg inline-flex items-center gap-1.5 shadow ${
              isProcessed ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            aria-label={isProcessed ? '대기 상태로 되돌리기' : '처리 완료 표시'}
          >
            {isProcessed ? <Undo2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} 
            {isProcessed ? '대기로' : '처리 완료'}
          </button>

          <button
            onClick={handleDelete}
            className="text-sm px-3 py-2 rounded-lg inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            aria-label="항목 삭제"
          >
            <Trash2 className="w-4 h-4" /> 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
