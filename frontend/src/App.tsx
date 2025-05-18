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
      { id: 'snack1', title: "부장님 머리 없 '수육'", description: '훌러덩 훌러덩 넘어가는 부드러운 수육', price: 20000, change: '+7.0%', trend: 'up', marketCap: '134조원', volume: '152개', volatility: '낮음', investment: '적극 매수' },
      { id: 'snack2', title: "이름은 지옥 맛은 천당 '에그인헬'", description: '입에서 퍼지는 천상의 맛', price: 20000,  change: '+4.3%', trend: 'up', marketCap: '78조원', volume: '200개', volatility: '낮음', investment: '매수' },
      { id: 'snack3', title: "내 업무 모두 '닭강정'", description: '업무량만큼 매콤 달콤한 닭강정', price: 20000,  change: '+5.0%', trend: 'up', marketCap: '49조원', volume: '120개', volatility: '중간', investment: '매수' },
      { id: 'snack4', title: "야근할때 먹으면 눈 번'떡갈비'", description: '육즙 가득한 눈 번뜩이는 떡갈비', price: 20000, change: '+4.0%', trend: 'up', marketCap: '64조원', volume: '110개', volatility: '중간', investment: '매수' },
      { id: 'beverage1', title: "죽써서 '묵사발'된 보고서.zip", description: '속 시원해지는 시원한 묵사발', price: 10000, change: '+3.0%', trend: 'up', marketCap: '1332억원', volume: '180개', volatility: '낮음', investment: '매수' },
      { id: 'beverage2', title: '계란처럼 깨진 내 멘탈 탕', description: '가슴속에는 사직서를 입속에는 계란탕을', price: 10000,  change: '+4.0%', trend: 'up', marketCap: '1217억원', volume: '280개', volatility: '매우 낮음', investment: '보유' },
      { id: 'beverage3', title: "부장님 차 사실은 카풀이제(카프레제)?", description: '가벼운 술 안주 카프레제', price: 10000, change: '+3.0%', trend: 'up', marketCap: '68억원', volume: '280개', volatility: '매우 낮음', investment: '보유' },
      { id: 'beverage4', title: "과장님 '셀프 주먹팍(밥)'", description: '대환상 파티의 주먹밥', price: 5000, change: '+0.5%', trend: 'up', marketCap: '34억원', volume: '300개', volatility: '매우 낮음', investment: '보유' },
      { id: 'beverage5', title: "탕탕 후루'후르츠 황도'", description: '우리 부장님 어렸을 적 추억의 황도', price: 5000,  change: '+1.0%', trend: 'up', marketCap: '63억원', volume: '280개', volatility: '매우 낮음', investment: '보유' },
      { id: 'beverage6', title: '자연스럽게 빵 추가', description: '에그인헬에 자연스럽게 슥 추가', price: 3000,  change: '+1.0%', trend: 'up', marketCap: '42억원', volume: '280개', volatility: '매우 낮음', investment: '보유' }
    ]);
  }, []);

  const filteredMenu = menuItems.filter(item => item.id.startsWith(activeCategory));

  return (
    <div className="w-full flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-md relative">
        <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />
        
        <main className="px-4 py-6">
          <div className="mb-4 bg-blue-600 text-white rounded-lg p-3 shadow">
            <h2 className="text-lg font-bold">히어컴퍼니는 술막포차와 함께합니다.</h2>
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
