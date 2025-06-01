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
      ]);
  }, []);

  const filteredMenu = menuItems.filter(item => item.id.startsWith(activeCategory));

  return (
    <div className="w-full flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-md relative">
        <Header cartCount={cartCount} cartTotal={cartTotal} toggleOrder={toggleOrder} />
        
        <main className="px-4 py-6">
          <div className="mb-4 bg-blue-600 text-white rounded-lg p-3 shadow">
            <h2 className="text-lg font-bold">히어컴퍼니에 입사하신 것을 축하합니다.</h2>
            <p className="text-sm text-blue-100"> 🧾 회계팀(돌다방) ⎮ 💼 영업팀(흡연구역)</p>
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
