import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/index.css';
import './Styles/custom.css';
import Header from './components/Header';
import MenuTabs from './components/MenuTabs';
import MenuItem from './components/MenuItem';
import OrderForm from './components/OrderForm';
import CartModal from './components/CartModal';
import { MENU, DRINKS } from './data/menu';
import { MUSIC_CHART } from './data/musicChart';

export default function App() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [consent, setConsent] = useState(false); // ✅ 개인정보 동의 상태
  const [activeTab, setActiveTab] = useState('food');
  const [recommendedSongs, setRecommendedSongs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const shuffled = [...MUSIC_CHART].sort(() => 0.5 - Math.random());
    setRecommendedSongs(shuffled.slice(0, 3));
  }, []);

  const updateQty = (id: number, delta: number) => {
    setQuantities(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const totalPrice = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const item = [...MENU, ...DRINKS].find(i => i.id === Number(id));
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitOrder = async () => {
    if (!tableNumber || !customerName || totalPrice === 0) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    const items = Object.entries(quantities).map(([id, qty]) => {
      const item = [...MENU, ...DRINKS].find(m => m.id === Number(id));
      return `${item?.name} x ${qty}`;
    });

    const formData = new FormData();
    formData.append('table', tableNumber);
    formData.append('name', customerName);
    formData.append('items', JSON.stringify(items));
    formData.append('total', totalPrice.toString());
    formData.append('song', songRequest || '');
    formData.append('consent', consent ? 'true' : 'false'); // ✅ 추가
    if (imageFile) formData.append('payment_image', imageFile);

    try {
      await axios.post('http://localhost:8000/api/orders', formData);
      alert('주문이 접수되었습니다!');
      setQuantities({});
      setTableNumber('');
      setCustomerName('');
      setSongRequest('');
      setImageFile(null);
      setPreviewUrl(null);
      setConsent(false); // ✅ 초기화
    } catch {
      alert('주문 실패');
    }
  };

  const totalItems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  const popularMenu = MENU.filter(item => item.popular);
  const regularMenu = MENU.filter(item => !item.popular);

  return (
    <div className="container">
      <Header />

      <div className="booth-info">
        <div className="booth-name">아델란테: "경희의 이름으로"</div>
        <div>[운영 시간: 18:00 - 23:30]</div>
        <div>저희 히어 봄 대동제 부스를 방문해주셔서 감사합니다! 😊</div>
        <div>❗️ 저희 부스는 주류를 판매하지 않습니다!</div>
      </div>

      <MenuTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {(activeTab === 'food' || activeTab === 'drinks') && (
        <div className="menu-section">
          {activeTab === 'food' && (
            <>
              <h2 className="section-title">히어 세트</h2>
              {popularMenu.map(item => (
                <MenuItem key={item.id} item={item} quantities={quantities} updateQty={updateQty} />
              ))}
              <h2 className="section-title mt-2 leading-relaxed">음식 메뉴</h2>
              {regularMenu.map(item => (
                <MenuItem key={item.id} item={item} quantities={quantities} updateQty={updateQty} />
              ))}
            </>
          )}
          {activeTab === 'drinks' && (
            <>
              <h2 className="section-title">음료 메뉴</h2>
              {DRINKS.map(item => (
                <MenuItem key={item.id} item={item} quantities={quantities} updateQty={updateQty} />
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'hear' && (
        <div className="menu-section">
          <h2 className="section-title">🎵 랜덤 추천곡 (Hear 추천)</h2>
          {recommendedSongs.map((m, idx) => (
            <div key={idx} className="menu-item">
              <div className="item-info">
                <div className="item-name font-bold">{m.name}</div>
                <div className="item-description text-sm text-gray-600">
                  {m.artist} | {m.album}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrderForm
        tableNumber={tableNumber}
        customerName={customerName}
        songRequest={songRequest}
        setTableNumber={setTableNumber}
        setCustomerName={setCustomerName}
        setSongRequest={setSongRequest}
        handleImageChange={handleImageChange}
        previewUrl={previewUrl}
        submitOrder={submitOrder}
        totalPrice={totalPrice}
        consent={consent}
        setConsent={setConsent}
      />

      <button className="cart-button" onClick={() => setShowModal(true)}>
        🛒<span className="cart-badge">{totalItems}</span>
      </button>

      {showModal && (
        <CartModal
          quantities={quantities}
          totalPrice={totalPrice}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
