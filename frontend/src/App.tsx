import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuTab from './components/MenuTabs';
import MenuItem, { MenuItemType } from './components/MenuItem';
import CartModal from './components/CartModal';
import OrderBar from './components/OrderBar';
import { CartItem } from './components/OrderForm';
import { MENU_ITEMS } from './data/menuItems';
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

  // 초기 메뉴 로드
  useEffect(() => { setMenuItems(MENU_ITEMS); }, []);

  // 솔드아웃 상태 폴링 (30초마다)
  useEffect(() => {
    const apply = (soldoutIds: string[]) => {
      const set = new Set(soldoutIds);
      setMenuItems(MENU_ITEMS.map(item => ({ ...item, isSoldOut: set.has(item.id) })));
    };
    const fetch = () =>
      axios.get<string[]>(`${process.env.REACT_APP_API_BASE_URL}/api/menu/soldout`)
        .then(r => apply(r.data))
        .catch(() => {});
    fetch();
    const t = setInterval(fetch, 30000);
    return () => clearInterval(t);
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
