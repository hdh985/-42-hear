import React from 'react';
import { BarChart2, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white pt-8 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 데스크톱 레이아웃 */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-800 bg-opacity-50 p-2 rounded-lg mr-2">
                <BarChart2 size={24} className="text-blue-200" />
              </div>
              <h3 className="text-xl font-bold">히어컴퍼니</h3>
            </div>
            <p className="text-blue-200 text-sm">
            아델란테를 더욱 즐겁게 만드는 히어스톡스에서 다양한 메뉴를 주식처럼 거래하세요. 맛있는 음식과 음료를 합리적인 가격에 제공합니다.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">회사 정보</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-blue-200">
                <MapPin size={16} className="mr-2 text-blue-300" />
                서울특별시 강남구 테헤란로 123, 히어빌딩 7층
              </li>
              <li className="flex items-center text-blue-200">
                <Phone size={16} className="mr-2 text-blue-300" />
                02-123-4567
              </li>
              <li className="flex items-center text-blue-200">
                <Mail size={16} className="mr-2 text-blue-300" />
                info@herecompany.com
              </li>
              <li className="flex items-center text-blue-200">
                <Globe size={16} className="mr-2 text-blue-300" />
                www.herecompany.com
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">이용 안내</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">이용약관</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">개인정보처리방침</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">주문 방법</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">결제 안내</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">운영 시간</h4>
            <div className="space-y-2 text-sm">
              <p className="text-blue-200">축제 기간: 2025.05.26 - 2025.05.28</p>
              <p className="text-blue-200">영업 시간: 18:00 - 00:00</p>
              <p className="text-blue-200">주문 마감: 23:30</p>
              <div className="mt-4 pt-4 border-t border-blue-800">
                <p className="text-white font-medium">위치: 경희대학교 국제캠퍼스 외국어대학 앞</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 모바일 레이아웃 */}
        <div className="md:hidden">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center">
              <div className="bg-blue-800 bg-opacity-50 p-2 rounded-lg mr-2">
                <BarChart2 size={20} className="text-blue-200" />
              </div>
              <h3 className="text-lg font-bold">히어스톡스</h3>
            </div>
            <p className="text-blue-200 text-sm mt-1">(주)히어컴퍼니</p>
          </div>
          
          <div className="text-center text-xs text-blue-200 space-y-1 mb-6">
            <p>사업자등록번호: 123-45-67890</p>
            <p>대표자: 대표이사 윤동현</p>
            <p>주소: 서울특별시 강남구 테헤란로 123, 히어빌딩 7층</p>
            <p>고객센터: 02-123-4567 (평일 10:00 ~ 18:00)</p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-4">
            <a href="#" className="text-xs text-blue-200 hover:text-white transition-colors">이용약관</a>
            <span className="text-blue-700">|</span>
            <a href="#" className="text-xs text-blue-200 hover:text-white transition-colors">개인정보처리방침</a>
          </div>
        </div>
        
        {/* 공통 푸터 */}
        <div className="border-t border-blue-800 pt-4 text-center">
          <p className="text-xs text-blue-300">
            © {new Date().getFullYear()} HERE Company Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;