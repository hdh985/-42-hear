import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

interface WaitingEntry {
  id: number;
  name: string;
  phone: string;
  tableSize: number;
  timestamp: string;
}

export default function WaitingList() {
  const [list, setList]               = useState<WaitingEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WaitingEntry | null>(null);
  const [inputPhone, setInputPhone]   = useState('');
  const [isLoading, setIsLoading]     = useState(true);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [spinning, setSpinning]       = useState(false);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await axios.get<WaitingEntry[]>(`${process.env.REACT_APP_API_BASE_URL}/api/waiting`);
      setList(res.data);
      setLastUpdated(new Date());
    } catch {
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

  const handleRefresh = () => {
    setSpinning(true);
    fetchList().finally(() => setTimeout(() => setSpinning(false), 600));
  };

  const formatTimeHM = (ts: string | Date) => {
    const d = ts instanceof Date ? ts : new Date(ts);
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const minutesElapsed = (ts: string) => Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));

  const maskName = (name: string) => {
    if (name.length <= 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let f = raw;
    if (raw.length >= 4 && raw.length <= 7) f = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    else if (raw.length >= 8)               f = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    setInputPhone(f);
  };

  const confirmDelete = async () => {
    if (!selectedEntry) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/waiting/${selectedEntry.id}`, {
        data: { phone: inputPhone.replace(/\D/g, '') },
        headers: { 'Content-Type': 'application/json' },
      });
      setSelectedEntry(null);
      setInputPhone('');
      fetchList();
    } catch (e: any) {
      if (e.response?.status === 403) alert('전화번호가 일치하지 않습니다.');
      else alert('삭제 실패. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPeople = useMemo(() => list.reduce((acc, cur) => acc + (cur.tableSize || 0), 0), [list]);

  return (
    <div style={{ background: '#F2F4F6', minHeight: '100dvh', maxWidth: '480px', margin: '0 auto' }}>

      {/* 헤더 */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E8EB',
        padding: '0 20px',
        height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/yunsul.jpg" alt="윤슬" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#B0B8C1', fontWeight: 500, lineHeight: 1.2 }}>제28대 한국어학과 학생회</p>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em', lineHeight: 1.2 }}>대기 명단</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/wait')}
          style={{
            padding: '8px 14px', borderRadius: '100px', border: 'none',
            background: '#3182F6', color: '#FFFFFF',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          대기 등록
        </button>
      </header>

      <main style={{ padding: '16px 16px calc(40px + env(safe-area-inset-bottom, 0px))' }}>

        {/* 통계 카드 */}
        <div style={{
          background: '#FFFFFF', borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '16px 20px', marginBottom: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#B0B8C1', letterSpacing: '-0.01em' }}>현재 대기</p>
            <p style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em' }}>
              <span style={{ color: '#3182F6' }}>{list.length}</span>팀
              <span style={{ fontSize: '16px', color: '#6B7684', marginLeft: '8px', fontWeight: 700 }}>{totalPeople}명</span>
            </p>
            {lastUpdated && (
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#B0B8C1' }}>
                {formatTimeHM(lastUpdated)} 기준
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            style={{
              width: '40px', height: '40px',
              borderRadius: '100px', border: 'none',
              background: '#F2F4F6', color: '#6B7684',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)',
              transition: 'transform 0.6s ease',
            }}
            aria-label="새로고침"
          >
            <RefreshCw size={16} strokeWidth={2} />
          </button>
        </div>

        {/* 오류 */}
        {error && (
          <div style={{
            background: '#FEF0F2', borderRadius: '12px',
            padding: '12px 16px', marginBottom: '12px',
            fontSize: '13px', color: '#F04452', letterSpacing: '-0.01em',
          }}>
            {error}
          </div>
        )}

        {/* 목록 */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                background: '#FFFFFF', borderRadius: '16px',
                padding: '20px', height: '80px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                opacity: 1 - i * 0.15,
              }} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div style={{
            background: '#FFFFFF', borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            padding: '56px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>현재 대기자가 없습니다</p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#B0B8C1', letterSpacing: '-0.01em' }}>지금 바로 입장 가능해요</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {list.map((entry, idx) => (
              <div
                key={entry.id}
                style={{
                  background: '#FFFFFF', borderRadius: '16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}
              >
                {/* 순서 뱃지 */}
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  borderRadius: '12px',
                  background: idx === 0 ? '#3182F6' : '#F2F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: 800,
                  color: idx === 0 ? '#FFFFFF' : '#6B7684',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {idx + 1}
                </div>

                {/* 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.02em' }}>
                      {maskName(entry.name)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#B0B8C1' }}>
                      {entry.phone.slice(-4)}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6B7684', letterSpacing: '-0.01em' }}>
                    {entry.tableSize}명 · {formatTimeHM(entry.timestamp)} 등록 · {minutesElapsed(entry.timestamp)}분 경과
                  </p>
                </div>

                {/* 나가기 버튼 */}
                <button
                  onClick={() => setSelectedEntry(entry)}
                  style={{
                    padding: '7px 14px', flexShrink: 0,
                    borderRadius: '100px', border: 'none',
                    background: '#FEF0F2', color: '#F04452',
                    fontSize: '12px', fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '-0.01em',
                  }}
                >
                  나가기
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 안내 문구 */}
        {list.length > 0 && (
          <p style={{
            textAlign: 'center', marginTop: '20px',
            fontSize: '12px', color: '#B0B8C1', letterSpacing: '-0.01em', lineHeight: 1.6,
          }}>
            순서가 다가오면 문자로 알려드려요.<br />부스 근처에 계셔주세요.
          </p>
        )}
      </main>

      {/* 삭제 확인 바텀시트 */}
      {selectedEntry && (
        <>
          <div
            aria-hidden
            onClick={() => { setSelectedEntry(null); setInputPhone(''); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />
          <div
            style={{
              position: 'fixed', insetInline: 0, bottom: 0, zIndex: 210,
              margin: '0 auto', maxWidth: '480px',
              background: '#FFFFFF',
              borderRadius: '20px 20px 0 0',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.15)',
              padding: '16px 20px calc(24px + env(safe-area-inset-bottom, 0px))',
              animation: 'slide-up-sheet 0.3s cubic-bezier(.32,.72,0,1) both',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '100px', background: '#E5E8EB' }} />
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em' }}>
              대기 취소
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6B7684', letterSpacing: '-0.01em' }}>
              <strong style={{ color: '#191F28' }}>{selectedEntry.name}</strong> 님의 전화번호를 입력하면 대기가 취소됩니다.
            </p>

            <input
              type="text"
              inputMode="tel"
              value={inputPhone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              style={{
                width: '100%', padding: '13px 16px',
                borderRadius: '12px', border: '1.5px solid #E5E8EB',
                background: '#FAFAFA', fontSize: '15px', color: '#191F28',
                outline: 'none', letterSpacing: '-0.01em',
                boxSizing: 'border-box', marginBottom: '16px',
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setSelectedEntry(null); setInputPhone(''); }}
                style={{
                  flex: 1, padding: '14px',
                  borderRadius: '14px', border: '1.5px solid #E5E8EB',
                  background: '#FFFFFF', color: '#6B7684',
                  fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                  letterSpacing: '-0.02em',
                }}
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting || inputPhone.replace(/\D/g, '').length < 10}
                style={{
                  flex: 1, padding: '14px',
                  borderRadius: '14px', border: 'none',
                  background: inputPhone.replace(/\D/g, '').length >= 10 ? '#F04452' : '#E5E8EB',
                  color: inputPhone.replace(/\D/g, '').length >= 10 ? '#FFFFFF' : '#B0B8C1',
                  fontSize: '15px', fontWeight: 700,
                  cursor: inputPhone.replace(/\D/g, '').length >= 10 ? 'pointer' : 'not-allowed',
                  letterSpacing: '-0.02em',
                  transition: 'all 0.15s ease',
                }}
              >
                {isDeleting ? '취소 중…' : '대기 취소'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
