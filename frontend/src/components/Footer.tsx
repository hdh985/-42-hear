import React from 'react';
import { BarChart2, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="w-full flex justify-center bg-gray-100">
    <div className="w-full max-w-md bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-5 text-xs rounded-b-2xl overflow-hidden shadow-md">
      <div className="px-4 space-y-4">
        <div className="flex items-center">
          <div className="bg-blue-700 p-2 rounded-lg mr-2">
            <BarChart2 size={16} />
          </div>
          <div>
            <h3 className="font-bold">히어스톡스</h3>
            <p className="text-blue-300 text-[10px]">(주)히어컴퍼니</p>
          </div>
        </div>

        <div className="space-y-1 text-blue-200">
          <div className="flex items-center"><MapPin size={12} className="mr-1" /> 경기도 용인시 기흥구</div>
          <div className="flex items-center"><Phone size={12} className="mr-1" /> 010-6276-0281</div>
          <div className="flex items-center"><Mail size={12} className="mr-1" /> hear@herecompany.com</div>
          <div className="flex items-center"><Globe size={12} className="mr-1" /> www.herecompany.com</div>
        </div>

        <div className="flex justify-center space-x-2 text-blue-200 text-[11px]">
          <a href="#" className="hover:text-white">이용약관</a>
          <span>|</span>
          <a href="#" className="hover:text-white">개인정보처리방침</a>
        </div>

        <div className="border-t border-blue-800 pt-2 text-center text-blue-300 text-[10px]">
          © {new Date().getFullYear()} HEAR Company. All Rights Reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
