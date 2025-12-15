import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import { Asset, Transaction } from '../types';
import { supabase } from '../services/supabase';
import { groupTransactionsByAsset } from '../utils/transform';
import { calculateAssetPerformance } from '../utils/finance';
import { MarketAsset, fetchLivePrices } from '../services/prices';
import { fetchDollarRate } from '../services/dolar';

interface PortfolioContextType {
  assets: Asset[];
  availableAssets: MarketAsset[];
  loading: boolean;
  exchangeRate: number;
  addTransaction: (tx: Omit<Transaction, 'id'> & { ticker: string }) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [availableAssets, setAvailableAssets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const [transactionsResponse, marketData, dollarRate] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        fetchLivePrices(),
        fetchDollarRate()
      ]);

      const { data, error } = transactionsResponse;

      if (error) throw error;

      if (data) {


        const marketMap = marketData.reduce((acc, item) => {
          acc[item.ticker] = item;
          return acc;
        }, {} as Record<string, MarketAsset>);

        const groupedAssets = groupTransactionsByAsset(data);

        const enrichedAssets = groupedAssets.map(asset => {
          const marketInfo = marketMap[asset.ticker];
          return {
            ...asset,
            currentPrice: marketInfo ? marketInfo.price : asset.currentPrice,
            currency: marketInfo ? marketInfo.currency : asset.currency,
            name: marketInfo ? marketInfo.name : asset.name
          };
        });

        setExchangeRate(dollarRate);
        setAvailableAssets(marketData);
        setAssets(enrichedAssets);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'No se pudieron cargar las inversiones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const addTransaction = async (newTx: Omit<Transaction, 'id'> & { ticker: string }) => {

    if (newTx.type === 'SELL') {
      const availableAsset = assets.find(a => a.ticker === newTx.ticker);
      if (!availableAsset) {
        Alert.alert("Error", "No tienes este activo.");
        return;
      }
      const stats = calculateAssetPerformance(availableAsset);
      if (newTx.quantity > stats.totalQuantity) {
        Alert.alert("Saldo Insuficiente", `Solo tienes ${stats.totalQuantity} acciones.`);
        return;
      }
    }

    try {
      const { error } = await supabase.from('transactions').insert({
        ticker: newTx.ticker,
        type: newTx.type,
        price: newTx.price,
        quantity: newTx.quantity,
        date: newTx.date,
      });

      if (error) throw error;

      await fetchPortfolio();

    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción');
    }
  };

  return (
    <PortfolioContext.Provider value={{
      assets,
      availableAssets,
      loading,
      exchangeRate,
      addTransaction,
      refreshData: fetchPortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio debe usarse dentro de un PortfolioProvider');
  return context;
};