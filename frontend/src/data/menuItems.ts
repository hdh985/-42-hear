import { MenuItemType } from '../components/MenuItem';

const base = (overrides: Omit<MenuItemType, 'change' | 'trend' | 'marketCap' | 'volume' | 'volatility' | 'isSoldOut'>): MenuItemType => ({
  change: '', trend: 'up', marketCap: '', volume: '', volatility: '', isSoldOut: false,
  ...overrides,
});

export const MENU_ITEMS: MenuItemType[] = [
  base({ id: 'main-001', category: 'main', emoji: '🍱', thumbBg: '#FFF3E0', title: '보릿고개도 견디게 한 든든 옛날 도시락', description: '옛날도시락',  price: 20000, investment: '즉시 체포' }),
  base({ id: 'main-002', category: 'main', emoji: '🍜', thumbBg: '#FFEBEE', title: '시장통 끝에서 호호 불던 김치우동',       description: '김치우동',   price: 18000, investment: '체포 권장' }),
  base({ id: 'main-003', category: 'main', emoji: '🍗', thumbBg: '#FFF8E1', title: '잔칫날에나 올라오던 양념닭강정',          description: '양념닭강정', price: 18000, investment: '체포 권장' }),
  base({ id: 'side-001', category: 'side', emoji: '🍿', thumbBg: '#FFFDE7', title: '구멍가게 앞 한 봉지 라면땅',             description: '라면땅',     price:  7000, investment: '' }),
  base({ id: 'side-002', category: 'side', emoji: '🍑', thumbBg: '#FFF9C4', title: '찬물에 담가두고 먹던 황도 통조림',        description: '황도',       price:  7000, investment: '' }),
  base({ id: 'side-003', category: 'side', emoji: '🍥', thumbBg: '#F3E5F5', title: '사촌당숙 졸라 얻은 용돈으로 산 라면',     description: '컵라면',     price:  5000, investment: '' }),
  base({ id: 'side-004', category: 'side', emoji: '🦑', thumbBg: '#E0F7FA', title: '우리 아부지 막걸리상 단골 버터오징어',    description: '버터오징어', price: 10000, investment: '감시 중' }),
  base({ id: 'set-001',  category: 'set',  emoji: '🍽️', thumbBg: '#FCE4EC', title: '어머니 손맛 저녁상 한 끼',              description: '옛날도시락 + 컵라면',    price: 23000, investment: '즉시 체포' }),
  base({ id: 'set-002',  category: 'set',  emoji: '🥢', thumbBg: '#E8EAF6', title: '시장 포장마차 단골상',                   description: '김치우동 + 버터오징어', price: 25000, investment: '수배 중' }),
  base({ id: 'drink-001', category: 'drink', emoji: '💧', thumbBg: '#E3F2FD', title: '물',          description: '', price: 2000, investment: '' }),
  base({ id: 'drink-002', category: 'drink', emoji: '🍫', thumbBg: '#EFEBE9', title: '초코에몽',    description: '', price: 3000, investment: '' }),
  base({ id: 'drink-003', category: 'drink', emoji: '🥤', thumbBg: '#F1F8E9', title: '콜라 / 사이다', description: '', price: 3000, investment: '' }),
];
