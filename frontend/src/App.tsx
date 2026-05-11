import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuTab from './components/MenuTabs';
import MenuItem, { MenuItemType } from './components/MenuItem';
import CartModal from './components/CartModal';
import OrderBar from './components/OrderBar';
import { CartItem } from './components/OrderForm';
import './Styles/index.css';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'snack' | 'beverage'>('snack');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  /* Fix iOS Safari viewport height jumping from URL bar show/hide */
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const toggleOrder = () => setOrderOpen(v => !v);

  const addToCart = (item: MenuItemType) => {
    setCartItems(prev => {
      const ex = prev.find(c => c.id === item.id);
      return ex
        ? prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
        : [...prev, { id: item.id, title: item.title, price: item.price, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, qty: number) => {
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: qty } : i).filter(i => i.quantity > 0)
    );
  };

  useEffect(() => {
    setMenuItems([
      { id: 'snack-001', category: 'snack', title: "🇰🇷 '두부김치'의 유혹", description: '빠져나올 수 없는 두부김치의 유혹', price: 16000, change: '+15.2%', trend: 'up', marketCap: '$50M', volume: '높음', volatility: '높음', investment: '즉시 체포', isSoldOut: false },
      { id: 'snack-002', category: 'snack', title: "🇨🇳 火려한 불맛 '고추잡채'", description: '매콤한 불맛 고추잡채', price: 20000, change: '+12.8%', trend: 'up', marketCap: '$45M', volume: '높음', volatility: '중간', investment: '체포 권장', isSoldOut: false },
      { id: 'snack-003', category: 'snack', title: "🇯🇵 일본으로 '가라아게'", description: '바삭바삭 일본식 가라아게', price: 18000, change: '-3.5%', trend: 'down', marketCap: '$35M', volume: '중간', volatility: '낮음', investment: '감시 중', isSoldOut: false },
      { id: 'beverage-001', category: 'beverage', title: "🇺🇸 '맥엔치즈' 플리즈", description: '맥엔치즈 주세요', price: 10000, change: '+5.2%', trend: 'up', marketCap: '$20M', volume: '중간', volatility: '낮음', investment: '체포 권장', isSoldOut: false },
      { id: 'beverage-002', category: 'beverage', title: "🇪🇸 마드리드 'KHU러스'", description: '스페인 본토의 맛 츄러스', price: 7000, change: '+7.1%', trend: 'up', marketCap: '$25M', volume: '높음', volatility: '높음', investment: '즉시 체포', isSoldOut: false },
      { id: 'beverage-003', category: 'beverage', title: "🇷🇺 외대의 소리.. '연어 볼리니'", description: '크레페에 크림치즈와 연어를 곁들인 러시아식 핑거푸드', price: 10000, change: '+3.8%', trend: 'up', marketCap: '$15M', volume: '낮음', volatility: '낮음', investment: '감시 중', isSoldOut: false },
      { id: 'beverage-004', category: 'beverage', title: "🇫🇷 '에스까르고 바게트'(feat.골뱅이)", description: '바게트 위에 골뱅이를 얹은 프랑스식 바게트', price: 8000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
      { id: 'beverage-005', category: 'beverage', title: '제로콜라', description: '', price: 3000, change: '', trend: 'down', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
      { id: 'beverage-007', category: 'beverage', title: '사이다', description: '', price: 3000, change: '', trend: 'down', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
      { id: 'beverage-008', category: 'beverage', title: '물', description: '', price: 2000, change: '', trend: 'down', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
    ]);
  }, []);

  const filtered = menuItems.filter(i => i.id.startsWith(activeCategory));

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'var(--app-height, 100dvh)', maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
      <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />

      {/* Sticky tabs */}
      <div
        ref={tabsRef}
        style={{
          position: 'sticky',
          top: '56px',
          zIndex: 20,
          background: 'rgba(242,244,246,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transform: 'translateZ(0)',   /* GPU compositing — prevents jitter */
          willChange: 'transform',
        }}
      >
        <MenuTab activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* Menu list */}
      <main style={{ padding: '4px 16px calc(100px + env(safe-area-inset-bottom, 0px))' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 24px', color: 'var(--text-dim)', fontSize: '14px' }}>
            준비 중이에요
          </div>
        )}
        <div key={activeCategory} className="animate-fade-in">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              style={{ animation: `slide-up 0.28s cubic-bezier(.34,1.56,.64,1) ${idx * 40}ms both` }}
            >
              <MenuItem
                item={item}
                addToCart={addToCart}
                cartQuantity={cartItems.find(c => c.id === item.id)?.quantity ?? 0}
                updateCartItem={updateCartQuantity}
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <CartModal
        isOpen={orderOpen}
        toggleOrder={toggleOrder}
        cartItems={cartItems}
        cartTotal={cartTotal}
        cartCount={cartCount}
        updateCartItem={updateCartQuantity}
      />

      <OrderBar cartCount={cartCount} cartTotal={cartTotal} onOpen={toggleOrder} />
    </div>
  );
};

export default App;
