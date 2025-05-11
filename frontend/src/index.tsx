import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './Admin'; // 실제 Admin.tsx 위치에 따라 경로 조정

import WaitingPage from './Waiting/WaitingPage';
import WaitingList from './Waiting/WaitingList';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/wait" element={<WaitingPage/>} />
        <Route path="/waiting" element={<WaitingList/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
