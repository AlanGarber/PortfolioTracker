import { Asset } from '../types';

export const calculateAssetPerformance = (asset: Asset) => {
  let totalQuantity = 0;
  let totalCost = 0;
  let realizedPL = 0; 

  const sortedTransactions = [...asset.transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const t of sortedTransactions) {
    if (t.type === 'BUY') {
      totalQuantity += t.quantity;
      totalCost += t.quantity * t.price;
    } else if (t.type === 'SELL') {
      const currentAvgPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;
      
      const profitFromSale = (t.price - currentAvgPrice) * t.quantity;
      
      realizedPL += profitFromSale;
      totalQuantity -= t.quantity;
      totalCost -= t.quantity * currentAvgPrice; 
    }
  }

  const avgPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;
  const marketValue = totalQuantity * asset.currentPrice;
  
  const unrealizedPL = marketValue - totalCost;
  const unrealizedPLPercentage = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;

  return {
    totalQuantity,
    avgPrice,
    marketValue,
    unrealizedPL,      
    unrealizedPLPercentage,
    realizedPL,        
    totalPL: unrealizedPL + realizedPL 
  };
};