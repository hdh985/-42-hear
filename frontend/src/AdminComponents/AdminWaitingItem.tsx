import { useEffect, useMemo, useState } from 'react';
import { Users, Phone, Copy, PhoneCall, Clock, CheckCircle2, Trash2 } from 'lucide-react';

interface WaitingEntry { id: number; name: string; phone: string; tableSize: number; timestamp: string; }
interface Props { entry: WaitingEntry; isProcessed: boolean; onDelete: (id: number) => void; onToggle: (id: number) => void; }

const formatPhone = (raw: string) => {
  const d = (raw || '').replace(/\D/g, '');
  if (!d) return raw || '';
  if (d.startsWith('02')) return d.length === 9 ? d.replace(/(02)(\d{3})(\d{4})/, '$1-$2-$3') : d.replace(/(02)(\d{4})(\d{4})/, '$1-$2-$3');
  if (d.length === 10) return d.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  return raw;
};

const relTime = (from: Date, now: number) => {
  const mins = Math.floor(Math.max(0, now - from.getTime()) / 60000);
  if (mins < 1) return '방금';
  if (mins < 60) return `${mins}분 전`;
  const h = Math.floor(mins / 60), r = mins % 60;
  return r ? `${h}시간 ${r}분 전` : `${h}시간 전`;
};

export default function AdminWaitingItem({ entry, isProcessed, onDelete, onToggle }: Props) {
  const createdAt = useMemo(() => {
    const iso = entry.timestamp?.endsWith('Z') ? entry.timestamp : `${entry.timestamp}Z`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? new Date(entry.timestamp) : d;
  }, [entry.timestamp]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  const timeLabel = useMemo(() => relTime(createdAt, now), [createdAt, now]);

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(entry.phone);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid #E5E8EB',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px',
      opacity: isProcessed ? 0.7 : 1,
    }}>
      {/* Info */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em' }}>{entry.name}</h4>
          <span style={{
            fontSize: '11px', fontWeight: 700, borderRadius: '100px', padding: '3px 10px',
            background: isProcessed ? '#F2F4F6' : '#E8FBF3',
            color: isProcessed ? '#6B7684' : '#00C073',
          }}>{isProcessed ? '처리됨' : '대기'}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#6B7684' }}>
            <Users size={13} /> {entry.tableSize}인
          </span>

          {entry.phone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#191F28' }}>
              <Phone size={13} style={{ color: '#6B7684' }} />
              {formatPhone(entry.phone)}
              <button onClick={handleCopy} style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                fontSize: '11px', padding: '3px 10px', borderRadius: '100px', border: 'none',
                background: copied ? '#E8FBF3' : '#EBF3FE',
                color: copied ? '#00C073' : '#3182F6',
                cursor: 'pointer', fontWeight: 700, transition: 'all 0.15s ease',
              }}>
                <Copy size={10} /> {copied ? '복사됨' : '복사'}
              </button>
              <a href={`tel:${entry.phone}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                fontSize: '11px', padding: '3px 10px', borderRadius: '100px',
                background: '#3182F6', color: '#fff', textDecoration: 'none', fontWeight: 700,
              }}>
                <PhoneCall size={10} /> 전화걸기
              </a>
            </span>
          )}

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#B0B8C1' }}>
            <Clock size={12} />
            {createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} · {timeLabel}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button onClick={() => onToggle(entry.id)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '9px 16px', borderRadius: '100px', border: 'none',
          background: '#3182F6', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          letterSpacing: '-0.01em',
        }}>
          <CheckCircle2 size={13} /> 처리
        </button>
        <button onClick={() => { if (window.confirm('삭제할까요?')) onDelete(entry.id); }} style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '9px 16px', borderRadius: '100px', border: 'none',
          background: '#FFF2F1', color: '#F04452', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          letterSpacing: '-0.01em',
        }}>
          <Trash2 size={13} /> 삭제
        </button>
      </div>
    </div>
  );
}
