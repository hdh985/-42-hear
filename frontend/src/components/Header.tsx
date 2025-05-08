import React from 'react';

export default function Header() {
  return (
    <header className="text-center py-6 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-white rounded-t-xl mb-6 shadow-md">
      <img src="/hear.jpg" alt="Hear 로고"
           className="mx-auto mb-2 w-24 h-24 rounded-full shadow-lg object-cover" />
      <h1 className="text-2xl font-bold">제42대 외국어대학 학생회 Hear</h1>
      <p className="welcome-message text-sm mt-1">Hear와 함께 즐거운 아델란테!</p>
    </header>
  );
}

