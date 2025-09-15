// src/AdminComponents/WaitingManager.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import AdminWaitingItem from './AdminWaitingItem';
import { Search, RefreshCw, Loader2, Users, Bell, X } from 'lucide-react';



interface WaitingEntry {
  id: number;
  name: string;
  phone: string;
  tableSize: number;
  timestamp: string;
}

export default function WaitingManager() {
  // ===== State =====
  const [waitingList, setWaitingList] = useState<WaitingEntry[]>([]);
  const [query, setQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ===== Refs =====
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasMountedRef = useRef(false);
  const prevIdsRef = useRef<number[]>([]);

  // ===== Fetch =====
  const fetchList = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await axios.get<WaitingEntry[]>(`${process.env.REACT_APP_API_BASE_URL}/api/admin/waiting`);

      // 오래 기다린 순으로 보여주기: 오래된 → 최신 (timestamp asc)
      const sorted = [...res.data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // 알림음: 신규 항목 감지 (초기 로드 제외)
      const currentIds = sorted.map(e => e.id);
      if (hasMountedRef.current && audioRef.current) {
        const prev = new Set(prevIdsRef.current);
        const hasNew = currentIds.some(id => !prev.has(id));
        if (hasNew) {
          try { await audioRef.current.play(); } catch {}
        }
      }
      prevIdsRef.current = currentIds;

      setWaitingList(sorted);
      setLastUpdated(new Date());
      hasMountedRef.current = true;
    } catch (e) {
      console.error('목록 불러오기 실패', e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // ===== Mount =====
  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3');
    fetchList();
  }, [fetchList]);

  // ===== Polling =====
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchList, 5000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchList]);

  // ===== Actions =====
  const handleRemove = async (id: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/waiting/admin/${id}`);
      fetchList();
    } catch (e) {
      alert('삭제 실패');
      console.error(e);
    }
  };

  // 완료(호출 처리 등) → 현재 백엔드는 별도 상태가 없으므로 삭제로 대체
  const handleComplete = (id: number) => handleRemove(id);

  // ===== Derived =====
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) return waitingList;
    return waitingList.filter(e => {
      const name = (e.name || '').toLowerCase();
      const phone = (e.phone || '').toLowerCase();
      const table = String(e.tableSize);
      return name.includes(normalized) || phone.includes(normalized) || table.includes(normalized);
    });
  }, [waitingList, normalized]);

  // 통계
  const totalCount = filtered.length;
  const avgGroup = filtered.length ? Math.round(filtered.reduce((s, v) => s + (v.tableSize || 0), 0) / filtered.length) : 0;

  // ===== UI =====
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">⏳ 웨이팅 명단 (관리자)</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ring-1 ring-blue-200 bg-blue-50 text-blue-700">
              <Users className="w-4 h-4" /> 대기 {totalCount}건
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ring-1 ring-slate-200 bg-slate-50 text-slate-700">
              평균 인원 {avgGroup}명
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchList}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
          >
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 새로고침
          </button>
          <div className="text-xs text-gray-500 min-w-[9rem] text-right">
            {lastUpdated ? `업데이트: ${lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : '업데이트 대기'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-y py-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름/전화/인원 검색"
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

          {/* Auto refresh toggle */}
          <label className="inline-flex items-center gap-2 text-sm select-none">
            <input
              type="checkbox"
              className="accent-blue-600 w-4 h-4"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            자동 새로고침
          </label>

          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <Bell className="w-4 h-4" /> 신규 대기자 등록 시 알림음
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-6 border rounded-xl text-center text-gray-500 bg-slate-50">대기자가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <AdminWaitingItem
              key={entry.id}
              entry={entry}
              isProcessed={false}
              onDelete={handleRemove}
              onToggle={handleComplete} // 완료 처리 = 삭제로 대체
            />
          ))}
        </div>
      )}
    </div>
  );
}
