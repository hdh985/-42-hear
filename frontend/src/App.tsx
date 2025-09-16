import React, { useEffect, useState } from 'react';
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

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleOrder = () => setOrderOpen((v) => !v);

  const addToCart = (item: MenuItemType) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      return existing
        ? prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
        : [...prev, { id: item.id, title: item.title, price: item.price, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Demo data (unchanged semantics)
  useEffect(() => {
    setMenuItems([
      // 고액 현상범 (snack)
      {
        id: 'snack-001',
        category: 'snack',
        title: "밤이 되었습니'닭강정'",
        description: '보안관도 밤에 벌떡 일어나 먹을 맛',
        price: 20000,
        change: '+15.2%',
        trend: 'up',
        marketCap: '$50M',
        volume: '높음',
        volatility: '높음',
        investment: '즉시 체포',
        isSoldOut: false,
      },
      {
        id: 'snack-002',
        category: 'snack',
        title: "대포 ‘알밥주먹밥’ 소리에 눈이 번 ‘떡갈비’(판매종료)",
        description: '대포소리만큼 맛있는 떡갈비',
        price: 22000,
        change: '+12.8%',
        trend: 'up',
        marketCap: '$45M',
        volume: '높음',
        volatility: '중간',
        investment: '체포 권장',
        isSoldOut: true,
      },
      {
        id: 'snack-003',
        category: 'snack',
        title: "두두두두 ‘두부김치’",
        description: '이것은 입에서 나는 소리가 아니여 두부 김치',
        price: 18000,
        change: '-3.5%',
        trend: 'down',
        marketCap: '$35M',
        volume: '중간',
        volatility: '낮음',
        investment: '감시 중',
        isSoldOut: false,
      },
      {
        id: 'snack-004',
        category: 'snack',
        title: "웰컴 투 '에그인헬'(판매종료)",
        description: '지옥에서도 잘 팔릴 카우보이 픽',
        price: 20000,
        change: '+8.7%',
        trend: 'up',
        marketCap: '$40M',
        volume: '중간',
        volatility: '중간',
        investment: '체포 권장',
        isSoldOut: true,
      },

      // 소액 현상범 (beverage)
      {
        id: 'beverage-001',
        category: 'beverage',
        title: '’계란 탕‘탕탕(판매종료)',
        description: '계란 탕후루 룩',
        price: 10000,
        change: '+5.2%',
        trend: 'up',
        marketCap: '$20M',
        volume: '중간',
        volatility: '낮음',
        investment: '체포 권장',
        isSoldOut: true,
      },
      {
        id: 'beverage-002',
        category: 'beverage',
        title: "강도가 훔쳐간 ‘황도’",
        description: '눈물도 훔치며 먹을 맛',
        price: 10000,
        change: '+7.1%',
        trend: 'up',
        marketCap: '$25M',
        volume: '높음',
        volatility: '높음',
        investment: '즉시 체포',
        isSoldOut: false,
      },
      {
        id: 'beverage-003',
        category: 'beverage',
        title: '’묵사발‘을 내주겠어.',
        description: '완전한 묵사발',
        price: 15000,
        change: '+3.8%',
        trend: 'up',
        marketCap: '$15M',
        volume: '낮음',
        volatility: '낮음',
        investment: '감시 중',
        isSoldOut: false,
      },
      {
        id: 'beverage-004',
        category: 'beverage',
        title: "[속보] ’설탕‘ 공장에서 ’토메이토‘ 발생",
        description: '토마토에 설탕 추가',
        price: 10000,
        change: '-1.2%',
        trend: 'down',
        marketCap: '$18M',
        volume: '낮음',
        volatility: '중간',
        investment: '수배 중',
        isSoldOut: false,
      },
      { id: 'beverage-005', category: 'beverage', title: '제로콜라', description: '', price: 3000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
      { id: 'beverage-006', category: 'beverage', title: '콜라', description: '', price: 3000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
      { id: 'beverage-007', category: 'beverage', title: '사이다', description: '', price: 3000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
      { id: 'beverage-008', category: 'beverage', title: '물', description: '', price: 2000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
    ]);
  }, []);

  const filteredMenu = menuItems.filter((item) => item.id.startsWith(activeCategory));

  return (
    <div className="relative flex min-h-[100dvh] w-full justify-center overflow-hidden bg-neutral-50">
      {/* Soft vignette background (lighter, less noise) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(60% 40% at 50% 0%, rgba(180, 83, 9, 0.10) 0%, rgba(0,0,0,0) 70%), radial-gradient(40% 30% at 0% 100%, rgba(146, 64, 14, 0.10) 0%, rgba(0,0,0,0) 70%), radial-gradient(40% 30% at 100% 100%, rgba(146, 64, 14, 0.08) 0%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Phone frame */}
      <div
        className="relative z-10 min-h-[100dvh] w-full max-w-md border-8 border-amber-900/90 bg-amber-50/95 backdrop-blur-sm shadow-[0_25px_80px_-20px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(250, 240, 203, 0.55) 0%, rgba(250, 240, 203, 0.25) 100%), repeating-linear-gradient(45deg, rgba(120, 53, 15, 0.035) 0 12px, transparent 12px 24px)',
        }}
      >
        {/* Top trim */}
        <div className="absolute left-0 right-0 top-0 z-20 h-2 bg-gradient-to-r from-amber-900 via-yellow-600 to-amber-900">
          <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />
        </div>

        {/* Nail accents */}
        <div className="absolute left-4 top-4 z-20 h-3 w-3 rounded-full border-2 border-amber-950 bg-amber-900 shadow-inner" />
        <div className="absolute right-4 top-4 z-20 h-3 w-3 rounded-full border-2 border-amber-950 bg-amber-900 shadow-inner" />

        <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />

        <main className="relative z-10 px-5 pt-4 pb-[6.5rem] sm:px-6">
          <MenuTab activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          <div className="space-y-5">
            {filteredMenu.length === 0 && (
              <div className="rounded-lg border border-amber-200 bg-white/70 p-6 text-center text-amber-800 shadow-sm">
                <p className="font-semibold">현재 선택된 카테고리에 현상범이 없습니다.</p>
                <p className="mt-2 text-xs opacity-70">전체 메뉴: {menuItems.length} • 필터된 메뉴: {filteredMenu.length}</p>
                <p className="text-xs opacity-70">활성 카테고리: {activeCategory}</p>
              </div>
            )}

            {filteredMenu.map((item) => (
              <MenuItem key={item.id} item={item} addToCart={addToCart} />
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

        {/* NOTE: 하단 요약 바는 포털로 body에 붙음 */}
        <OrderBar cartCount={cartCount} cartTotal={cartTotal} onOpen={toggleOrder} />

        {/* Bottom nail accents */}
        <div className="absolute bottom-4 left-4 z-20 h-3 w-3 rounded-full border-2 border-amber-950 bg-amber-900 shadow-inner" />
        <div className="absolute bottom-4 right-4 z-20 h-3 w-3 rounded-full border-2 border-amber-950 bg-amber-900 shadow-inner" />
      </div>

      {/* Soft floor shadow */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 h-8 w-1/2 -translate-x-1/2 bg-black/30 blur-xl" />
    </div>
  );
};

export default App;
