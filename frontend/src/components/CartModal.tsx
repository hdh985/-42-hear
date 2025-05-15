import React from 'react';
import OrderForm, { CartItem } from './OrderForm';

interface CartModalProps {
  isOpen: boolean;
  toggleOrder: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  updateCartItem: (itemId: string, quantity: number) => void; // ✅ 추가
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  toggleOrder,
  cartItems,
  cartTotal,
  cartCount,
  updateCartItem, // ✅ 전달받기
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 뒷배경 (블러 + 오버레이) */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        onClick={toggleOrder}
      />

      {/* 모달 본체 (모바일 고정) */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto w-full max-w-md bg-white rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          <OrderForm
            cartItems={cartItems}
            cartTotal={cartTotal}
            cartCount={cartCount}
            toggleOrder={toggleOrder}
            updateCartItem={updateCartItem} // ✅ 전달
          />
        </div>
      </div>
    </>
  );
};

export default CartModal;
