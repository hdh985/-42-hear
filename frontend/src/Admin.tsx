import React, { useEffect, useState } from 'react';
import OrderManager from './AdminComponents/OrderManager';
import WaitingManager from './AdminComponents/AdminWaitingManager';

interface RevenueRank {
  [admin: string]: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'orders' | 'waiting' | 'ranking'>('orders');
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [animatedRevenue, setAnimatedRevenue] = useState<number>(0);
  const [showRevenue, setShowRevenue] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [revenueRanks, setRevenueRanks] = useState<RevenueRank>({});
  const [doldabangRevenue, setDoldabangRevenue] = useState<number>(0);
  const [smokingBoothRevenue, setSmokingBoothRevenue] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('adminName');
    if (!saved) {
      const input = prompt('처리자 이름을 입력해주세요');
      if (input) {
        setAdminName(input);
        localStorage.setItem('adminName', input);
      }
    } else {
      setAdminName(saved);
    }
  }, []);

  const refreshData = () => {
    window.location.reload();
  };

  const updateRevenueData = (orders: any[]) => {
    const total = orders.reduce((sum, o) => sum + o.total, 0);
    setTotalRevenue(total);

    let doldabang = 0;
    let smokingBooth = 0;

    const rank: RevenueRank = {};
    for (const order of orders) {
      if (order.processed && Array.isArray(order.items)) {
        const tableNum = parseInt(order.table, 10);
        if (!isNaN(tableNum)) {
          if (tableNum >= 1 && tableNum <= 50) {
            doldabang += order.total;
          } else if (tableNum >= 51) {
            smokingBooth += order.total;
          }
        }

        for (const item of order.items) {
          const admin = item.served_by;
          if (admin) {
            rank[admin] = (rank[admin] || 0) + order.total / order.items.length;
          }
        }
      }
    }

    setDoldabangRevenue(doldabang);
    setSmokingBoothRevenue(smokingBooth);
    setRevenueRanks(rank);
  };

  useEffect(() => {
    if (!showRevenue) return;
    const diff = totalRevenue - animatedRevenue;
    if (diff === 0) return;
    const step = Math.ceil(diff / 20);
    const interval = setInterval(() => {
      setAnimatedRevenue((prev) => {
        const next = prev + step;
        if (next >= totalRevenue) {
          clearInterval(interval);
          return totalRevenue;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [totalRevenue, showRevenue, animatedRevenue]);

  if (!adminName) return null;

  const sortedRanks = Object.entries(revenueRanks).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-wrap gap-4 mb-6 items-center">
      <button
        onClick={() => {
          setActiveTab('orders');
          setShowRevenue(true); // ✅ 총매출 보이게 설정
        }}
        className={`px-5 py-2 rounded-lg font-semibold transition shadow ${
          activeTab === 'orders' ? 'bg-blue-600 text-white scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
          📋 주문 관리
        </button>
        <button
          onClick={() => setActiveTab('waiting')}
          className={`px-5 py-2 rounded-lg font-semibold transition shadow ${
            activeTab === 'waiting' ? 'bg-blue-600 text-white scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          ⏳ 웨이팅 명단
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-5 py-2 rounded-lg font-semibold transition shadow ${
            activeTab === 'ranking' ? 'bg-blue-600 text-white scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          🏆 매출왕
        </button>
        <button
          onClick={refreshData}
          className="ml-auto px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow transition"
        >
          🔄 새로 고침
        </button>
      </div>

      {activeTab === 'orders' && (
        <OrderManager

          adminName={adminName}
          onOrderData={updateRevenueData}
        />
      )}

      {activeTab === 'waiting' && <WaitingManager />}

      {activeTab === 'ranking' && (
        <div className="space-y-6">
          <div className="bg-green-100 border border-green-300 text-green-800 text-3xl font-extrabold text-center py-6 rounded shadow animate-fade-in">
            💸 총 매출: {animatedRevenue.toLocaleString()} 원
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border p-4 rounded shadow text-center">
              <h5 className="text-xl font-bold mb-2">☕ 돌다방 매출</h5>
              <p className="text-2xl font-extrabold text-blue-600">{doldabangRevenue.toLocaleString()} 원</p>
            </div>
            <div className="bg-white border p-4 rounded shadow text-center">
              <h5 className="text-xl font-bold mb-2">🚬 흡연부스 매출</h5>
              <p className="text-2xl font-extrabold text-red-600">{smokingBoothRevenue.toLocaleString()} 원</p>
            </div>
          </div>

          <div className="bg-white border p-6 rounded shadow">
            <h4 className="text-2xl font-bold mb-4">🏆 처리자 랭킹</h4>
            <ol className="list-decimal ml-6 space-y-2 text-lg">
              {sortedRanks.map(([admin, amount], idx) => (
                <li key={admin} className="text-gray-800">
                  {idx + 1}. <span className="font-semibold">{admin}</span> - {Math.round(amount).toLocaleString()} 원
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
