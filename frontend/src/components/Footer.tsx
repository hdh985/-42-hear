import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import TermsModal from './TermsModal';

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <footer
        role="contentinfo"
        className="relative flex w-full justify-center overflow-hidden bg-gradient-to-b from-[#76231c] to-[#3d110f]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Western texture (subtle) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(40% 35% at 30% 30%, rgba(118,35,28,0.18) 0%, rgba(0,0,0,0) 60%), repeating-linear-gradient(45deg, rgba(118,35,28,0.12) 0 14px, transparent 14px 28px)'
          }}
        />

        {/* Top trim */}
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#5a1a16] via-yellow-600 to-[#5a1a16]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-40" />
        </div>

        <div
          className="relative z-10 w-full max-w-md border-x-4 border-b-4 border-[#5a1a16] bg-gradient-to-b from-[#76231c] to-[#3d110f] py-4 text-xs text-amber-100"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 15px 100%)' }}
        >
          {/* Nail accents */}
          <div className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full border border-yellow-800 bg-yellow-600 shadow-inner" />
          <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-yellow-800 bg-yellow-600 shadow-inner" />
          <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full border border-yellow-800 bg-yellow-600 shadow-inner" />
          <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full border border-yellow-800 bg-yellow-600 shadow-inner" />

          <div className="relative z-10 px-4 space-y-3">
            {/* Logo + Title */}
            <div className="flex items-center justify-center rounded border-2 border-yellow-700/80 bg-[#3d110f]/40 p-2">
              <div className="mr-2 rounded-lg border border-yellow-600 bg-[#5a1a16] p-1 shadow-md">
                <img src="/hear.jpg" alt="히어컴퍼니 로고" className="h-12 w-12 rounded-md object-cover" />
              </div>
              <div className="text-center leading-tight">
                <h3 className="text-lg font-bold tracking-wider text-yellow-300 drop-shadow">제 42대 외국어대학 학생회 hear</h3>
                <p className="text-[10px] italic text-amber-300">2025 가을 아델란테 : 경희의 울림으로</p>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-amber-200">
              <div className="flex items-center rounded border border-yellow-700 bg-[#3d110f]/50 p-1.5">
                <MapPin size={12} className="mr-1 flex-shrink-0 text-yellow-400" />
                <span className="truncate">외국어대학 앞</span>
              </div>
              <div className="flex items-center rounded border border-yellow-700 bg-[#3d110f]/50 p-1.5">
                <Phone size={12} className="mr-1 flex-shrink-0 text-yellow-400" />
                <span className="truncate">010-6276-0281</span>
              </div>
              <div className="flex items-center rounded border border-yellow-700 bg-[#3d110f]/50 p-1.5">
                <Mail size={12} className="mr-1 flex-shrink-0 text-yellow-400" />
                <span className="truncate">khuhear@gmail.com</span>
              </div>
              <div className="flex items-center rounded border border-yellow-700 bg-[#3d110f]/50 p-1.5">
                <Globe size={12} className="mr-1 flex-shrink-0 text-yellow-400" />
                <span className="truncate">khuhear.com</span>
              </div>
            </div>

            {/* Terms */}
            <div className="flex justify-center space-x-3 py-1 text-[10px] text-amber-300">
              <button
                onClick={() => setTermsOpen(true)}
                aria-haspopup="dialog"
                className="border-b border-yellow-500 transition-colors duration-200 hover:border-yellow-400 hover:text-yellow-300"
              >
                📜 이용 약관
              </button>
              <span className="text-amber-500">|</span>
              <button
                onClick={() => setTermsOpen(true)}
                aria-haspopup="dialog"
                className="border-b border-yellow-500 transition-colors duration-200 hover:border-yellow-400 hover:text-yellow-300"
              >
                🔒 개인정보 보호
              </button>
            </div>

            {/* Notice */}
            <div className="border-t-2 border-dotted border-yellow-700 pt-2">
              <div className="rounded border border-yellow-700/90 bg-[#3d110f]/40 p-2">
                <div className="text-center font-serif leading-relaxed text-amber-300">
                  <p className="text-[9px]">*본 사이트는 외국어대학 학생회에서 직접 제작하였으며, 모든 저작권은 학생회에 있습니다.</p>
                  <p className="text-[9px]">*행사 수익금은 외국어대학 학생회비로 귀속됩니다.</p>
                  <div className="mt-1 flex items-center justify-center">
                    <div className="h-px w-6 bg-yellow-600" />
                    <span className="mx-1 text-[8px]">🤠</span>
                    <div className="h-px w-6 bg-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom trim */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5a1a16] via-yellow-600 to-[#5a1a16]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-40" />
          </div>
        </div>
      </footer>

      {/* Modal */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default Footer;
