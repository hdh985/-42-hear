import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

interface WaitingEntry {
  id: number;
  name: string;
  phone: string;
  tableSize: number;
  timestamp: string;
}

export default function WaitingList() {
  const [list, setList] = useState<WaitingEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WaitingEntry | null>(null);
  const [inputPhone, setInputPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchList = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await axios.get<WaitingEntry[]>(`${process.env.REACT_APP_API_BASE_URL}/api/waiting`);
      setList(res.data);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error(e);
      setError('목록을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeHM = (ts: string | Date) => {
    const d = ts instanceof Date ? ts : new Date(ts);
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const minutesElapsed = (ts: string) => {
    const diffMs = Date.now() - new Date(ts).getTime();
    const m = Math.max(0, Math.floor(diffMs / 60000));
    return m;
  };

  const formatPhoneTail = (phone: string) => phone.slice(-4);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (raw.length <= 3) formatted = raw;
    else if (raw.length <= 7) formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    else if (raw.length <= 11) formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
    else formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    setInputPhone(formatted);
  };

  const maskName = (name: string) => {
    if (name.length <= 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const confirmDelete = async () => {
    if (!selectedEntry) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/waiting/${selectedEntry.id}`, {
        data: { phone: inputPhone.replace(/\D/g, '') },
        headers: { 'Content-Type': 'application/json' },
      });
      alert('삭제되었습니다.');
      setSelectedEntry(null);
      setInputPhone('');
      fetchList();
    } catch (e: any) {
      if (e.response?.status === 403) alert('전화번호가 일치하지 않습니다.');
      else {
        alert('삭제 실패');
        console.error(e);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPeople = useMemo(() => list.reduce((acc, cur) => acc + (cur.tableSize || 0), 0), [list]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2f1a16] via-[#3a1f1b] to-[#2f1a16] px-4 py-8">
      <div className="max-w-2xl mx-auto overflow-hidden rounded-2xl border-[3px] border-[#76231c] shadow-2xl bg-amber-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5a1a16] via-[#76231c] to-[#5a1a16] px-4 py-6 text-center text-white border-b-4 border-yellow-600">
          <div className="text-[10px] tracking-widest text-yellow-200 uppercase">제42대 외국어대학 학생회 hear</div>
          <h2 className="text-3xl font-extrabold tracking-[0.25em]">HERAT SHOT</h2>
          <p className="mt-1 text-xs text-yellow-200">🕒 현재 대기 명단</p>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-yellow-100/70 border-b border-yellow-300">
          <div className="text-[#76231c] text-sm font-bold tracking-wide">
            대기 <span className="px-2 py-0.5 rounded-lg bg-[#76231c] text-white">{list.length}</span> 팀 · 총 {totalPeople}명
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            {lastUpdated && <span className="hidden sm:inline">업데이트: {formatTimeHM(lastUpdated)}</span>}
            <button
              onClick={fetchList}
              className="px-3 py-1.5 rounded-lg border-2 border-[#76231c] text-[#76231c] font-bold tracking-wider hover:bg-[#76231c]/5 active:scale-95 transition"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading ? (
            <ul className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="animate-pulse bg-white/80 rounded-xl border border-[#76231c]/20 p-4">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="mt-3 h-3 w-1/2 bg-gray-200 rounded" />
                </li>
              ))}
            </ul>
          ) : list.length === 0 ? (
            <div className="text-center py-16 bg-white/70 rounded-xl border border-[#76231c]/20">
              <div className="text-4xl mb-2">🤠</div>
              <p className="text-gray-700 font-semibold">현재 대기자가 없습니다.</p>
              <p className="text-sm text-gray-500 mt-1"></p>
            </div>
          ) : (
            <ul className="space-y-3">
              {list.map((entry, idx) => (
                <li
                  key={entry.id}
                  className="bg-white rounded-xl border-[1.5px] border-[#76231c]/40 shadow-sm p-4 relative transition hover:border-[#76231c] hover:shadow-md"
                >
                  {/* Queue badge */}
                  <div className="absolute -left-2 -top-2 select-none">
                    <span className="inline-block px-2 py-1 text-xs font-extrabold tracking-widest bg-[#76231c] text-yellow-200 rounded-md shadow">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-lg text-gray-900">
                        {maskName(entry.name)} 님{' '}
                        <span className="text-sm text-gray-500">({formatPhoneTail(entry.phone)})</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {entry.tableSize}인 테이블 · 등록 {formatTimeHM(entry.timestamp)} · 경과 {minutesElapsed(entry.timestamp)}분
                      </div>
                    </div>

                    <div className="text-right min-w-[96px]">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="text-sm font-bold text-white bg-[#76231c] hover:bg-[#5a1a16] px-3 py-1.5 rounded-lg tracking-wider shadow"
                      >
                        나가기
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer ribbon */}
        <div className="bg-[#76231c] text-yellow-200 text-center text-[11px] py-2 tracking-widest uppercase">
          ★ 순서가 다가올 시 부스 근처에 있어주시면 감사하겠습니다. ★
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
          <div className="bg-amber-50 p-6 rounded-2xl shadow-2xl w-full max-w-sm border-[3px] border-[#76231c]">
            <h3 className="text-base font-extrabold tracking-widest text-[#76231c] mb-3 uppercase">🔐 전화번호 확인</h3>
            <p className="text-sm mb-3 text-gray-800">
              <strong>{selectedEntry.name}</strong> 님의 대기 정보를 삭제하시려면 전체 전화번호를 입력하세요.
            </p>
            <input
              type="tel"
              value={inputPhone}
              onChange={handlePhoneChange}
              className="w-full border-[1.5px] border-[#76231c]/40 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76231c]/30 focus:border-[#76231c] placeholder-gray-400"
              placeholder="전화번호 (예: 010-1234-5678)"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedEntry(null);
                  setInputPhone('');
                }}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting || inputPhone.replace(/\D/g, '').length < 10}
                className="px-4 py-2 rounded-lg bg-[#76231c] text-white font-bold tracking-wider hover:bg-[#5a1a16] disabled:opacity-60 disabled:cursor-not-allowed shadow"
              >
                {isDeleting ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
