import { Asset } from '../types';

export const MY_PORTFOLIO: Asset[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    currency: 'USD',
    currentPrice: 195.50, 
    transactions: [
      { id: '1', type: 'BUY', price: 150.00, quantity: 10, date: '2023-01-01' },
      { id: '2', type: 'BUY', price: 180.00, quantity: 5, date: '2023-06-01' },
    ],
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    currency: 'USD',
    currentPrice: 200.00,
    transactions: [
      { id: '3', type: 'BUY', price: 200.00, quantity: 20, date: '2023-02-15' },
    ],
  },
  {
    ticker: 'GGAL',
    name: 'Grupo Financiero Galicia',
    currency: 'ARS', // <--- Nuevo (Ejemplo local)
    currentPrice: 1350.00,
    transactions: [ { id: '4', type: 'BUY', price: 1500.00, quantity: 8, date: '2023-03-15' } ]
  }
];