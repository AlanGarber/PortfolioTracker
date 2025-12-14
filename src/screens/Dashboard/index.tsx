import React from 'react';
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

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const { assets, loading, refreshData } = usePortfolio();
  const navigation = useNavigation<NavigationProps>();
  const handlePressAsset = (asset: any) => {
    navigation.navigate('AssetDetail', { ticker: asset.ticker });
  };

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