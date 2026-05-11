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
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <img src="/yunsul.jpg" alt="윤슬" style={{
            width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', background: '#EEF0F8',
          }} />
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              제28대 한국어학과 학생회 윤슬
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
              학생회장 김경민
            </p>
          </div>
        </div>

        {/* Contact chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {['010-8921-9358'].map(c => (
            <a key={c} href={`tel:${c.replace(/-/g, '')}`} style={{
              fontSize: '12px', color: 'var(--primary)', fontWeight: 600,
              background: 'var(--primary-light)',
              borderRadius: '100px', padding: '4px 12px',
              textDecoration: 'none',
            }}>
              {c}
            </a>
          ))}
        </div>

        {/* Terms + copyright */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['이용 약관', '개인정보보호'].map(label => (
              <button key={label} onClick={() => setTermsOpen(true)} style={{
                background: 'none', border: 'none',
                fontSize: '12px', color: 'var(--text-dim)',
                cursor: 'pointer', padding: 0,
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}>
                {label}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-dim)' }}>© 2025 윤슬</p>
        </div>

        <p style={{ margin: '12px 0 0', fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          본 사이트는 한국어학과 학생회에서 제작하였으며 모든 저작권은 학생회에 있습니다.
        </p>
      </footer>
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default Footer;
