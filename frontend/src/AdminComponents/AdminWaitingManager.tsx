// src/AdminComponents/WaitingManager.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface WaitingEntry {
  id: number;
  name: string;
  phone: string;
  tableSize: number;
  timestamp: string;
}

export default function WaitingManager() {
  const [waitingList, setWaitingList] = useState<WaitingEntry[]>([]);

  const fetchList = async () => {
    try {
      const res = await axios.get<WaitingEntry[]>(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/waiting`
      );
      
      setWaitingList(res.data);
    } catch (e) {
      console.error('목록 불러오기 실패', e);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/waiting/admin/${id}`
      );
      
      fetchList();
    } catch (e) {
      alert('삭제 실패');
      console.error(e);
    }
  };

  useEffect(() => {
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">⏳ 웨이팅 명단 (관리자)</h2>
      {waitingList.length === 0 ? (
        <p className="text-gray-500">대기자가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {waitingList.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-lg">{entry.name} ({entry.tableSize}인)</div>
                <div className="text-sm text-gray-600">☎ {entry.phone}</div>
                <div className="text-xs text-gray-400">등록 시각: {new Date(entry.timestamp).toLocaleTimeString()}</div>
              </div>
              <button
                onClick={() => handleRemove(entry.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
