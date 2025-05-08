import React from 'react';
import { MENU, DRINKS } from '../data/menu';

type Props = {
  quantities: { [key: number]: number };
  totalPrice: number;
  onClose: () => void;
};

export default function CartModal({ quantities, totalPrice, onClose }: Props) {
  const allItems = [...MENU, ...DRINKS];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-80 max-h-[70vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">장바구니</h2>
        {Object.keys(quantities).length === 0 ? (
          <p className="text-center text-gray-500">비어 있습니다</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {Object.entries(quantities).map(([id, qty]) => {
              const item = allItems.find(i => i.id === Number(id));
              return item ? (
                <li key={id} className="flex justify-between">
                  <span>{item.name} x {qty}</span>
                  <span>{(item.price * qty).toLocaleString()}원</span>
                </li>
              ) : null;
            })}
          </ul>
        )}
        <div className="flex justify-between font-bold mb-4">
          <span>총 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <button
          className="w-full py-2 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-white rounded mb-2"
          onClick={onClose}
        >
          닫기
        </button>
        <button
          className="w-full py-2 border border-[#ff7e5f] text-[#ff7e5f] rounded"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
