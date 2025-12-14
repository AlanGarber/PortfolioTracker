import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import { Asset, Transaction } from '../types';
import { supabase } from '../services/supabase';
import { groupTransactionsByAsset } from '../utils/transform';
import { calculateAssetPerformance } from '../utils/finance';
import { fetchLivePrices } from '../services/prices';

interface PortfolioContextType {
  assets: Asset[];
  loading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id'> & { ticker: string }) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const [transactionsResponse, livePrices] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        fetchLivePrices()
      ]);

      const { data, error } = transactionsResponse;

      if (error) throw error;

      if (data) {
        const groupedAssets = groupTransactionsByAsset(data);

        const pricesMap = livePrices.reduce((acc, item) => {
          acc[item.ticker] = item.price;
          return acc;
        }, {} as Record<string, number>);

        const assetsWithLivePrices = groupedAssets.map(asset => {

          const ticker = asset.ticker;
          const livePrice = pricesMap[ticker];
          return {
            ...asset,
            currentPrice: livePrice || asset.currentPrice
          };
        });

        setAssets(assetsWithLivePrices);
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
      const asset = assets.find(a => a.ticker === newTx.ticker);
      if (!asset) {
        Alert.alert("Error", "No tienes este activo.");
        return;
      }
      const stats = calculateAssetPerformance(asset);
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
    <PortfolioContext.Provider value={{ assets, loading, addTransaction, refreshData: fetchPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio debe usarse dentro de un PortfolioProvider');
  return context;
};