// types.ts

export type MenuItemType = {
    id: number | string;
    title: string;
    description: string;
    price: number;
    image: string;
    badge?: string;
    stock?: number;
    change?: string;
  };
  
  export type TabCategory = 'food' | 'drinks' | 'hear';
  
  export type QuantityMap = {
    [key: number]: number;
  };
  