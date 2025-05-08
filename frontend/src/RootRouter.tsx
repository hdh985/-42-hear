// src/RootRouter.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './Admin';
import WaitingPage from './Waiting/WaitingPage';
import WaitingList from './Waiting/WaitingList';

export default function RootRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/wait" element={<WaitingPage />} />
      <Route path="/waiting" element={<WaitingList />} /> {/* ✅ 명단 보기 페이지 */}
    </Routes>
  );
}
