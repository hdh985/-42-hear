import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdminOrderItem from './AdminOrderItem';

interface OrderItem {
  name: string;
  served_by?: string;
}

interface Order {
  id: number;
  table: string;
  name: string;
  items: OrderItem[];
  total: number;
  song: string;
  image_path: string;
  timestamp: string;
  processed: boolean;
}

interface Props {
  onRevenueUpdate?: (total: number) => void;
  onOrderData?: (orders: Order[]) => void;
  adminName: string;
}

export default function OrderManager({ onRevenueUpdate, onOrderData, adminName }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: number]: number }>({});
  const [zoneTab, setZoneTab] = useState<'all' | '돌다방' | '흡연부스'>('all');

  const prevOrderIdsRef = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get<Order[]>('http://localhost:8000/api/orders');

      // 신규 주문 감지 후 알람
      const newOrders = data.filter(o => !prevOrderIdsRef.current.includes(o.id));
      if (newOrders.length > 0 && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }

      setOrders(data);
      prevOrderIdsRef.current = data.map(o => o.id);

      onRevenueUpdate?.(data.reduce((sum, o) => sum + o.total, 0));
      onOrderData?.(data);

    } catch (err) {
      console.error('주문 조회 실패', err);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3');
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTimes(current => {
        const updated: { [key: number]: number } = {};
        orders.forEach(order => {
          if (!order.processed) {
            updated[order.id] = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 1000);
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orders]);

  const getZone = (table: string) => {
    const num = parseInt(table);
    if (num >= 1 && num <= 50) return '돌다방';
    if (num >= 51 && num <= 100) return '흡연부스';
    return '기타';
  };

  const filtered = orders.filter(order =>
    zoneTab === 'all' || getZone(order.table) === zoneTab
  );

  const pendingOrders = filtered.filter(o => !o.processed);
  const doneOrders = filtered.filter(o => o.processed);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6">📋 주문 목록</h2>

      <div className="flex space-x-2 mb-6">
        {['all', '돌다방', '흡연부스'].map(zone => (
          <button
            key={zone}
            onClick={() => setZoneTab(zone as typeof zoneTab)}
            className={`px-4 py-2 rounded-lg font-semibold transition shadow ${
              zoneTab === zone
                ? 'bg-blue-700 text-white scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {zone === 'all' ? '전체' : zone}
          </button>
        ))}
      </div>

      <section className="mb-10">
        <h3 className="text-2xl font-bold mb-3 text-blue-700">⏳ 처리 대기</h3>
        {pendingOrders.length === 0 ? (
          <p className="text-gray-500">대기 중인 주문 없음</p>
        ) : (
          pendingOrders.map(order => (
            <AdminOrderItem
              key={order.id}
              order={order}
              elapsed={elapsedTimes[order.id] || 0}
              adminName={adminName}
              onRefresh={fetchOrders}
            />
          ))
        )}
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-3 text-gray-600">✅ 처리 완료</h3>
        {doneOrders.length === 0 ? (
          <p className="text-gray-400">완료된 주문 없음</p>
        ) : (
          doneOrders.map(order => (
            <AdminOrderItem
              key={order.id}
              order={order}
              elapsed={elapsedTimes[order.id] || 0}
              adminName={adminName}
              onRefresh={fetchOrders}
            />
          ))
        )}
      </section>
    </div>
  );
}
