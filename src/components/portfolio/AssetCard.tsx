import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Asset } from '../../types';
import { calculateAssetPerformance } from '../../utils/finance';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { colors } from '../../theme/colors';

interface AssetCardProps {
  asset: Asset;
  onPress?: (asset: Asset) => void;
}

export const AssetCard = ({ asset, onPress }: AssetCardProps) => {
  const stats = calculateAssetPerformance(asset);
  const isProfitable = stats.unrealizedPL >= 0;
  const pnlColor = isProfitable ? colors.semantic.success : colors.semantic.danger;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(asset)}
      activeOpacity={0.7}
    >
      {/* Fila Superior */}
      <View style={styles.row}>
        <View>
          <Text style={styles.ticker}>{asset.ticker}</Text>
          <Text style={styles.name}>{asset.name}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.price}>
            {formatCurrency(asset.currentPrice, asset.currency)}
          </Text>
          <Text style={[styles.pnl, { color: pnlColor }]}>
            {formatCurrency(stats.unrealizedPL, asset.currency)} ({formatPercentage(stats.unrealizedPLPercentage)})
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.detail}>
          Tenencia: {stats.totalQuantity}
        </Text>
        <Text style={styles.detail}>
          Prom: {formatCurrency(stats.avgPrice, asset.currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ticker: { fontSize: 18, fontWeight: 'bold', color: colors.text.primary },
  name: { fontSize: 14, color: colors.text.secondary, marginTop: 2 },
  price: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  pnl: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.background, marginVertical: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  detail: { fontSize: 12, color: colors.text.secondary, fontWeight: '500' },
});