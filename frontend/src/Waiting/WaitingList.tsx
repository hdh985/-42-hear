import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface WaitingEntry {
  id: number;
  name: string;
  phone: string;
  tableSize: number;
  timestamp: string;
}

export default function WaitingList() {
  const [list, setList] = useState<WaitingEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WaitingEntry | null>(null);
  const [inputPhone, setInputPhone] = useState('');

  const fetchList = async () => {
    const res = await axios.get<WaitingEntry[]>('http://localhost:8000/api/waiting');
    setList(res.data);
  };

  useEffect(() => {
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatPhoneTail = (phone: string) => phone.slice(-4);
  const sanitizePhone = (phone: string) => phone.replace(/\D/g, '');
  const maskName = (name: string) => {
    if (name.length <= 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };
  
  const confirmDelete = async () => {
    if (!selectedEntry) return;
  
    try {
      await axios.delete(`http://localhost:8000/api/waiting/${selectedEntry.id}`, {
            data: { phone: inputPhone },
            headers: {
              'Content-Type': 'application/json',
        },
      });
          

          
      alert('삭제되었습니다.');
      setSelectedEntry(null);
      setInputPhone('');
      fetchList();
    } catch (e: any) {
      if (e.response?.status === 403) {
        alert('전화번호가 일치하지 않습니다.');
      } else {
        alert('삭제 실패');
        console.error(e);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">🕒 현재 대기 명단</h2>

        {list.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">현재 대기자가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {list.map((entry, idx) => (
              <li
                key={entry.id}
                className="bg-white border rounded-xl shadow-md p-4 relative transition hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-2">
                 <div className="font-bold text-lg text-gray-800">
                  {maskName(entry.name)} 님 <span className="text-sm text-gray-500">({formatPhoneTail(entry.phone)})</span>
                  <div className="text-sm text-gray-600 mt-1">{entry.tableSize}인 테이블</div>
                </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">{formatTime(entry.timestamp)}</span>
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="mt-2 text-sm text-red-600 font-medium hover:underline"
                    >
                      나가기
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400">대기 순번 #{idx + 1}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-3 text-red-600">🔐 전화번호 확인</h3>
            <p className="text-sm mb-2 text-gray-700">
              <strong>{selectedEntry.name}</strong> 님의 대기 정보를 삭제하시려면 전체 전화번호를 입력하세요.
            </p>
            <input
              type="tel"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="전화번호 (예: 010-1234-5678)"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedEntry(null);
                  setInputPhone('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
