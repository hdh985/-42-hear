import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuTab from './components/MenuTabs';
import MenuItem, { MenuItemType } from './components/MenuItem';
import CartModal from './components/CartModal';
import { CartItem } from './components/OrderForm';
import './Styles/index.css';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('snack');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleOrder = () => setOrderOpen(!orderOpen);

  const addToCart = (item: MenuItemType) => {
    setCartItems(prev => {
      const existing = prev.find(cart => cart.id === item.id);
      return existing
        ? prev.map(cart => cart.id === item.id ? { ...cart, quantity: cart.quantity + 1 } : cart)
        : [...prev, { id: item.id, title: item.title, price: item.price, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prev =>
      prev
        .map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item)
        .filter(item => item.quantity > 0)
    );
  };

  useEffect(() => {
    setMenuItems([
      // 고액 현상범 (snack)
      {
        id: 'snack-001',
        category : 'snack',
        title: "밤이 되었습니다 '닭강정'",
        description: '보안관도 밤에 벌떡 일어나 먹을 맛',
        price: 20000,
        change: '+15.2%',
        trend: 'up' as const,
        marketCap: '$50M',
        volume: '높음',
        volatility: '높음',
        investment: '즉시 체포',
        isSoldOut: false
      },
      {
        id: 'snack-002',
        category : 'snack',
        title: "대포 ‘알밥주먹밥’ 소리에 눈이 번 ‘떡갈비’",
        description: '대포소리만큼 맛있는 떡갈비',
        price: 22000,
        change: '+12.8%',
        trend: 'up' as const,
        marketCap: '$45M',
        volume: '높음',
        volatility: '중간',
        investment: '체포 권장',
        isSoldOut: false
      },
      {
        id: 'snack-003',
        category : 'snack',
        title: "두두두두 ‘두부김치’",
        description: '이것은 입에서 나는 소리가 아니여 두부 김치',
        price: 18000,
        change: '-3.5%',
        trend: 'down' as const,
        marketCap: '$35M',
        volume: '중간',
        volatility: '낮음',
        investment: '감시 중',
        isSoldOut: false
      },
      {
        id: 'snack-004',
        category : 'snack',
        title: "웰컴 투 '에그인헬'",
        description: "지옥에서도 잘 팔릴 카우보이 픽",
        price: 20000,
        change: '+8.7%',
        trend: 'up' as const,
        marketCap: '$40M',
        volume: '중간',
        volatility: '중간',
        investment: '체포 권장',
        isSoldOut: false
      },
      
      // 소액 현상범 (beverage)
      {
        id: 'beverage-001',
        category : 'beverage',
        title: "’계란 탕‘탕탕",
        description: '계란 탕후루 룩',
        price: 10000,
        change: '+5.2%',
        trend: 'up' as const,
        marketCap: '$20M',
        volume: '중간',
        volatility: '낮음',
        investment: '체포 권장',
        isSoldOut: false
      },
      {
        id: 'beverage-002',
        category : 'beverage',
        title: "강도가 훔쳐간 ‘황도’",
        description: '눈물도 훔치며 먹을 맛',
        price: 10000,
        change: '+7.1%',
        trend: 'up' as const,
        marketCap: '$25M',
        volume: '높음',
        volatility: '높음',
        investment: '즉시 체포',
        isSoldOut: false
      },
      {
        id: 'beverage-003',
        category : 'beverage',
        title: "’묵사발‘을 내주겠어.",
        description: '완전한 묵사발',
        price: 15000,
        change: '+3.8%',
        trend: 'up' as const,
        marketCap: '$15M',
        volume: '낮음',
        volatility: '낮음',
        investment: '감시 중',
        isSoldOut: false
      },
      {
        id: 'beverage-004',
        category : 'beverage',
        title: "[속보] ’설탕‘ 공장에서 ’토메이토‘ 발생",
        description: '토마토에 설탕 추가',
        price: 10000,
        change: '-1.2%',
        trend: 'down' as const,
        marketCap: '$18M',
        volume: '낮음',
        volatility: '중간',
        investment: '수배 중',
        isSoldOut: false
      },
      {
        id: 'beverage-005',
        category : 'beverage',
        title: "제로콜라",
        description: '',
        price: 3000,
        change: '-1.2%',
        trend: 'down' as const,
        marketCap: '$18M',
        volume: '낮음',
        volatility: '중간',
        investment: '수배 중',
        isSoldOut: false
      },
      {
        id: 'beverage-006',
        category : 'beverage',
        title: "콜라",
        description: '',
        price: 3000,
        change: '-1.2%',
        trend: 'down' as const,
        marketCap: '$18M',
        volume: '낮음',
        volatility: '중간',
        investment: '수배 중',
        isSoldOut: false
      },
      {
        id: 'beverage-007',
        category : 'beverage',
        title: "사이다",
        description: '',
        price: 3000,
        change: '-1.2%',
        trend: 'down' as const,
        marketCap: '$18M',
        volume: '낮음',
        volatility: '중간',
        investment: '수배 중',
        isSoldOut: false
      },
      {
        id: 'beverage-008',
        category : 'beverage',
        title: "물",
        description: '',
        price: 2000,
        change: '-1.2%',
        trend: 'down' as const,
        marketCap: '$18M',
        volume: '낮음',
        volatility: '중간',
        investment: '수배 중',
        isSoldOut: false
      }
    ]);
  }, []);

  const filteredMenu = menuItems.filter(item => item.id.startsWith(activeCategory));

  return (
    <div 
      className="w-full flex justify-center min-h-screen relative overflow-hidden bg-white"
    >
      


      <div className="w-full max-w-md bg-gradient-to-b from-amber-50 to-amber-100 border-8 border-amber-900 overflow-hidden shadow-2xl relative z-10 min-h-screen"
           style={{
             backgroundImage: `
               radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
               linear-gradient(45deg, rgba(160, 82, 45, 0.03) 25%, transparent 25%, transparent 75%, rgba(160, 82, 45, 0.03) 75%)
             `,
             backgroundSize: '100px 100px, 30px 30px'
           }}>
        
        {/* 상단 장식 테두리 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800 z-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
        </div>

        {/* 못 장식 */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-amber-800 rounded-full shadow-inner border-2 border-amber-900 z-20"></div>
        <div className="absolute top-4 right-4 w-3 h-3 bg-amber-800 rounded-full shadow-inner border-2 border-amber-900 z-20"></div>

        <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />
        
        <main className="px-6 py-4 relative z-10">
          
          
          <MenuTab activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          <div className="space-y-6">
            {filteredMenu.length === 0 && (
              <div className="text-center p-8 text-amber-700 font">
                <p>현재 선택된 카테고리에 현상범이 없습니다.</p>
                <p className="text-sm mt-2">전체 메뉴 개수: {menuItems.length}</p>
                <p className="text-sm">필터된 메뉴: {filteredMenu.length}</p>
                <p className="text-sm">활성 카테고리: {activeCategory}</p>
              </div>
            )}
            {filteredMenu.map(item => (
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
        
        {/* 하단 주문 바 - 서부 스타일 */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto">
            <div 
              className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 border-4 border-amber-900 border-b-0 shadow-2xl relative overflow-hidden"
              style={{
                clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 100%, 0 100%)'
              }}
            >
              
              {/* 배경 패턴 */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 8px,
                      rgba(255,255,255,0.1) 8px,
                      rgba(255,255,255,0.1) 16px
                    )
                  `
                }}
              ></div>

              <div className="p-4 flex justify-between items-center relative z-10">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-yellow-300 text-lg">🎯</span>
                    <span className="text-amber-200 text-sm font font-semibold">
                      총 {cartCount}개 담음
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-green-400 text-sm">💰</span>
                    <span className="text-green-300 font-bold text-xl font">
                      ₩{cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={toggleOrder}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-100 font-bold fontㄴ px-6 py-3 border-4 border-amber-700 hover:border-amber-600 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  주문하기
                </button>
              </div>

              {/* 하단 장식 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-900 via-yellow-600 to-amber-900">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
              </div>
            </div>
          </div>
        )}

        {/* 하단 못 장식 */}
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-amber-800 rounded-full shadow-inner border-2 border-amber-900 z-20"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 bg-amber-800 rounded-full shadow-inner border-2 border-amber-900 z-20"></div>
      </div>

      {/* 배경 그림자 효과 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-8 bg-black opacity-20 blur-xl pointer-events-none"></div>
    </div>
  );
};

export default App;