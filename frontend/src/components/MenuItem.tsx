import React from 'react';

type Props = {
  item: { id: number; name: string; description: string; price: number };
  quantities: { [key: number]: number };
  updateQty: (id: number, delta: number) => void;
};

export default function MenuItem({ item, quantities, updateQty }: Props) {
  return (
    <div className="menu-item">
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        <div className="item-description">{item.description}</div>
        <div className="item-price">{item.price.toLocaleString()}원</div>
      </div>
      <div className="quantity-control">
        <button className="quantity-btn" onClick={() => updateQty(item.id, -1)}>-</button>
        <input type="number" className="quantity-input" value={quantities[item.id] || 0} readOnly />
        <button className="quantity-btn" onClick={() => updateQty(item.id, 1)}>+</button>
      </div>
    </div>
  );
}
