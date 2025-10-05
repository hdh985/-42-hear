import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import TermsModal from './TermsModal';

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);

  const css = `
    @keyframes runway {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 56px 0, -56px 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-runway { animation: none !important; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <footer
        role="contentinfo"
        className="relative flex w-full justify-center overflow-hidden bg-[#0a1a3a]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}
      >
        {/* 하늘/전광판 패턴 */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(1200px 400px at 50% -200px, rgba(44,127,255,0.18) 0%, rgba(0,0,0,0) 70%),linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: 'auto, 40px 40px, 40px 40px'
          }}
        />

        {/* 상단 라인 */}
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-sky-900 via-sky-400 to-sky-900">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200 to-transparent opacity-60" />
        </div>

        <div
          className="relative z-10 w-full max-w-md rounded-t-2xl border-x-4 border-t-4 border-sky-900 bg-gradient-to-b from-[#0b2049] to-[#0c284f] py-4 text-xs text-sky-50"
        >
          {/* 상단 라우트/타이틀 바 */}
          <div className="px-4">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-800/70 border border-sky-600/50 text-[11px] font-semibold">
                ✈️ ICN → WORLD TOUR
              </span>
              <span className="text-[11px] text-sky-300/90">Arrivals • Night Booth</span>
            </div>

            {/* 로고/타이틀 (보딩패스 카드) */}
            <div className="flex items-center justify-center rounded-xl border border-sky-700 bg-sky-900/40 p-2">
              <div className="mr-2 rounded-lg border border-sky-600 bg-sky-800/60 p-1 shadow-inner">
                <img src="/hear.jpg" alt="히어컴퍼니 로고" className="h-12 w-12 rounded-md object-cover" />
              </div>
              <div className="text-center leading-tight">
                <h3 className="text-lg font-extrabold tracking-wider text-amber-300 drop-shadow">
                  제42대 외국어대학 학생회 hear
                </h3>
                <p className="text-[10px] text-sky-200/90">2025 외국어대학 외대제 • 부제 정해줘</p>
              </div>
            </div>
          </div>

          {/* 연락처 (게이트 패널) */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 px-4 text-[10px] text-sky-100/90">
            <div className="flex items-center rounded border border-sky-700 bg-sky-900/40 p-1.5">
              <MapPin size={12} className="mr-1 flex-shrink-0 text-amber-300" />
              <span className="truncate">외국어대학 앞</span>
            </div>
            <div className="flex items-center rounded border border-sky-700 bg-sky-900/40 p-1.5">
              <Phone size={12} className="mr-1 flex-shrink-0 text-amber-300" />
              <span className="truncate">010-6276-0281</span>
            </div>
            <div className="flex items-center rounded border border-sky-700 bg-sky-900/40 p-1.5">
              <Mail size={12} className="mr-1 flex-shrink-0 text-amber-300" />
              <span className="truncate">khuhear@gmail.com</span>
            </div>
            <div className="flex items-center rounded border border-sky-700 bg-sky-900/40 p-1.5">
              <Globe size={12} className="mr-1 flex-shrink-0 text-amber-300" />
              <span className="truncate">khuhear.com</span>
            </div>
          </div>

          {/* 약관/개인정보 */}
          <div className="mt-2 flex justify-center space-x-3 px-4 py-1 text-[10px] text-sky-200">
            <button
              onClick={() => setTermsOpen(true)}
              aria-haspopup="dialog"
              className="border-b border-amber-300 transition-colors duration-200 hover:text-amber-200 hover:border-amber-200"
            >
              📜 이용 약관
            </button>
            <span className="text-sky-500">|</span>
            <button
              onClick={() => setTermsOpen(true)}
              aria-haspopup="dialog"
              className="border-b border-amber-300 transition-colors duration-200 hover:text-amber-200 hover:border-amber-200"
            >
              🔒 개인정보 보호
            </button>
          </div>

          {/* 고지 문구 */}
          <div className="mt-2 border-t border-sky-800 pt-2 px-4">
            <div className="rounded-xl border border-sky-700 bg-sky-900/40 p-2">
              <div className="text-center leading-relaxed text-sky-200/90">
                <p className="text-[9px]">*본 사이트는 외국어대학 학생회에서 직접 제작하였으며, 모든 저작권은 학생회에 있습니다.</p>
                <p className="text-[9px]">*행사 수익금은 외국어대학 학생회비로 귀속됩니다.</p>
                <div className="mt-1 flex items-center justify-center">
                  <div className="h-px w-6 bg-amber-300" />
                  <span className="mx-1 text-[8px]">🌍</span>
                  <div className="h-px w-6 bg-amber-300" />
                </div>
              </div>
            </div>
          </div>

          {/* 하단 활주로 러닝 라이트 */}
          <div
            aria-hidden
            className="animate-runway absolute bottom-0 left-0 right-0 h-1"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255,255,255,0.28) 25%, transparent 25% 50%, rgba(255,255,255,0.28) 50% 75%, transparent 75%), linear-gradient(90deg, rgba(255,255,255,0.14) 25%, transparent 25% 50%, rgba(255,255,255,0.14) 50% 75%, transparent 75%)',
              backgroundSize: '56px 2px, 56px 2px',
              animation: 'runway 4s linear infinite'
            }}
          />
        </div>
      </footer>

      {/* 약관 모달 */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default Footer;
