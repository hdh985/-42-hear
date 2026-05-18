import React from 'react';

export type CategoryId = 'main' | 'side' | 'set' | 'drink';

interface MenuTabProps {
  activeCategory: CategoryId;
  setActiveCategory: React.Dispatch<React.SetStateAction<CategoryId>>;
}

const TABS: { id: CategoryId; label: string; count: number }[] = [
  { id: 'main',  label: '메인',  count: 3 },
  { id: 'side',  label: '사이드', count: 4 },
  { id: 'set',   label: '세트',  count: 2 },
  { id: 'drink', label: '음료',  count: 3 },
];

const MenuTab: React.FC<MenuTabProps> = ({ activeCategory, setActiveCategory }) => (
  <nav
    style={{
      display: 'flex',
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E8EB',
      padding: '0 4px',
    }}
  >
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
            gap: '6px',
            padding: '14px 8px 13px',
            border: 'none',
            borderBottom: isActive ? '2px solid #3182F6' : '2px solid transparent',
            marginBottom: '-1px',
            background: 'transparent',
            color: isActive ? '#3182F6' : '#B0B8C1',
            fontSize: '14px',
            fontWeight: isActive ? 700 : 500,
            cursor: 'pointer',
            letterSpacing: '-0.02em',
            transition: 'all 0.15s ease',
          }}
        >
          <span>{tab.label}</span>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: isActive ? '#3182F6' : '#B0B8C1',
            background: isActive ? '#EBF3FE' : '#F2F4F6',
            borderRadius: '100px',
            padding: '1px 7px',
            transition: 'all 0.15s ease',
          }}>
            {tab.count}
          </span>
        </button>
      );
    })}
  </nav>
);

export default MenuTab;
