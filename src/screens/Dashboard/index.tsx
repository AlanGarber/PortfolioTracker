import React, { useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePortfolio } from '../../context/PortfolioContext';
import { AssetCard } from '../../components/portfolio/AssetCard';
import { styles } from './styles';
import { TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { calculateAssetPerformance } from '../../utils/finance';
import { colors } from '../../theme/colors';
import { formatCurrency, formatPercentage } from '../../utils/format';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const { assets, loading, refreshData } = usePortfolio();
  const navigation = useNavigation<NavigationProps>();

  const portfolioStats = useMemo(() => {
    let totalBalance = 0;
    let totalUnrealizedPL = 0;
    let totalCost = 0;

    assets.forEach(asset => {
      const stats = calculateAssetPerformance(asset);
      if (stats.totalQuantity > 0) {
        totalBalance += stats.marketValue;
        totalUnrealizedPL += stats.unrealizedPL;
        totalCost += (stats.marketValue - stats.unrealizedPL);
      }
    });

    const totalPLPercentage = totalCost > 0 ? (totalUnrealizedPL / totalCost) * 100 : 0;

    return { totalBalance, totalUnrealizedPL, totalPLPercentage };
  }, [assets]);

  const handlePressAsset = (asset: any) => {
    navigation.navigate('AssetDetail', { ticker: asset.ticker });
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  const pnlColor = portfolioStats.totalUnrealizedPL >= 0 ? colors.semantic.success : colors.semantic.danger;

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* FILA SUPERIOR: Título y Avatar */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerSubtitle}>{formattedDate}</Text>
          <Text style={styles.headerTitle}>Resumen</Text>
        </View>

        {/* Placeholder de Avatar (Círculo Gris/Azul) */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      </View>

      {/* TARJETA DE BALANCE GLOBAL (La que hicimos antes) */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Balance Total</Text>
        <Text style={styles.summaryBalance}>
          {formatCurrency(portfolioStats.totalBalance)}
        </Text>

        <View style={styles.pnlContainer}>
          <Text style={[styles.pnlText, { color: pnlColor }]}>
            {portfolioStats.totalUnrealizedPL > 0 ? '+' : ''}
            {formatCurrency(portfolioStats.totalUnrealizedPL)}
          </Text>
          <View style={[styles.pnlBadge, { backgroundColor: pnlColor + '20' }]}>
            <Text style={[styles.pnlPercentage, { color: pnlColor }]}>
              {formatPercentage(portfolioStats.totalPLPercentage)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tus Activos</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PortfolioTracker</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.text.secondary }}>Cargando portafolio...</Text>
        </View>
      ) : (
        <FlatList
          data={assets.filter(a => {
            const stats = calculateAssetPerformance(a);
            return stats.totalQuantity > 0;
          })}
          keyExtractor={(item) => item.ticker}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AssetCard
              asset={item}
              onPress={handlePressAsset}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshData}
              tintColor={colors.primary}
            />
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