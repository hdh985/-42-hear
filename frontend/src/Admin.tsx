import { useEffect, useState } from 'react';
import OrderManager from './AdminComponents/OrderManager';
import WaitingManager from './AdminComponents/AdminWaitingManager';
import { Trophy, RefreshCw, User as UserIcon, Pencil, Award } from 'lucide-react';

interface RevenueRank { [admin: string]: number; }

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'orders' | 'waiting' | 'ranking'>('orders');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [revenueRanks, setRevenueRanks] = useState<RevenueRank>({});
  const [adminName, setAdminName] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('adminName');
    if (!saved) {
      const input = prompt('처리자 이름을 입력해주세요');
      if (input) { setAdminName(input); localStorage.setItem('adminName', input); }
    } else {
      setAdminName(saved);
    }
  }, []);

  type OrderItem = { name: string; served_by?: string };
  type Order = { id: number; table: string; name: string; items: OrderItem[] | string; total: number; timestamp: string; processed: boolean; };

  const updateRevenueData = (orders: Order[]) => {
    setTotalRevenue(orders.reduce((sum, o) => sum + o.total, 0));
    const rank: RevenueRank = {};
    for (const order of orders) {
      if (!order.processed) continue;
      let items: OrderItem[] = [];
      try { items = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || []); } catch { items = []; }
      if (!items.length) continue;
      const unit = order.total / items.length;
      for (const item of items) {
        const admin = item.served_by?.trim();
        if (!admin) continue;
        rank[admin] = (rank[admin] || 0) + unit;
      }
    }
    setRevenueRanks(rank);
  };

  useEffect(() => {
    const diff = totalRevenue - animatedRevenue;
    if (diff === 0) return;
    const step = Math.ceil(Math.abs(diff) / 20);
    const id = setInterval(() => {
      setAnimatedRevenue(prev => {
        const next = prev + (prev < totalRevenue ? step : -step);
        if ((prev < totalRevenue && next >= totalRevenue) || (prev > totalRevenue && next <= totalRevenue)) { clearInterval(id); return totalRevenue; }
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [totalRevenue, animatedRevenue]);

  if (!adminName) return null;

  const sortedRanks = Object.entries(revenueRanks).sort((a, b) => b[1] - a[1]);
  const TABS = [
    { key: 'orders' as const,  label: '주문 관리', emoji: '📋' },
    { key: 'waiting' as const, label: '웨이팅',    emoji: '⏳' },
    { key: 'ranking' as const, label: '매출왕',    emoji: '🏆' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F6', fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{
        background: 'var(--surface, #fff)',
        borderBottom: '1px solid var(--border, #E5E8EB)',
        padding: '0 20px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
        position: 'sticky', top: 0, zIndex: 30,
        minHeight: '56px',
      }}>
        <span style={{ fontSize: '17px', fontWeight: 900, color: '#191F28', letterSpacing: '-0.03em', marginRight: '4px' }}>
          어드민
        </span>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '6px 14px', borderRadius: '100px', border: 'none',
              background: activeTab === t.key ? '#3182F6' : 'transparent',
              color: activeTab === t.key ? '#fff' : '#6B7684',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.18s ease',
              letterSpacing: '-0.02em',
            }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => window.location.reload()} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '7px 14px', borderRadius: '100px', border: 'none',
            background: 'var(--surface3, #F2F4F6)',
            color: '#6B7684', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>
            <RefreshCw size={13} /> 새로고침
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '100px',
            background: 'var(--primary-light, #EBF3FE)',
            color: '#3182F6', fontSize: '13px', fontWeight: 700,
          }}>
            <UserIcon size={13} />
            <span>{adminName}</span>
            <button onClick={() => { setTempName(adminName); setEditingName(true); }} style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              padding: '2px 8px', borderRadius: '100px', border: 'none',
              background: 'rgba(49,130,246,0.12)',
              color: '#3182F6', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
            }}>
              <Pencil size={10} /> 수정
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'orders'  && <OrderManager adminName={adminName} onOrderData={updateRevenueData} />}
      {activeTab === 'waiting' && <WaitingManager />}
      {activeTab === 'ranking' && (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px 16px' }}>
          {/* Revenue banner */}
          <div style={{
            background: 'linear-gradient(135deg, #3182F6 0%, #1B64DA 100%)',
            borderRadius: '20px', padding: '24px',
            marginBottom: '12px',
            boxShadow: '0 8px 32px rgba(49,130,246,0.3)',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={28} color="#FFE600" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>총 매출</p>
              <p style={{ margin: 0, fontSize: '30px', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
                {animatedRevenue.toLocaleString('ko-KR')}원
              </p>
            </div>
          </div>

          {/* Ranking */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#FF9500" /> 처리자 랭킹
            </h4>
            {sortedRanks.length === 0 ? (
              <p style={{ color: '#B0B8C1', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                아직 집계된 처리자가 없습니다.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedRanks.map(([admin, amount], idx) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <div key={admin} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: idx === 0 ? '#FFF8ED' : 'var(--surface3, #F2F4F6)',
                      borderRadius: '12px',
                      border: idx === 0 ? '1px solid #FFE0A0' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '22px' }}>{medals[idx] ?? `${idx + 1}`}</span>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#191F28', letterSpacing: '-0.02em' }}>{admin}</span>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#191F28', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                        {Math.round(amount).toLocaleString('ko-KR')}원
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <p style={{ margin: '14px 0 0', fontSize: '11px', color: '#B0B8C1' }}>
              * 주문 금액을 메뉴 수로 나눠 처리 담당자에게 균등 가산
            </p>
          </div>
        </div>
      )}

      {/* Edit name modal */}
      {editingName && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '360px', background: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }} className="animate-scale-in">
            <div style={{ padding: '20px 20px 0' }}>
              <h5 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800, color: '#191F28', letterSpacing: '-0.03em' }}>관리자 이름 수정</h5>
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '1px solid #E5E8EB', borderRadius: '12px',
                  fontSize: '15px', outline: 'none',
                  letterSpacing: '-0.02em', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                placeholder="이름 입력"
                onFocus={e => { e.target.style.borderColor = '#3182F6'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E8EB'; }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', padding: '16px 20px 20px' }}>
              <button onClick={() => setEditingName(false)} style={{
                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                background: '#F2F4F6', color: '#6B7684', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              }}>취소</button>
              <button onClick={() => {
                const name = tempName.trim();
                if (!name) return;
                setAdminName(name); localStorage.setItem('adminName', name); setEditingName(false);
              }} style={{
                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                background: '#3182F6', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
