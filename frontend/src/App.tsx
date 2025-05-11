import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuTab from './components/MenuTabs';
import MenuItem, { MenuItemType } from './components/MenuItem';
import CartModal from './components/CartModal';
import Footer from './components/Footer';
import { CartItem } from './components/OrderForm';
import './Styles/custom.css';
import './Styles/index.css';
const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('안주');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  
  // 카트 합계 계산
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // 주문서 토글
  const toggleOrder = () => {
    setOrderOpen(!orderOpen);
  };
  
  // 장바구니에 상품 추가
  const addToCart = (item: MenuItemType) => {
    setCartItems(prev => {
      // 장바구니에 이미 있는지 확인
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // 이미 있으면 수량만 증가
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // 새 아이템 추가
        return [...prev, {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: 1,
          image: item.image
        }];
      }
    });
  };
  
  // 메뉴 데이터 로드 (실제 앱에서는 API에서 가져올 수 있음)
  useEffect(() => {
    // 예시 메뉴 아이템
    const exampleMenuItems: MenuItemType[] = [
      // 안주 메뉴
      {
        id: 'snack1',
        title: '모듬 소세지',
        description: '특제 소스와 함께하는 다양한 소세지 플래터',
        price: 12000,
        image: 'https://via.placeholder.com/400x400?text=소세지',
        stock: 50,
        change: '+4.2%',
        trend: 'up',
        marketCap: '2억원',
        volume: '152개',
        volatility: '중간',
        investment: '적극 매수'
      },
      {
        id: 'snack2',
        title: '감자튀김',
        description: '바삭바삭한 감자튀김과 특별한 디핑 소스',
        price: 8000,
        image: 'https://via.placeholder.com/400x400?text=감자튀김',
        stock: 85,
        change: '+3.7%',
        trend: 'up',
        marketCap: '1.5억원',
        volume: '200개',
        volatility: '낮음',
        investment: '매수'
      },
      {
        id: 'snack3',
        title: '닭강정',
        description: '달콤 매콤한 소스의 바삭한 닭강정',
        price: 15000,
        image: 'https://via.placeholder.com/400x400?text=닭강정',
        stock: 20,
        change: '-2.4%',
        trend: 'down',
        marketCap: '1.8억원',
        volume: '92개',
        volatility: '높음',
        investment: '관망'
      },
      {
        id: 'snack4',
        title: '치킨 버거',
        description: '신선한 야채와 바삭한 치킨 패티의 완벽한 조화',
        price: 9000,
        image: 'https://via.placeholder.com/400x400?text=치킨버거',
        stock: 0,
        change: '-8.5%',
        trend: 'down',
        marketCap: '9천만원',
        volume: '60개',
        volatility: '매우 높음',
        investment: '매도',
        isSoldOut: true
      },
      
      // 음료 메뉴
      {
        id: 'beverage1',
        title: '레몬에이드',
        description: '신선한 레몬으로 만든 시원한 레몬에이드',
        price: 6000,
        image: 'https://via.placeholder.com/400x400?text=레몬에이드',
        stock: 75,
        change: '+2.5%',
        trend: 'up',
        marketCap: '9천만원',
        volume: '180개',
        volatility: '낮음',
        investment: '매수'
      },
      {
        id: 'beverage2',
        title: '아이스티',
        description: '달콤한 홍차와 복숭아 향의 아이스티',
        price: 5000,
        image: 'https://via.placeholder.com/400x400?text=아이스티',
        stock: 90,
        change: '+1.2%',
        trend: 'up',
        marketCap: '8천만원',
        volume: '210개',
        volatility: '매우 낮음',
        investment: '매수'
      },
      {
        id: 'beverage3',
        title: '콜라',
        description: '시원하고 청량한 탄산음료',
        price: 3000,
        image: 'https://via.placeholder.com/400x400?text=콜라',
        stock: 120,
        change: '+0.1%',
        trend: 'up',
        marketCap: '5천만원',
        volume: '300개',
        volatility: '매우 낮음',
        investment: '보유'
      },
      {
        id: 'beverage4',
        title: '사이다',
        description: '상쾌한 시트러스향 탄산음료',
        price: 3000,
        image: 'https://via.placeholder.com/400x400?text=사이다',
        stock: 115,
        change: '+0.3%',
        trend: 'up',
        marketCap: '4천8백만원',
        volume: '280개',
        volatility: '매우 낮음',
        investment: '보유'
      }
    ];
    
    setMenuItems(exampleMenuItems);
  }, []);
  
  // 현재 카테고리에 맞는 메뉴 필터링
  const filteredMenu = menuItems.filter(item => {
    if (activeCategory === '안주') {
      return item.id.startsWith('snack');
    } else {
      return item.id.startsWith('beverage');
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <Header 
        cartCount={cartCount} 
        cartTotal={cartTotal} 
        toggleOrder={toggleOrder} 
      />
      
      {/* 메인 콘텐츠 */}
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 환영 메시지 */}
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 rounded-xl shadow-md text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">히어스톡스에 오신 것을 환영합니다! 📈</h2>
                <p className="text-blue-100 mt-1">
                  메뉴를 주식처럼 거래하는 신개념 음식 주문 플랫폼
                </p>
              </div>
              <div className="hidden md:block">
                <button className="bg-white text-blue-600 font-bold py-2 px-4 rounded-full shadow-sm hover:bg-blue-50 transition-colors">
                  🚨 직원 호출 
                </button>
              </div>
            </div>
          </div>
          
          {/* 실시간 인기 종목 배너 */}
          <div className="mb-6 overflow-hidden">
            <div className="flex items-center mb-3">
              <span className="flex h-3 w-3 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h3 className="text-lg font-bold text-gray-900">실시간 인기 종목</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {menuItems
                .filter(item => item.trend === 'up' || item.investment === '적극 매수')
                .slice(0, 3)
                .map(item => (
                  <div key={item.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-3 flex items-center">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover mr-3" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <div className="flex items-center mt-1">
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.trend === 'up' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.change}
                        </div>
                        <div className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          거래량: {item.volume}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* 메뉴 탭 */}
          <MenuTab 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          {/* 메뉴 리스트 */}
          <div className="space-y-4">
            {filteredMenu.map(item => (
              <MenuItem 
                key={item.id} 
                item={item} 
                addToCart={addToCart} 
              />
            ))}
          </div>
        </div>
      </main>
      
      {/* 푸터 */}
      <Footer />
      
      {/* 주문 모달 */}
      <CartModal 
        isOpen={orderOpen} 
        toggleOrder={toggleOrder} 
        cartItems={cartItems} 
        cartTotal={cartTotal} 
        cartCount={cartCount} 
      />
    </div>
  );
};

export default App;