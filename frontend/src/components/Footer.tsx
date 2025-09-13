import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import TermsModal from './TermsModal';

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <footer className="w-full flex justify-center bg-gradient-to-b from-[#76231c] to-[#3d110f] relative overflow-hidden">
        
        {/* 서부 배경 텍스처 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 30%, rgba(118,35,28,0.2) 0%, transparent 50%),
              linear-gradient(45deg, rgba(118,35,28,0.15) 25%, transparent 25%)
            `,
            backgroundSize: '80px 80px, 20px 20px'
          }}
        ></div>

        {/* 상단 장식 테두리 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5a1a16] via-yellow-600 to-[#5a1a16]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
        </div>

        <div className="w-full max-w-md bg-gradient-to-b from-[#76231c] to-[#3d110f] text-amber-100 py-4 text-xs border-4 border-[#5a1a16] border-t-0 relative z-10"
             style={{
               clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 15px 100%)'
             }}>
          
          {/* 못 장식 */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-yellow-600 rounded-full shadow-inner border border-yellow-800"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-yellow-600 rounded-full shadow-inner border border-yellow-800"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-yellow-600 rounded-full shadow-inner border border-yellow-800"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-yellow-600 rounded-full shadow-inner border border-yellow-800"></div>

          <div className="px-4 space-y-3 relative z-10">
            
            {/* 로고 + 타이틀 */}
            <div className="flex items-center justify-center bg-[#3d110f] bg-opacity-40 p-2 border-2 border-yellow-700 border-dashed">
              <div className="mr-2 shadow-md rounded-lg border border-yellow-600 p-1 bg-[#5a1a16]">
                <img src="/hear.jpg" alt="히어컴퍼니 로고" className="w-12 h-12 rounded-md" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-yellow-300 tracking-wider drop-shadow-md">
                  제 42대 외국어대학 학생회 hear
                </h3>
                <p className="text-amber-300 text-[10px] italic">2025 가을 아델란테 : 경희의 울림으로</p>
              </div>
            </div>

            {/* 연락처 */}
            <div className="grid grid-cols-2 gap-1 text-amber-200 text-[10px]">
              <div className="bg-[#3d110f] bg-opacity-50 p-1.5 border border-yellow-700 flex items-center">
                <MapPin size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="truncate">외국어대학 앞</span>
              </div>
              <div className="bg-[#3d110f] bg-opacity-50 p-1.5 border border-yellow-700 flex items-center">
                <Phone size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="truncate">010-6276-0281</span>
              </div>
              <div className="bg-[#3d110f] bg-opacity-50 p-1.5 border border-yellow-700 flex items-center">
                <Mail size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="truncate">khuhear@gmail.com</span>
              </div>
              <div className="bg-[#3d110f] bg-opacity-50 p-1.5 border border-yellow-700 flex items-center">
                <Globe size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="truncate">khuhear.com</span>
              </div>
            </div>

            {/* 약관 */}
            <div className="flex justify-center space-x-3 text-amber-300 text-[10px] py-1">
              <button 
                onClick={() => setTermsOpen(true)} 
                className="hover:text-yellow-300 transition-colors duration-200 border-b border-yellow-500 hover:border-yellow-400"
              >
                📜 이용 약관
              </button>
              <span className="text-amber-500">|</span>
              <button 
                onClick={() => setTermsOpen(true)} 
                className="hover:text-yellow-300 transition-colors duration-200 border-b border-yellow-500 hover:border-yellow-400"
              >
                🔒 개인정보 보호
              </button>
            </div>

            {/* 고지사항 */}
            <div className="border-t-2 border-yellow-700 border-dotted pt-2">
              <div className="bg-[#3d110f] bg-opacity-40 p-2 border border-yellow-700 border-dashed">
                <div className="text-center text-amber-300 text-[9px] font-serif leading-relaxed">
                  <p>*본 사이트는 외국어대학 학생회에서 직접 제작하였으며, 모든 저작권은 학생회에 있습니다.</p>
                  <p>*행사 수익금은 외국어대학 학생회비로 귀속됩니다.</p>
                  <div className="flex items-center justify-center mt-1">
                    <div className="w-6 h-px bg-yellow-600"></div>
                    <span className="mx-1 text-[8px]">🤠</span>
                    <div className="w-6 h-px bg-yellow-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 장식 */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5a1a16] via-yellow-600 to-[#5a1a16]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-40"></div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default Footer;
