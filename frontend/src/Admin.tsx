import React, { useEffect, useState } from 'react';
import OrderManager from './AdminComponents/OrderManager';
import WaitingManager from './AdminComponents/AdminWaitingManager';
import { Trophy, RefreshCw, User as UserIcon, Pencil, Award, ArrowRight } from 'lucide-react';

interface RevenueRank {
  [admin: string]: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'orders' | 'waiting' | 'ranking'>('orders');

  // ===== Revenue / Ranking =====
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [animatedRevenue, setAnimatedRevenue] = useState<number>(0);
  const [revenueRanks, setRevenueRanks] = useState<RevenueRank>({});

  // ===== Admin name =====
  const [adminName, setAdminName] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // ===== Init admin name =====
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

  // ===== Pull-to-refresh =====
  const refreshData = () => window.location.reload();

  // ===== Compute totals/ranks from orders =====
  type OrderItem = { name: string; served_by?: string };
  type Order = {
    id: number;
    table: string;
    name: string;
    items: OrderItem[] | string;
    total: number;
    timestamp: string;
    processed: boolean;
  };

  const updateRevenueData = (orders: Order[]) => {
    const total = orders.reduce((sum, o) => sum + o.total, 0);
    setTotalRevenue(total);

    const rank: RevenueRank = {};

    for (const order of orders) {
      if (!order.processed) continue; // 처리된 건만 집계

      // items: 문자열 방어적 파싱
      let items: OrderItem[] = [];
      try {
        items = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || []);
      } catch {
        items = [];
      }
      if (!items.length) continue;

      // 단순 분배: 주문 금액을 항목 수로 균등 분배 후 각 처리자에 가산
      const unit = order.total / items.length;
      for (const item of items) {
        const admin = item.served_by?.trim();
        if (!admin) continue;
        rank[admin] = (rank[admin] || 0) + unit;
      }
    }

    setRevenueRanks(rank);
  };

  // ===== Animate total revenue whenever it changes =====
  useEffect(() => {
    // 부드러운 카운트업
    const diff = totalRevenue - animatedRevenue;
    if (diff === 0) return;
    const step = Math.ceil(Math.abs(diff) / 20);
    const id = setInterval(() => {
      setAnimatedRevenue((prev) => {
        const next = prev + (prev < totalRevenue ? step : -step);
        if ((prev < totalRevenue && next >= totalRevenue) || (prev > totalRevenue && next <= totalRevenue)) {
          clearInterval(id);
          return totalRevenue;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [totalRevenue, animatedRevenue]);

  if (!adminName) return null;

  const sortedRanks = Object.entries(revenueRanks).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      {/* Top bar */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        {/* Tabs */}
        {(
          [
            { key: 'orders', label: '📋 주문 관리' },
            { key: 'waiting', label: '⏳ 웨이팅 명단' },
            { key: 'ranking', label: '🏆 매출왕' },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2 rounded-lg font-semibold transition shadow ${
              activeTab === t.key ? 'bg-blue-600 text-white scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}

        {/* Right controls */}
        <button
          onClick={refreshData}
          className="ml-auto px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow transition inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> 새로 고침
        </button>

        {/* Admin name chip */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 ring-1 ring-slate-200 text-slate-700">
          <UserIcon className="w-4 h-4" />
          <span className="font-medium">{adminName}</span>
          <button
            onClick={() => {
              setTempName(adminName);
              setEditingName(true);
            }}
            className="ml-1 text-xs px-2 py-1 rounded bg-white hover:bg-slate-100 ring-1 ring-slate-200 inline-flex items-center gap-1"
          >
            <Pencil className="w-3.5 h-3.5" /> 수정
          </button>
        </div>
      </div>

      {/* Orders */}
      {activeTab === 'orders' && (
        <OrderManager adminName={adminName} onOrderData={updateRevenueData} />
      )}

      {/* Waiting */}
      {activeTab === 'waiting' && <WaitingManager />}

      {/* Ranking */}
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          {/* Total revenue banner */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 ring-1 ring-emerald-200">
            <div className="flex items-center justify-center gap-3 text-emerald-800">
              <Trophy className="w-7 h-7" />
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">총 매출: {animatedRevenue.toLocaleString('ko-KR')} 원</div>
            </div>
          </div>

          {/* Top performers */}
          <div className="bg-white border p-6 rounded-2xl shadow-sm">
            <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" /> 처리자 랭킹
            </h4>
            {sortedRanks.length === 0 ? (
              <div className="text-gray-500">아직 집계된 처리자가 없습니다.</div>
            ) : (
              <ol className="space-y-2">
                {sortedRanks.map(([admin, amount], idx) => (
                  <li key={admin} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-100 text-slate-700' : idx === 2 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'
                      }`}>{idx + 1}</span>
                      <span className="font-semibold">{admin}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-800">{Math.round(amount).toLocaleString('ko-KR')} 원</div>
                  </li>
                ))}
              </ol>
            )}
            <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
              * 랭킹 계산 방식: 각 주문 금액을 메뉴 수로 나눠 해당 메뉴를 처리한 담당자에게 균등 가산합니다.
            </div>
          </div>

          {/* CTA to go back to orders */}
          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('orders')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
            >
              주문 관리로 이동 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Admin Name Modal (simple inline) */}
      {editingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <h5 className="text-lg font-bold mb-3">관리자 이름 수정</h5>
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="이름 입력"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingName(false)}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                취소
              </button>
              <button
                onClick={() => {
                  const name = tempName.trim();
                  if (!name) return;
                  setAdminName(name);
                  localStorage.setItem('adminName', name);
                  setEditingName(false);
                }}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
