import React, { useState } from 'react';
import TermsModal from './TermsModal';

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <footer
        role="contentinfo"
        style={{
          padding: '24px 20px calc(24px + env(safe-area-inset-bottom, 0px))',
          background: '#FFFFFF',
          borderTop: '1px solid #E5E8EB',
        }}
      >
        {/* 브랜드 행 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <img src="/yunsul.jpg" alt="윤슬" style={{
            width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover',
          }} />
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.01em' }}>
              제28대 한국어학과 학생회 윤슬
            </p>
            <p style={{ margin: '1px 0 0', fontSize: '12px', color: '#B0B8C1', letterSpacing: '-0.01em' }}>
              학생회장 김경민
            </p>
          </div>
        </div>

        {/* 연락처 */}
        <a
          href="tel:01089219358"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: 600, color: '#3182F6',
            background: '#EBF3FE',
            borderRadius: '100px', padding: '7px 14px',
            textDecoration: 'none',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '14px' }}>📞</span>
          010-8921-9358
        </a>

        {/* 구분선 */}
        <div style={{ height: '1px', background: '#F2F4F6', marginBottom: '16px' }} />

        {/* 약관 + 저작권 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['이용 약관', '개인정보보호'].map(label => (
              <button key={label} onClick={() => setTermsOpen(true)} style={{
                background: 'none', border: 'none',
                fontSize: '12px', color: '#6B7684',
                cursor: 'pointer', padding: 0,
                letterSpacing: '-0.01em',
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}>
                {label}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#B0B8C1', letterSpacing: '-0.01em' }}>© 2025 윤슬</p>
        </div>

        <p style={{ margin: 0, fontSize: '11px', color: '#B0B8C1', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          본 사이트는 한국어학과 학생회에서 제작하였으며<br />모든 저작권은 학생회에 있습니다.
        </p>
      </footer>
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default Footer;
