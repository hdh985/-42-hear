import React from 'react';

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function MenuTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="tab-navigation">
      <button className={`tab-button ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>음식</button>
      <button className={`tab-button ${activeTab === 'drinks' ? 'active' : ''}`} onClick={() => setActiveTab('drinks')}>음료</button>
      <button className={`tab-button ${activeTab === 'hear' ? 'active' : ''}`} onClick={() => setActiveTab('hear')}>Hear</button>
    </div>
  );
}
