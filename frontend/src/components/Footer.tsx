import React, { useState } from 'react';
import { BarChart2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import TermsModal from './TermsModal';

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <footer className="w-full flex justify-center bg-gradient-to-b from-amber-800 to-amber-900 relative overflow-hidden">
        
        {/* 서부 배경 텍스처 */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 30%, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
              linear-gradient(45deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%)
            `,
            backgroundSize: '80px 80px, 20px 20px'
          }}
        ></div>

        {/* 상단 장식 테두리 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
        </div>

        <div className="w-full max-w-md bg-gradient-to-b from-amber-800 to-amber-900 text-amber-100 py-4 text-xs border-4 border-amber-900 border-t-0 relative z-10"
             style={{
               clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 15px 100%)'
             }}>
          
          {/* 못 장식 */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-amber-600 rounded-full shadow-inner border border-amber-800"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-600 rounded-full shadow-inner border border-amber-800"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-amber-600 rounded-full shadow-inner border border-amber-800"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-amber-600 rounded-full shadow-inner border border-amber-800"></div>

          <div className="px-4 space-y-3 relative z-10">
            
            {/* 회사 정보 */}
            <div className="flex items-center justify-center bg-amber-950 bg-opacity-30 p-2 border-2 border-amber-700 border-dashed">
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-2 border border-amber-500 mr-2 shadow-md">
                <img src="/logo.png" alt="히어컴퍼니 로고" className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg font-serif text-yellow-300" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  🤠 외국어대학 학생회 주점
                </h3>
                <p className="text-amber-300 text-[10px] font-serif italic">서부 개척 시대부터</p>
              </div>
            </div>

            {/* 연락처 정보 - 간결하게 */}
            <div className="grid grid-cols-2 gap-1 text-amber-200 text-[10px]">
              <div className="bg-amber-900 bg-opacity-40 p-1.5 border border-amber-700 flex items-center">
                <MapPin size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="font-serif truncate">경희대 외대 앞</span>
              </div>
              <div className="bg-amber-900 bg-opacity-40 p-1.5 border border-amber-700 flex items-center">
                <Phone size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="font-serif truncate">010-6276-0281</span>
              </div>
              <div className="bg-amber-900 bg-opacity-40 p-1.5 border border-amber-700 flex items-center">
                <Mail size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="font-serif truncate">khuhear@gmail.com</span>
              </div>
              <div className="bg-amber-900 bg-opacity-40 p-1.5 border border-amber-700 flex items-center">
                <Globe size={10} className="mr-1 text-yellow-400 flex-shrink-0" />
                <span className="font-serif truncate">hearcompany.net</span>
              </div>
            </div>

            {/* 약관 링크 */}
            <div className="flex justify-center space-x-3 text-amber-300 text-[10px] py-1">
              <button 
                onClick={() => setTermsOpen(true)} 
                className="font-serif hover:text-yellow-300 transition-colors duration-200 border-b border-amber-500 hover:border-yellow-400"
              >
                📜 주점 규칙
              </button>
              <span className="text-amber-500">|</span>
              <button 
                onClick={() => setTermsOpen(true)} 
                className="font-serif hover:text-yellow-300 transition-colors duration-200 border-b border-amber-500 hover:border-yellow-400"
              >
                🔒 개인정보 보호
              </button>
            </div>

            {/* 하단 고지사항 - 축약 */}
            <div className="border-t-2 border-amber-700 border-dotted pt-2">
              <div className="bg-amber-950 bg-opacity-40 p-2 border border-amber-700 border-dashed">
                <div className="text-center text-amber-300 text-[9px] font-serif leading-relaxed">
                  <p className="italic">
                    외국어대학 학생회 직접 운영 | 수익금은 지역사회 발전에 사용
                  </p>
                  <div className="flex items-center justify-center mt-1">
                    <div className="w-6 h-px bg-amber-600"></div>
                    <span className="mx-1 text-[8px]">🤠</span>
                    <div className="w-6 h-px bg-amber-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 장식 */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-40"></div>
          </div>
        </div>
      </footer>

      {/* Modal 컴포넌트 */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default Footer;