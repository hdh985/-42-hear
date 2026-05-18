import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';

export default function WaitingPage() {
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [partySize, setPartySize] = useState(1);
  const [agreed, setAgreed]       = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isValid = name.trim() !== '' && phone.replace(/\D/g, '').length >= 10 && agreed;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length >= 4 && raw.length <= 7)  formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    else if (raw.length >= 8)                 formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone.replace(/\D/g, ''));
    formData.append('tableSize', partySize.toString());
    formData.append('consent', 'true');
    try {
      setIsSubmitting(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/waiting`, formData);
      alert('등록 완료! 대기 명단에 추가되었습니다.');
      setName(''); setPhone(''); setPartySize(1); setAgreed(false);
      navigate('/waiting');
    } catch {
      alert('등록 실패. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E5E8EB',
    background: '#FAFAFA',
    fontSize: '15px',
    color: '#191F28',
    outline: 'none',
    letterSpacing: '-0.01em',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  };

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
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em', lineHeight: 1.2 }}>대기 등록</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/waiting')}
          style={{
            padding: '8px 14px', borderRadius: '100px', border: 'none',
            background: '#F2F4F6', color: '#6B7684',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          명단 보기
        </button>
      </header>

      <main style={{ padding: '20px 16px calc(40px + env(safe-area-inset-bottom, 0px))' }}>

        {/* 안내 배너 */}
        <div style={{
          background: '#EBF3FE', borderRadius: '12px',
          padding: '12px 16px', marginBottom: '16px',
          fontSize: '13px', color: '#3182F6', lineHeight: 1.6,
          letterSpacing: '-0.01em',
        }}>
          💡 문자 발송 후 <strong>5분</strong> 내 미입장 시 자동 취소됩니다.
        </div>

        {/* 폼 카드 */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: '#FFFFFF', borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden', marginBottom: '12px',
          }}>

            {/* 예약자명 */}
            <div style={{ padding: '20px 20px 0' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7684', letterSpacing: '-0.01em', marginBottom: '8px' }}>
                예약자명
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="대표자 한 분만 입력"
                style={inputStyle}
              />
            </div>

            <div style={{ height: '1px', background: '#F2F4F6', margin: '20px 0' }} />

            {/* 전화번호 */}
            <div style={{ padding: '0 20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7684', letterSpacing: '-0.01em', marginBottom: '8px' }}>
                전화번호
              </label>
              <input
                type="text"
                inputMode="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                style={inputStyle}
              />
            </div>

            <div style={{ height: '1px', background: '#F2F4F6', margin: '20px 0' }} />

            {/* 인원 수 */}
            <div style={{ padding: '0 20px 20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7684', letterSpacing: '-0.01em', marginBottom: '8px' }}>
                인원 수
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setPartySize(v => Math.max(1, v - 1))}
                  style={{
                    width: '40px', height: '40px', flexShrink: 0,
                    borderRadius: '100px', border: 'none',
                    background: partySize === 1 ? '#FEF0F2' : '#F2F4F6',
                    color: partySize === 1 ? '#F04452' : '#6B7684',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  <Minus size={15} strokeWidth={2} />
                </button>
                <span style={{
                  flex: 1, textAlign: 'center',
                  fontSize: '22px', fontWeight: 800, color: '#191F28',
                  letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
                }}>
                  {partySize}명
                </span>
                <button
                  type="button"
                  onClick={() => setPartySize(v => Math.min(20, v + 1))}
                  style={{
                    width: '40px', height: '40px', flexShrink: 0,
                    borderRadius: '100px', border: 'none',
                    background: '#3182F6', color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={15} strokeWidth={2} />
                </button>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#B0B8C1', letterSpacing: '-0.01em' }}>최대 20명까지 등록 가능합니다.</p>
            </div>
          </div>

          {/* 개인정보 동의 */}
          <div style={{
            background: '#FFFFFF', borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            padding: '16px 20px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <button
              type="button"
              onClick={() => setAgreed(v => !v)}
              style={{
                width: '22px', height: '22px', flexShrink: 0,
                borderRadius: '6px',
                border: agreed ? 'none' : '1.5px solid #D1D6DB',
                background: agreed ? '#3182F6' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {agreed && <span style={{ color: '#fff', fontSize: '13px', fontWeight: 800 }}>✓</span>}
            </button>
            <span style={{ fontSize: '13px', color: '#191F28', letterSpacing: '-0.01em', flex: 1 }}>
              <button
                type="button"
                onClick={() => setShowConsent(true)}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: '#3182F6', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px',
                }}
              >
                개인정보 수집·이용
              </button>
              에 동의합니다.
            </span>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{
              width: '100%', padding: '16px',
              borderRadius: '14px', border: 'none',
              background: isValid ? '#3182F6' : '#E5E8EB',
              color: isValid ? '#FFFFFF' : '#B0B8C1',
              fontSize: '16px', fontWeight: 800,
              cursor: isValid ? 'pointer' : 'not-allowed',
              letterSpacing: '-0.02em',
              boxShadow: isValid ? '0 4px 16px rgba(49,130,246,0.35)' : 'none',
              transition: 'all 0.18s ease',
              marginBottom: '10px',
            }}
          >
            {isSubmitting ? '등록 중…' : '대기 등록하기'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/waiting')}
            style={{
              width: '100%', padding: '15px',
              borderRadius: '14px', border: '1.5px solid #E5E8EB',
              background: '#FFFFFF', color: '#6B7684',
              fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '-0.02em',
            }}
          >
            대기 명단 보기
          </button>
        </form>
      </main>

      {/* 개인정보 동의 바텀시트 */}
      {showConsent && (
        <>
          <div
            aria-hidden
            onClick={() => setShowConsent(false)}
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
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '100px', background: '#E5E8EB' }} />
            </div>
            <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em' }}>
              개인정보 수집·이용 동의서
            </h3>
            <div style={{
              background: '#F2F4F6', borderRadius: '12px',
              padding: '16px', marginBottom: '20px',
              fontSize: '13px', color: '#191F28', lineHeight: 1.8,
              letterSpacing: '-0.01em',
              whiteSpace: 'pre-line',
            }}>
              {`[수집하는 개인정보 항목]\n- 성명, 전화번호\n\n[수집 및 이용 목적]\n- 입장 확인, 연락 및 호출\n\n[보유 및 이용 기간]\n- 행사 종료 후 즉시 파기\n\n※ 동의를 거부할 수 있으며, 동의하지 않을 경우 등록이 제한됩니다.`}
            </div>
            <button
              onClick={() => { setAgreed(true); setShowConsent(false); }}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '14px', border: 'none',
                background: '#3182F6', color: '#FFFFFF',
                fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', letterSpacing: '-0.02em',
                boxShadow: '0 4px 16px rgba(49,130,246,0.3)',
              }}
            >
              동의하고 닫기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
