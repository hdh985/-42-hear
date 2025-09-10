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
        title: '빌리 더 키드',
        description: '서부 최고의 총잡이, 21세에 21명을 죽였다는 전설',
        price: 25000,
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
        title: '제시 제임스',
        description: '악명 높은 은행강도 두목, 제임스 갱단의 리더',
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
        title: '와일드 빌 히콕',
        description: '전설적인 건슬링어, 데드맨스 핸드의 주인',
        price: 28000,
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
        title: '부치 캐시디',
        description: '와일드 번치 갱단의 리더, 지능적인 강도',
        price: 24000,
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
        title: '선댄스 키드',
        description: '부치 캐시디의 오른팔, 빠른 총잡이',
        price: 15000,
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
        title: '독 홀리데이',
        description: '와이어트 어프의 친구이자 위험한 갬블러',
        price: 18000,
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
        title: '애니 오클리',
        description: '백발백중의 여성 저격수, 버팔로 빌 쇼의 스타',
        price: 12000,
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
        title: '칼라미티 제인',
        description: '거친 서부의 여성 개척자, 와일드 빌의 연인',
        price: 16000,
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
        title: '블랙 바트',
        description: '시를 남기는 신사 강도, 28번의 역마차 강도',
        price: 14000,
        change: '+4.5%',
        trend: 'up' as const,
        marketCap: '$12M',
        volume: '중간',
        volatility: '중간',
        investment: '체포 권장',
        isSoldOut: false
      },
      {
        id: 'beverage-006',
        title: '킷 카슨',
        description: '유명한 스카우트이자 인디언 파이터',
        price: 13000,
        change: '+2.3%',
        trend: 'up' as const,
        marketCap: '$10M',
        volume: '낮음',
        volatility: '낮음',
        investment: '감시 중',
        isSoldOut: false
      },
      {
        id: 'beverage-007',
        title: '벨 스타',
        description: '여성 무법자의 여왕, 말도둑과 강도의 대모',
        price: 17000,
        change: '-2.8%',
        trend: 'down' as const,
        marketCap: '$22M',
        volume: '중간',
        volatility: '높음',
        investment: '체포 완료',
        isSoldOut: true
      },
      {
        id: 'beverage-008',
        title: '와이어트 어프',
        description: '전설적인 보안관, 툼스톤의 법과 질서',
        price: 19000,
        change: '+6.9%',
        trend: 'up' as const,
        marketCap: '$28M',
        volume: '높음',
        volatility: '중간',
        investment: '즉시 체포',
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
          
          {/* 환영 메시지 - 서부 스타일 */}
          <div className="mb-6 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-amber-100 border-4 border-amber-600 shadow-2xl relative overflow-hidden"
               style={{
                 clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
               }}>
            
            {/* 배경 패턴 */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,255,255,0.1) 10px,
                    rgba(255,255,255,0.1) 20px
                  ),
                  radial-gradient(circle at 30% 70%, rgba(255,255,0,0.1) 0%, transparent 50%)
                `
              }}
            ></div>

            <div className="p-4 relative z-10">
              <div className="text-center mb-3">
                <h2 className="text-xl font-bold font-serif text-yellow-300 mb-2" 
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                ⌜ 히어스턴스에 합류하신 것을 
                </h2>
                <h2 className="text-xl font-bold font-serif text-yellow-300 mb-2" 
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                  환영합니다!⌟ 
                </h2>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center bg-amber-950 bg-opacity-50 px-3 py-1 border-2 border-amber-600 border-dashed">
                    <span className="text-yellow-400 mr-1">⚖️</span>
                    <span className="font-serif text-amber-200">보안관</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-serif text-amber-200">VS </span>
                  </div>
                  <div className="flex items-center bg-amber-950 bg-opacity-50 px-3 py-1 border-2 border-amber-600 border-dashed">
                    <span className="text-yellow-400 mr-1">🦹🏻</span>
                    <span className="font-serif text-amber-200">GANG </span>
                  </div>
                </div>
              </div>
              
              {/* 추가 서부 장식 */}
              <div className="flex items-center justify-center space-x-2 mt-3 pt-3 border-t-2 border-amber-600 border-dotted">
                <div className="w-8 h-px bg-amber-500"></div>
                <span className="text-yellow-400 text-sm">⭐ 현상금 사냥을 시작하세요 ⭐</span>
                <div className="w-8 h-px bg-amber-500"></div>
              </div>
            </div>
          </div>

          <MenuTab activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          <div className="space-y-6">
            {filteredMenu.length === 0 && (
              <div className="text-center p-8 text-amber-700 font-serif">
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
                    <span className="text-amber-200 text-sm font-serif font-semibold">
                      총 {cartCount}명 체포
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-green-400 text-sm">💰</span>
                    <span className="text-green-300 font-bold text-xl font-serif">
                      ₩{cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={toggleOrder}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-100 font-bold font-serif px-6 py-3 border-4 border-amber-700 hover:border-amber-600 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  현상금 수령
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