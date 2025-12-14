import { Asset, Transaction } from '../types';

export const groupTransactionsByAsset = (rawTransactions: any[]): Asset[] => {
  const assetsMap: Record<string, Asset> = {};

  rawTransactions.forEach((tx) => {
    const formattedTx: Transaction = {
      id: tx.id,
      type: tx.type,
      price: Number(tx.price),    
      quantity: Number(tx.quantity),
      date: tx.date,
    };

    if (!assetsMap[tx.ticker]) {
      assetsMap[tx.ticker] = {
        ticker: tx.ticker,
        name: tx.ticker, 
        currency: 'USD', 
        currentPrice: formattedTx.price, 
        transactions: [],
      };
    }

    assetsMap[tx.ticker].transactions.push(formattedTx);
  });

  return Object.values(assetsMap);
};