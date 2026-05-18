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
  const [activeCategory, setActiveCategory] = useState<'main' | 'side' | 'set' | 'drink'>('main');
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
      // 메인
      { id: 'main-001', category: 'main', emoji: '🍱', thumbBg: '#FFF3E0', title: '보릿고개도 견디게 한 든든 옛날 도시락', description: '옛날도시락', price: 20000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '즉시 체포', isSoldOut: false },
      { id: 'main-002', category: 'main', emoji: '🍜', thumbBg: '#FFEBEE', title: '시장통 끝에서 호호 불던 김치우동', description: '김치우동', price: 18000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '체포 권장', isSoldOut: false },
      { id: 'main-003', category: 'main', emoji: '🍗', thumbBg: '#FFF8E1', title: '잔칫날에나 올라오던 양념닭강정', description: '양념닭강정', price: 18000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '체포 권장', isSoldOut: false },
      // 사이드
      { id: 'side-001', category: 'side', emoji: '🍿', thumbBg: '#FFFDE7', title: '구멍가게 앞 한 봉지 라면땅', description: '라면땅', price: 7000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
      { id: 'side-002', category: 'side', emoji: '🍑', thumbBg: '#FFF9C4', title: '찬물에 담가두고 먹던 황도 통조림', description: '황도', price: 7000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
      { id: 'side-003', category: 'side', emoji: '🍥', thumbBg: '#F3E5F5', title: '사촌당숙 졸라 얻은 용돈으로 산 라면', description: '컵라면', price: 5000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
      { id: 'side-004', category: 'side', emoji: '🦑', thumbBg: '#E0F7FA', title: '우리 아부지 막걸리상 단골 버터오징어', description: '버터오징어', price: 10000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '감시 중', isSoldOut: false },
      // 세트
      { id: 'set-001', category: 'set', emoji: '🍽️', thumbBg: '#FCE4EC', title: '어머니 손맛 저녁상 한 끼', description: '옛날도시락 + 컵라면', price: 23000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '즉시 체포', isSoldOut: false },
      { id: 'set-002', category: 'set', emoji: '🥢', thumbBg: '#E8EAF6', title: '시장 포장마차 단골상', description: '김치우동 + 버터오징어', price: 25000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '수배 중', isSoldOut: false },
      // 음료
      { id: 'drink-001', category: 'drink', emoji: '💧', thumbBg: '#E3F2FD', title: '물', description: '', price: 2000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
      { id: 'drink-002', category: 'drink', emoji: '🍫', thumbBg: '#EFEBE9', title: '초코에몽', description: '', price: 3000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
      { id: 'drink-003', category: 'drink', emoji: '🥤', thumbBg: '#F1F8E9', title: '콜라 / 사이다', description: '', price: 3000, change: '', trend: 'up', marketCap: '', volume: '', volatility: '', investment: '', isSoldOut: false },
    ]);
  }, []);

  const filtered = menuItems.filter(i => i.category === activeCategory);

  return (
    <div style={{ background: '#F2F4F6', minHeight: '100dvh', maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
      <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />

      {/* 카테고리 탭 (sticky) */}
      <div
        ref={tabsRef}
        style={{
          position: 'sticky',
          top: '56px',
          zIndex: 20,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <MenuTab activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* 메뉴 목록 */}
      <main style={{ padding: '16px 16px calc(100px + env(safe-area-inset-bottom, 0px))' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 24px', color: '#B0B8C1', fontSize: '14px' }}>
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
