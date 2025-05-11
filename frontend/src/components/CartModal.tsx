import React from 'react';
// X를 사용하지 않으므로 import에서 제거
import OrderForm, { CartItem } from './OrderForm';

interface CartModalProps {
  isOpen: boolean;
  toggleOrder: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
}

const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, 
  toggleOrder, 
  cartItems, 
  cartTotal, 
  cartCount 
}) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        onClick={toggleOrder}
      />
      
      <div className="fixed inset-x-0 bottom-0 max-h-[90vh] bg-white rounded-t-xl shadow-xl z-50 overflow-y-auto">
        <OrderForm 
          cartItems={cartItems}
          cartTotal={cartTotal}
          cartCount={cartCount}
          toggleOrder={toggleOrder}
        />
      </div>
    </>
  );
};

export default CartModal;