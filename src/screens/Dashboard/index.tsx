import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePortfolio } from '../../context/PortfolioContext';
import { AssetCard } from '../../components/portfolio/AssetCard';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { calculateAssetPerformance } from '../../utils/finance';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const { assets, loading, refreshData, exchangeRate } = usePortfolio();
  const navigation = useNavigation<NavigationProps>();

  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'ARS'>('USD');
  const safeExchangeRate = exchangeRate || 1;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleCurrencyChange = (currency: 'USD' | 'ARS') => {
    if (currency === displayCurrency) return;

    setDisplayCurrency(currency);
    Animated.timing(slideAnim, {
      toValue: currency === 'USD' ? 0 : 1,
      duration: 250, // Milisegundos
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 47]
  });

  const portfolioStats = useMemo(() => {
    let totalBalanceUSD = 0;
    let totalUnrealizedPL_USD = 0;
    let totalCostUSD = 0;

    assets.forEach(asset => {
      const stats = calculateAssetPerformance(asset);
      if (stats.totalQuantity > 0) {
        let marketValueUSD = stats.marketValue;
        let unrealizedPL_USD = stats.unrealizedPL;
        let costUSD = stats.marketValue - stats.unrealizedPL;

        if (asset.currency === 'ARS' && safeExchangeRate > 1) {
          marketValueUSD = stats.marketValue / safeExchangeRate;
          unrealizedPL_USD = stats.unrealizedPL / safeExchangeRate;
          costUSD = costUSD / safeExchangeRate;
        }

        totalBalanceUSD += marketValueUSD;
        totalUnrealizedPL_USD += unrealizedPL_USD;
        totalCostUSD += costUSD;
      }
    });

    const totalPLPercentage = totalCostUSD > 0 ? (totalUnrealizedPL_USD / totalCostUSD) * 100 : 0;
    return { totalBalanceUSD, totalUnrealizedPL_USD, totalPLPercentage };
  }, [assets, safeExchangeRate]);

  const isUSD = displayCurrency === 'USD';

  const currentBalance = isUSD
    ? portfolioStats.totalBalanceUSD
    : portfolioStats.totalBalanceUSD * safeExchangeRate;

  const currentPL = isUSD
    ? portfolioStats.totalUnrealizedPL_USD
    : portfolioStats.totalUnrealizedPL_USD * safeExchangeRate;

  const pnlColor = currentPL >= 0 ? colors.semantic.success : colors.semantic.danger;

  const handlePressAsset = (asset: any) => {
    navigation.navigate('AssetDetail', { ticker: asset.ticker });
  };

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerSubtitle}>{formattedDate}</Text>
          <Text style={styles.headerTitle}>Resumen</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeaderRow}>
          <Text style={styles.summaryLabel}>
            Patrimonio Neto ({displayCurrency})
          </Text>

          <View style={styles.selectorContainer}>
            <Animated.View style={[styles.selectorIndicator, { transform: [{ translateX }] }]} />

            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => handleCurrencyChange('USD')}
              activeOpacity={1}
            >
              <Text style={styles.flagText}>🇺🇸</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => handleCurrencyChange('ARS')}
              activeOpacity={1}
            >
              <Text style={styles.flagText}>🇦🇷</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.summaryBalance}>
          {formatCurrency(currentBalance, displayCurrency)}
        </Text>

        <View style={styles.pnlContainer}>
          <Text style={[styles.pnlText, { color: pnlColor }]}>
            {currentPL > 0 ? '+' : ''}
            {formatCurrency(currentPL, displayCurrency)}
          </Text>
          <View style={[styles.pnlBadge, { backgroundColor: pnlColor + '20' }]}>
            <Text style={[styles.pnlPercentage, { color: pnlColor }]}>
              {formatPercentage(portfolioStats.totalPLPercentage)}
            </Text>
          </View>
        </View>

        {safeExchangeRate > 1 && (
          <Text style={styles.exchangeRateText}>
            Dólar MEP: {formatCurrency(safeExchangeRate, 'ARS')}
          </Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Tus Activos</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      {loading && assets.length === 0 ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={assets.filter(a => calculateAssetPerformance(a).totalQuantity > 0)}
          keyExtractor={(item) => item.ticker}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <AssetCard asset={item} onPress={handlePressAsset} />
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshData} tintColor={colors.primary} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}