export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  price: number; 
  quantity: number;
  date: string;
}

export interface Asset {
  ticker: string; 
  name: string;
  currency: string;
  currentPrice: number;
  transactions: Transaction[];
}