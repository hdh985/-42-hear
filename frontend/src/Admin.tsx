import React, { useEffect, useState } from 'react';
import OrderManager from './AdminComponents/OrderManager';
import WaitingManager from './AdminComponents/AdminWaitingManager';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'orders' | 'waiting'>('orders');
  const [totalRevenue, setTotalRevenue] = useState<number>(0);         // 실제 총 매출
  const [animatedRevenue, setAnimatedRevenue] = useState<number>(0);   // 애니메이션용 숫자
  const [showRevenue, setShowRevenue] = useState<boolean>(false);

  // 애니메이션 효과 적용
  useEffect(() => {
    if (!showRevenue) return;

    const diff = totalRevenue - animatedRevenue;
    if (diff === 0) return;

    const step = Math.ceil(diff / 20);  // 숫자가 서서히 올라감
    const interval = setInterval(() => {
      setAnimatedRevenue((prev) => {
        const next = prev + step;
        if (next >= totalRevenue) {
          clearInterval(interval);
          return totalRevenue;
        }
        return next;
      });
    }, 30); // 속도 조절

    return () => clearInterval(interval);
  }, [totalRevenue, showRevenue]);

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6 items-center">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded font-semibold ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          📋 주문 관리
        </button>
        <button
          onClick={() => setActiveTab('waiting')}
          className={`px-4 py-2 rounded font-semibold ${activeTab === 'waiting' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          ⏳ 웨이팅 명단
        </button>

        {activeTab === 'orders' && (
          <button
            onClick={() => {
              setShowRevenue((prev) => !prev);
              setAnimatedRevenue(0);  // 누를 때마다 애니메이션 다시 시작
            }}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
          >
            💰 전체 매출 조회
          </button>
        )}
      </div>

      {showRevenue && (
        <div className="mb-6">
          <div className="bg-green-100 border border-green-300 text-green-800 text-3xl font-extrabold text-center py-6 rounded shadow animate-fade-in">
            💸 총 매출: {animatedRevenue.toLocaleString()} 원
          </div>
        </div>
      )}

      {activeTab === 'orders' && <OrderManager onRevenueUpdate={setTotalRevenue} />}
      {activeTab === 'waiting' && <WaitingManager />}
    </div>
  );
}
