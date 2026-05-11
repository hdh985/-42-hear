import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import AdminWaitingItem from './AdminWaitingItem';
import { Search, RefreshCw, Loader2, Users, X } from 'lucide-react';

interface WaitingEntry { id: number; name: string; phone: string; tableSize: number; timestamp: string; }

export default function WaitingManager() {
  const [list, setList]               = useState<WaitingEntry[]>([]);
  const [query, setQuery]             = useState('');
  const [isFetching, setIsFetching]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const hasMounted     = useRef(false);
  const prevIds        = useRef<number[]>([]);
  const abortRef       = useRef<AbortController | null>(null);
  const lastVersionRef = useRef<string | null>(null);   // X-Data-Version 추적

  const fetchList = useCallback(async () => {
    // 이전 요청이 아직 진행 중이면 취소
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      setIsFetching(true);
      const res = await axios.get<WaitingEntry[]>(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/waiting`,
        { signal: abortRef.current.signal }
      );

      setLastUpdated(new Date());

      // 버전 동일 → 변경 없음, 리렌더 생략
      const v = res.headers['x-data-version'] as string | undefined;
      if (v !== undefined && v === lastVersionRef.current) return;
      lastVersionRef.current = v ?? null;

      const sorted = [...res.data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const cur = sorted.map(e => e.id);
      if (hasMounted.current && audioRef.current) {
        const prev = new Set(prevIds.current);
        if (cur.some(id => !prev.has(id))) { try { await audioRef.current.play(); } catch {} }
      }
      prevIds.current = cur;
      setList(sorted);
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
    fetchList();
    return () => { abortRef.current?.abort(); };
  }, [fetchList]);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(fetchList, 5000);
    return () => clearInterval(t);
  }, [autoRefresh, fetchList]);

  const handleRemove = async (id: number) => {
    try { await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/waiting/admin/${id}`); fetchList(); }
    catch { alert('삭제 실패'); }
  };

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return list;
    return list.filter(e =>
      (e.name || '').toLowerCase().includes(q) ||
      (e.phone || '').toLowerCase().includes(q) ||
      String(e.tableSize).includes(q)
    );
  }, [list, q]);

  const avgGroup = filtered.length ? Math.round(filtered.reduce((s, v) => s + (v.tableSize || 0), 0) / filtered.length) : 0;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { icon: <Users size={13} />, text: `대기 ${filtered.length}건`, color: '#3182F6', bg: '#EBF3FE' },
            { icon: null, text: `평균 ${avgGroup}명`, color: '#6B7684', bg: '#F2F4F6' },
          ].map(({ icon, text, color, bg }) => (
            <div key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '100px', background: bg, fontSize: '13px', fontWeight: 700, color }}>
              {icon}{text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lastUpdated && <span style={{ fontSize: '11px', color: '#B0B8C1' }}>{lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>}
          <button onClick={fetchList} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '100px', border: 'none', background: '#3182F6', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            {isFetching ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={13} />} 새로고침
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ position: 'sticky', top: '56px', zIndex: 10, background: 'rgba(242,244,246,0.95)', backdropFilter: 'blur(12px)', paddingBottom: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#B0B8C1' }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="이름/전화/인원 검색" style={{
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
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} style={{ accentColor: '#3182F6', width: '15px', height: '15px' }} />
            자동 갱신
          </label>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '16px', color: '#B0B8C1', fontSize: '14px', border: '1px solid #E5E8EB' }}>
          대기자가 없습니다
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(entry => (
            <AdminWaitingItem key={entry.id} entry={entry} isProcessed={false} onDelete={handleRemove} onToggle={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
