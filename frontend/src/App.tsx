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
      { id: 'snack1', title: '수육', description: '42시간 삶은 수육', price: 20000, change: '+2.0%', trend: 'up', marketCap: '2억원', volume: '152개', volatility: '중간', investment: '적극 매수' },
      { id: 'snack2', title: '에그인헬', description: '치즈와 토마토 소스 + 빵 추가', price: 20000,  change: '+2.3%', trend: 'up', marketCap: '1.5억원', volume: '200개', volatility: '낮음', investment: '매수' },
      { id: 'snack3', title: '닭강정', description: '달콤 매콤한 닭강정', price: 20000,  change: '+2.0%', trend: 'up', marketCap: '1.2억원', volume: '120개', volatility: '중간', investment: '매수' },
      { id: 'snack4', title: '골뱅이 무침', description: '신선한 골뱅이와 채소', price: 20000, change: '+2.0%', trend: 'up', marketCap: '1억원', volume: '90개', volatility: '중간', investment: '관망' },
      { id: 'snack5', title: '떡갈비', description: '육즙 가득한 떡갈비', price: 20000, change: '+2.0%', trend: 'up', marketCap: '1.3억원', volume: '110개', volatility: '중간', investment: '관망' },
      { id: 'beverage1', title: '묵사발', description: '시원한 묵사발', price: 10000, change: '+1.0%', trend: 'up', marketCap: '9천만원', volume: '180개', volatility: '낮음', investment: '매수' },
      { id: 'beverage2', title: '라면땅', description: '짭짤하고 바삭한 라면땅', price: 5000,  change: '+0.5%', trend: 'up', marketCap: '8천만원', volume: '210개', volatility: '매우 낮음', investment: '매수' },
      { id: 'beverage3', title: '셀프 주먹밥', description: '김과 밥의 조화', price: 5000, change: '+0.5%', trend: 'up', marketCap: '5천만원', volume: '300개', volatility: '매우 낮음', investment: '보유' },
      { id: 'beverage4', title: '카프레제', description: '토마토와 치즈의 조화', price: 10000, change: '+1.0%', trend: 'up', marketCap: '4천8백만원', volume: '280개', volatility: '매우 낮음', investment: '보유' },
      { id: 'beverage5', title: '계란탕', description: '부드러운 계란탕', price: 10000,  change: '+1.0%', trend: 'up', marketCap: '4천8백만원', volume: '280개', volatility: '매우 낮음', investment: '보유' },
    ]);
  }, []);

  const filteredMenu = menuItems.filter(item => item.id.startsWith(activeCategory));

  return (
    <div className="w-full flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-md relative">
        <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />
        
        <main className="px-4 py-6">
          <div className="mb-4 bg-blue-600 text-white rounded-lg p-3 shadow">
            <h2 className="text-lg font-bold">히어컴퍼니는 술막포차와 함께합니다</h2>
            <p className="text-sm text-blue-100">메뉴를 주식처럼 거래하는 신개념 음식 주문 플랫폼</p>
          </div>

          <MenuTab activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          <div className="space-y-4">
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
          updateCartItem={updateCartQuantity} // 수량조절용 prop 추가
        />
        {cartCount > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-40 bg-white shadow-inner border-t p-3 max-w-md mx-auto flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">총 {cartCount}개 매수</span>
              <span className="text-blue-700 font-bold text-lg">₩{cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={toggleOrder}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 text-sm shadow"
            >
              주문하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
