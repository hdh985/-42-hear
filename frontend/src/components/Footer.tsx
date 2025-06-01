import React, { useState } from 'react';
import { BarChart2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import TermsModal from './TermsModal';

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <footer className="w-full flex justify-center bg-gray-100">
        <div className="w-full max-w-md bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-5 text-xs rounded-b-2xl overflow-hidden shadow-md">
          <div className="px-4 space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-700 p-2 rounded-lg mr-2">
                  <img src="/logo.png" alt="히어컴퍼니 로고" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold">히어컴퍼니</h3>
                <p className="text-blue-300 text-[10px]">(주)hear</p>
              </div>
            </div>

            <div className="space-y-1 text-blue-200">
              <div className="flex items-center"><MapPin size={12} className="mr-1" /> 경희대학교 외국어대학 앞 민주광장</div>
              <div className="flex items-center"><Phone size={12} className="mr-1" /> 대표이사 윤동현: 010-6276-0281</div>
              <div className="flex items-center"><Mail size={12} className="mr-1" /> khuhear@gmail.com</div>
              <div className="flex items-center"><Globe size={12} className="mr-1" /> www.hearcompany.net</div>
            </div>

            <div className="flex justify-center space-x-2 text-blue-200 text-[11px]">
              <button onClick={() => setTermsOpen(true)} className="hover:text-white">이용약관</button>
              <span>|</span>
              <button onClick={() => setTermsOpen(true)} className="hover:text-white">개인정보처리방침</button>
              <span></span>
            </div>

            <div className="border-t border-blue-800 pt-2 text-center text-blue-300 text-[10px]">
              *해당 서비스는 외국어대학 학생회가 직접 개발한 서비스로 모든 저작권은 외국어대학 학생회에게 있습니다. 또한 행사간 발생한 수익금은 개인의 영리를 위해 사용되지 않습니다.
            </div>
          </div>
        </div>
      </footer>

      {/* Modal 컴포넌트 */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default Footer;
