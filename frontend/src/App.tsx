import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuTab from './components/MenuTabs'; // 기존 경로 유지
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

  // Demo data
  useEffect(() => {
    setMenuItems([
      // snack
      {
        id: 'snack-001',
        category: 'snack',
        title: "🇰🇷 '두부김치'의 유혹",
        description: '빠져나올 수 없는 두부김치의 유혹',
        price: 16000,
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
        title: "🇨🇳 火려한 불맛 '고추잡채'",
        description: '매콤한 불맛 고추잡채',
        price: 20000,
        change: '+12.8%',
        trend: 'up',
        marketCap: '$45M',
        volume: '높음',
        volatility: '중간',
        investment: '체포 권장',
        isSoldOut: false,
      },
      {
        id: 'snack-003',
        category: 'snack',
        title: "🇯🇵 일본으로 '가라아게'",
        description: '바삭바삭 일본식 가라아게',
        price: 18000,
        change: '-3.5%',
        trend: 'down',
        marketCap: '$35M',
        volume: '중간',
        volatility: '낮음',
        investment: '감시 중',
        isSoldOut: false,
      },
    

      // beverage
      {
        id: 'beverage-001',
        category: 'beverage',
        title: "🇺🇸 '맥엔치즈' 플리즈",
        description: '맥엔치즈 주세요',
        price: 10000,
        change: '+5.2%',
        trend: 'up',
        marketCap: '$20M',
        volume: '중간',
        volatility: '낮음',
        investment: '체포 권장',
        isSoldOut: false,
      },
      {
        id: 'beverage-002',
        category: 'beverage',
        title: "🇪🇸 마드리드 'KHU러스'",
        description: '스페인 본토의 맛 츄러스',
        price: 7000,
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
        title: "🇷🇺 외대의 소리.. 들리니? '연어 볼리니'",
        description: '그대 살아 숨쉬는 한 연어 볼리니',
        price: 10000,
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
        title: "🇫🇷 '에스까르고 바게트'(feat.골뱅이)",
        description: '토마토에 설탕 추가',
        price: 8000,
        change: '-1.2%',
        trend: 'down',
        marketCap: '$18M',
        volume: '낮음',
        volatility: '중간',
        investment: '수배 중',
        isSoldOut: false,
      },
      { id: 'beverage-005', category: 'beverage', title: '제로콜라', description: '', price: 3000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
      { id: 'beverage-007', category: 'beverage', title: '사이다', description: '', price: 3000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
      { id: 'beverage-008', category: 'beverage', title: '물', description: '', price: 2000, change: '-1.2%', trend: 'down', marketCap: '$18M', volume: '낮음', volatility: '중간', investment: '수배 중', isSoldOut: false },
    ]);
  }, []);

  const filteredMenu = menuItems.filter((item) => item.id.startsWith(activeCategory));

  return (
    <div
      className="relative flex min-h-[100dvh] w-full justify-center overflow-hidden bg-white"
      style={{
        // 라이트 배경: 살짝 쿨한 화이트 그라데이션 + 매우 옅은 스카이 글로우
        backgroundImage: `
          radial-gradient(60% 40% at 50% 0%, rgba(56,189,248,0.08) 0%, rgba(0,0,0,0) 70%),
          linear-gradient(180deg, #ffffff 0%, #fbfbfc 40%, #f7f8fa 100%)
        `
      }}
    >
      {/* 미세 비네트 (웜 뉴트럴) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-12"
        style={{
          backgroundImage:
            'radial-gradient(40% 30% at 0% 100%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 70%), radial-gradient(40% 30% at 100% 100%, rgba(0,0,0,0.035) 0%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Phone frame: 아주 밝은 카드 프레임(쿨 그레이) */}
      <div
        className="relative z-10 min-h-[100dvh] w-full max-w-md border-8 border-neutral-200 bg-white/95 backdrop-blur-[2px] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.18)]"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.96) 100%)'
        }}
      >
        {/* 상단 라인: 스카이→엠버 미묘한 포인트 (헤더/오더바와 조화) */}
        <div className="absolute left-0 right-0 top-0 z-20 h-2 bg-gradient-to-r from-sky-200 via-amber-200 to-sky-200">
          <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>

        {/* 라이트 리벳 */}
        <div className="absolute left-4 top-4 z-20 h-3 w-3 rounded-full border-2 border-neutral-300 bg-neutral-200 shadow-inner" />
        <div className="absolute right-4 top-4 z-20 h-3 w-3 rounded-full border-2 border-neutral-300 bg-neutral-200 shadow-inner" />

        <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />

        <main className="relative z-10 px-5 pt-4 pb-[6.5rem] sm:px-6">
          {/* 스크림 패널: 라이트 스카이 틴트(아주 옅음)로 주변과 톤 매칭 */}
          <div className="rounded-2xl border border-neutral-200 bg-white/90 p-3 backdrop-blur">
            <MenuTab activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            <div className="mt-3 space-y-5">
              {filteredMenu.length === 0 && (
                <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-neutral-700 shadow-sm">
                  <p className="font-semibold">선택된 카테고리에 노선이 없습니다.</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    전체 노선: {menuItems.length} • 현재 노선: {filteredMenu.length}
                  </p>
                  <p className="text-xs text-neutral-500">활성 카테고리: {activeCategory}</p>
                </div>
              )}

              {filteredMenu.map((item) => (
                <MenuItem key={item.id} item={item} addToCart={addToCart} />
              ))}
            </div>
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

        {/* 하단 요약 바는 포털로 body에 붙음 */}
        <OrderBar cartCount={cartCount} cartTotal={cartTotal} onOpen={toggleOrder} />

        {/* 하단 리벳 */}
        <div className="absolute bottom-4 left-4 z-20 h-3 w-3 rounded-full border-2 border-neutral-300 bg-neutral-200 shadow-inner" />
        <div className="absolute bottom-4 right-4 z-20 h-3 w-3 rounded-full border-2 border-neutral-300 bg-neutral-200 shadow-inner" />
      </div>

      {/* 바닥 그림자(라이트) */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 h-8 w-1/2 -translate-x-1/2 bg-black/5 blur-xl" />
    </div>
  );
};

export default App;
