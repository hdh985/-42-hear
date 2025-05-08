import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface Order {
  id: number; // ✅ 주문 ID 필요
  table: string;
  name: string;
  items: string[];
  total: number;
  song: string;
  image_path: string;
  timestamp: string;
  processed: boolean; // ✅ 서버로부터 처리 상태
}

interface Props {
  onRevenueUpdate?: (total: number) => void;
}

export default function OrderManager({ onRevenueUpdate }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTab, setCurrentTab] = useState<'pending' | 'done'>('pending');
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: number]: number }>({});
  const prevPendingCount = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3');

    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
          audioRef.current!.volume = 1;
        }).catch(() => {});
      }
      document.body.removeEventListener('click', unlockAudio);
    };

    document.body.addEventListener('click', unlockAudio, { once: true });

    fetchOrders();
    const fetchInterval = setInterval(fetchOrders, 5000);
    return () => clearInterval(fetchInterval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>('http://localhost:8000/api/orders');
      const newOrders = res.data;

      const total = newOrders.reduce((sum, order) => sum + order.total, 0);
      if (onRevenueUpdate) onRevenueUpdate(total);

      const newPendingCount = newOrders.filter((o) => !o.processed).length;
      if (newPendingCount > prevPendingCount.current) {
        audioRef.current?.play().catch((err) => console.warn('🔊 알림음 재생 실패', err));
      }
      prevPendingCount.current = newPendingCount;

      setOrders(newOrders);
    } catch (e) {
      console.error('[Admin] 주문 조회 실패', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setElapsedTimes((prev) => {
        const updated: { [key: number]: number } = {};
        orders.forEach((order) => {
          if (!order.processed) {
            const elapsed = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 1000);
            updated[order.id] = elapsed;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [orders]);

  const toggleProcessed = async (id: number) => {
    try {
      await axios.patch(`http://localhost:8000/api/orders/${id}/toggle`);
      fetchOrders();
    } catch (e) {
      console.error('처리 상태 토글 실패', e);
    }
  };

  const pendingOrders = orders.filter((o) => !o.processed);
  const doneOrders = orders.filter((o) => o.processed);

  const renderTimer = (elapsed: number) => {
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    let color = 'text-green-600';
    if (elapsed >= 900) color = 'text-red-600 font-bold';
    else if (elapsed >= 600) color = 'text-yellow-500 font-semibold';
    return <span className={`text-lg px-2 py-1 rounded border ${color}`}>⏱ {timeStr}</span>;
  };

  const renderOrder = (order: Order) => (
    <div key={order.id} className={`p-4 mb-4 border rounded ${order.processed ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-2">
        <strong>테이블 {order.table} - {order.name}</strong>
        <div className="flex space-x-2 items-center">
          {!order.processed && renderTimer(elapsedTimes[order.id] || 0)}
          <button
            className={`px-2 py-1 rounded text-sm ${order.processed ? 'bg-gray-400' : 'bg-green-500 text-white'}`}
            onClick={() => toggleProcessed(order.id)}
          >
            {order.processed ? '처리 완료' : '처리 대기'}
          </button>
        </div>
      </div>
      <ul className="list-disc list-inside text-sm mb-2">
        {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((it: string, i: number) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
      <div className="text-sm mb-1">총 금액: {order.total.toLocaleString()}원</div>
      <div className="text-sm mb-1">신청곡: {order.song || '-'}</div>
      <div className="text-xs text-gray-500">주문 시각: {new Date(order.timestamp).toLocaleTimeString()}</div>
      {order.image_path && (
        <img
          src={`http://localhost:8000/${order.image_path}`}
          alt="증빙"
          className="w-full max-h-48 object-contain border rounded cursor-pointer mt-2"
          onClick={() => setPreviewImg(`http://localhost:8000/${order.image_path}`)}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />
      <h1 className="text-2xl font-bold mb-4">📋 주문 관리 시스템</h1>
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${currentTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentTab('pending')}
        >
          처리 대기 ({pendingOrders.length})
        </button>
        <button
          className={`px-3 py-1 rounded ${currentTab === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentTab('done')}
        >
          처리 완료 ({doneOrders.length})
        </button>
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : orders.length === 0 ? (
        <p>아직 주문이 없습니다.</p>
      ) : (
        <>{(currentTab === 'pending' ? pendingOrders : doneOrders).map(renderOrder)}</>
      )}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setPreviewImg(null)}
        >
          <img src={previewImg} alt="미리보기" className="max-h-[80vh] max-w-[80vw] border-4 border-white rounded" />
        </div>
      )}
    </div>
  );
}
