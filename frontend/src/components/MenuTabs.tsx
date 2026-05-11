import React from 'react';

export type CategoryId = 'snack' | 'beverage';

interface MenuTabProps {
  activeCategory: CategoryId;
  setActiveCategory: React.Dispatch<React.SetStateAction<CategoryId>>;
}

const TABS: { id: CategoryId; label: string; emoji: string; count: string }[] = [
  { id: 'snack',    label: '메인 메뉴',   emoji: '🍱', count: '3' },
  { id: 'beverage', label: '사이드 메뉴', emoji: '🥗', count: '7' },
];

const MenuTab: React.FC<MenuTabProps> = ({ activeCategory, setActiveCategory }) => (
  <div style={{ padding: '12px 20px', display: 'flex', gap: '8px' }}>
    {TABS.map(tab => {
      const isActive = activeCategory === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveCategory(tab.id)}
          aria-pressed={isActive}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            padding: '11px 0',
            borderRadius: '12px',
            border: 'none',
            background: isActive ? 'var(--primary)' : 'var(--surface)',
            color: isActive ? '#fff' : 'var(--text-muted)',
            fontSize: '14px',
            fontWeight: isActive ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(.34,1.56,.64,1)',
            boxShadow: isActive ? '0 4px 16px rgba(49,130,246,0.3)' : 'var(--shadow-sm)',
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ fontSize: '17px', lineHeight: 1 }}>{tab.emoji}</span>
          <span>{tab.label}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            opacity: 0.7,
            background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--surface3)',
            borderRadius: '100px',
            padding: '1px 7px',
          }}>{tab.count}</span>
        </button>
      );
    })}
  </div>
);

export default MenuTab;
